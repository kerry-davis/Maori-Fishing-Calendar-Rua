import type { Trip, FishCatch, WeatherLog } from '../types';

let db: IDBDatabase;
const DB_NAME = 'fishingDB';
const DB_VERSION = 1;

export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      
      if (!dbInstance.objectStoreNames.contains('trips')) {
        const tripStore = dbInstance.createObjectStore('trips', { keyPath: 'id', autoIncrement: true });
        tripStore.createIndex('date', 'date', { unique: false });
      }

      if (!dbInstance.objectStoreNames.contains('fish_caught')) {
        const fishStore = dbInstance.createObjectStore('fish_caught', { keyPath: 'id', autoIncrement: true });
        fishStore.createIndex('tripId', 'tripId', { unique: false });
      }
      
      if (!dbInstance.objectStoreNames.contains('weather_logs')) {
         const weatherStore = dbInstance.createObjectStore('weather_logs', { keyPath: 'id', autoIncrement: true });
         weatherStore.createIndex('tripId', 'tripId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };

    request.onerror = (event) => {
      console.error("Database error: ", (event.target as IDBOpenDBRequest).error);
      reject(false);
    };
  });
};

const performDBRequest = <T>(storeName: string, mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest): Promise<T> => {
    return new Promise((resolve, reject) => {
        if (!db) {
            return reject("DB not initialized");
        }
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = action(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// --- Trip Functions ---
export const addTrip = (trip: Trip) => performDBRequest<number>('trips', 'readwrite', store => store.add(trip));
export const getTripsByDate = (date: string) => performDBRequest<Trip[]>('trips', 'readonly', store => store.index('date').getAll(date));
export const updateTrip = (trip: Trip) => performDBRequest<number>('trips', 'readwrite', store => store.put(trip));
export const deleteTrip = async (tripId: number) => {
    // Also delete associated catches and weather
    const fishes = await getFishByTrip(tripId);
    for(const fish of fishes) {
        await deleteFish(fish.id);
    }
    // Similar logic for weather logs...
    return performDBRequest<void>('trips', 'readwrite', store => store.delete(tripId));
};

// --- FishCatch Functions ---
export const addFish = (fish: FishCatch) => performDBRequest<number>('fish_caught', 'readwrite', store => store.add(fish));
export const getFishByTrip = (tripId: number) => performDBRequest<FishCatch[]>('fish_caught', 'readonly', store => store.index('tripId').getAll(tripId));
export const updateFish = (fish: FishCatch) => performDBRequest<number>('fish_caught', 'readwrite', store => store.put(fish));
export const deleteFish = (fishId: number) => performDBRequest<void>('fish_caught', 'readwrite', store => store.delete(fishId));

// --- WeatherLog Functions ---
export const addWeather = (weather: WeatherLog) => performDBRequest<number>('weather_logs', 'readwrite', store => store.add(weather));
export const getWeatherByTrip = (tripId: number) => performDBRequest<WeatherLog[]>('weather_logs', 'readonly', store => store.index('tripId').getAll(tripId));
export const updateWeather = (weather: WeatherLog) => performDBRequest<number>('weather_logs', 'readwrite', store => store.put(weather));
export const deleteWeather = (weatherId: number) => performDBRequest<void>('weather_logs', 'readwrite', store => store.delete(weatherId));
