import React, { useState, useEffect, useMemo } from 'react';
import type { MaramatakaPhase, UserLocation } from '../../types';
import { getMaramatakaPhaseForDate } from '../../hooks/useMaramataka';
import { Modal } from './Modal';
import { TripLogModal } from './TripLogModal';
import { calculateBiteTimes } from '../../lib/helpers';
import { getWeather, searchLocation, reverseGeocode } from '../../lib/api';

interface DailyDetailModalProps {
  date: Date;
  onClose: () => void;
  location: UserLocation | null;
  onLocationUpdate: (location: UserLocation) => void;
  onDataChange: () => void;
}

const ratingColorMap = {
    Excellent: 'bg-green-500 text-green-100',
    Good: 'bg-blue-500 text-blue-100',
    Average: 'bg-yellow-500 text-yellow-100',
    Poor: 'bg-red-500 text-red-100',
};

export const DailyDetailModal: React.FC<DailyDetailModalProps> = ({ date, onClose, location, onLocationUpdate, onDataChange }) => {
  const [phase, setPhase] = useState<MaramatakaPhase | null>(null);
  const [biteTimes, setBiteTimes] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [sunMoon, setSunMoon] = useState<any>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const [isTripLogOpen, setIsTripLogOpen] = useState(false);

  useEffect(() => {
    setPhase(getMaramatakaPhaseForDate(date));
    
    if (location) {
      // @ts-ignore
      setSunMoon(SunCalc.getTimes(date, location.lat, location.lon));
      setBiteTimes(calculateBiteTimes(date, location.lat, location.lon));
      getWeather(location.lat, location.lon, date).then(setWeather);
    }
  }, [date, location]);

  const handleSearch = async () => {
      if (!locationSearch) return;
      setIsSearching(true);
      const result = await searchLocation(locationSearch);
      if (result) {
          onLocationUpdate(result);
      } else {
          alert('Location not found.');
      }
      setIsSearching(false);
  };
  
  const handleGPS = () => {
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        if(result) {
            onLocationUpdate(result);
        } else {
            alert('Could not determine location name.');
        }
        setIsSearching(false);
    }, (error) => {
        alert('Could not get GPS location.');
        console.error(error);
        setIsSearching(false);
    });
  };

  const dateString = date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (!phase) return null;
  
  if (isTripLogOpen) {
    return <TripLogModal date={date} onClose={() => setIsTripLogOpen(false)} onDataChange={() => { onDataChange(); setIsTripLogOpen(false); }} />;
  }

  return (
    <Modal title={phase.name} onClose={onClose} size="xl">
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-lg text-slate-400">{dateString}</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full mt-2 inline-block ${ratingColorMap[phase.quality]}`}>
                    {phase.quality} Fishing
                </span>
                <p className="mt-2 text-slate-300 max-w-md mx-auto">{phase.description}</p>
            </div>
            
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h3 className="font-bold text-white mb-2">Location</h3>
                {!location ? (
                    <div className="space-y-2">
                        <p className="text-sm text-slate-400">Set a location for bite times & weather.</p>
                         <div className="flex gap-2">
                            <input type="text" value={locationSearch} onChange={e => setLocationSearch(e.target.value)} placeholder="e.g., Lake Taupo" className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            <button onClick={handleSearch} disabled={isSearching} className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md disabled:opacity-50"><i className="fa-solid fa-search"></i></button>
                            <button onClick={handleGPS} disabled={isSearching} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md disabled:opacity-50"><i className="fa-solid fa-location-crosshairs"></i></button>
                        </div>
                    </div>
                ) : (
                     <div className="flex justify-between items-center">
                        <p className="font-semibold text-teal-300">{location.name}</p>
                        <button onClick={() => onLocationUpdate(null)} className="text-sm text-slate-400 hover:text-white">Change</button>
                    </div>
                )}
            </div>
            
            {location && (
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">Bite Times</h4>
                        {biteTimes ? <div className="space-y-1">
                            <p><strong>Major:</strong> {biteTimes.major[0].start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {biteTimes.major[0].end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Major:</strong> {biteTimes.major[1].start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {biteTimes.major[1].end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Minor:</strong> {biteTimes.minor[0].start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {biteTimes.minor[0].end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><strong>Minor:</strong> {biteTimes.minor[1].start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {biteTimes.minor[1].end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div> : <p>Calculating...</p>}
                    </div>
                     <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="font-bold text-white mb-2">Sun & Moon</h4>
                         {sunMoon ? <div className="space-y-1">
                            <p><i className="fa-solid fa-sun mr-2 text-yellow-400"></i> {sunMoon.sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {sunMoon.sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p><i className="fa-solid fa-moon mr-2 text-slate-400"></i> {sunMoon.moonrise?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) ?? 'N/A'} - {sunMoon.moonset?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) ?? 'N/A'}</p>
                         </div> : <p>Calculating...</p>}
                    </div>
                     <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 md:col-span-2">
                        <h4 className="font-bold text-white mb-2">Weather Forecast</h4>
                         {weather ? (
                            <div className="flex justify-around text-center">
                                <div><p className="font-bold text-lg">{weather.temperature_2m_max}°C</p><p className="text-xs text-slate-400">Max Temp</p></div>
                                <div><p className="font-bold text-lg">{weather.temperature_2m_min}°C</p><p className="text-xs text-slate-400">Min Temp</p></div>
                                <div><p className="font-bold text-lg">{weather.wind_speed_10m_max} km/h</p><p className="text-xs text-slate-400">Wind</p></div>
                                <div><p className="font-bold text-lg">{weather.precipitation_sum} mm</p><p className="text-xs text-slate-400">Rain</p></div>
                            </div>
                         ) : <p>Fetching weather...</p>}
                    </div>
                </div>
            )}
            
            <div className="text-center pt-4">
                <button onClick={() => setIsTripLogOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-colors">
                    <i className="fa-solid fa-book-open mr-2"></i> View / Manage Trip Logs
                </button>
            </div>
        </div>
    </Modal>
  );
};
