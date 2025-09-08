import type { UserLocation } from '../types';

export const getWeather = async (lat: number, lon: number, date: Date) => {
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&start_date=${dateString}&end_date=${dateString}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather data not available');
    const data = await response.json();
    return data.daily ? {
        temperature_2m_max: data.daily.temperature_2m_max[0],
        temperature_2m_min: data.daily.temperature_2m_min[0],
        precipitation_sum: data.daily.precipitation_sum[0],
        wind_speed_10m_max: data.daily.wind_speed_10m_max[0],
    } : null;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
};

export const searchLocation = async (query: string): Promise<UserLocation | null> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Location search failed');
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to search location:", error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<UserLocation | null> => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Reverse geocode failed');
        const data = await response.json();
        if (data && data.display_name) {
            return { lat, lon, name: data.display_name };
        }
        return null;
    } catch (error) {
        console.error("Failed to reverse geocode:", error);
        return null;
    }
};
