import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import Header from './components/Header';
import { DailyDetailModal } from './components/modals/DailyDetailModal';
import { initDB } from './lib/db';
import type { UserLocation } from './types';

// Stubs for other modals to be implemented
const TackleboxModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-slate-800 p-8 rounded-lg text-white" onClick={e => e.stopPropagation()}>Tackle Box Modal (WIP)</div></div>;
const AnalyticsModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-slate-800 p-8 rounded-lg text-white" onClick={e => e.stopPropagation()}>Analytics Modal (WIP)</div></div>;
const SettingsModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-slate-800 p-8 rounded-lg text-white" onClick={e => e.stopPropagation()}>Settings Modal (WIP)</div></div>;
const GalleryModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-slate-800 p-8 rounded-lg text-white" onClick={e => e.stopPropagation()}>Gallery Modal (WIP)</div></div>;
const SearchModal = ({ onClose }) => <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}><div className="bg-slate-800 p-8 rounded-lg text-white" onClick={e => e.stopPropagation()}>Search Modal (WIP)</div></div>;


const App: React.FC = () => {
  const [displayedDate, setDisplayedDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState<{type: string, data?: any} | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Used to trigger data refetches

  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const savedLocation = localStorage.getItem('userLocation');
    return savedLocation ? JSON.parse(savedLocation) : null;
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    initDB().then(() => setDbInitialized(true));
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLocationUpdate = useCallback((location: UserLocation) => {
    localStorage.setItem('userLocation', JSON.stringify(location));
    setUserLocation(location);
  }, []);
  
  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  const handleDayClick = (date: Date) => {
    setActiveModal({ type: 'dayDetail', data: { date }});
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  const handleHeaderAction = (action: string) => {
    setActiveModal({ type: action });
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const monthName = useMemo(() => 
    displayedDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
    [displayedDate]
  );

  const handlePrevMonth = () => {
    setDisplayedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const renderActiveModal = () => {
    if (!activeModal) return null;

    switch(activeModal.type) {
      case 'dayDetail':
        return <DailyDetailModal 
                  date={activeModal.data.date} 
                  onClose={handleModalClose}
                  location={userLocation}
                  onLocationUpdate={handleLocationUpdate}
                  onDataChange={refreshData}
                />;
      case 'search':
        return <SearchModal onClose={handleModalClose} />;
      case 'analytics':
        return <AnalyticsModal onClose={handleModalClose} />;
      case 'settings':
         return <SettingsModal onClose={handleModalClose} />;
      case 'gallery':
        return <GalleryModal onClose={handleModalClose} />;
      case 'tacklebox':
        return <TackleboxModal onClose={handleModalClose} />;
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans antialiased">
      <main className="container mx-auto px-4 py-8">
        <Header onAction={handleHeaderAction} onToggleTheme={toggleTheme} isDarkTheme={theme === 'dark'}/>
        
        <div className="max-w-4xl mx-auto mt-8">
          {dbInitialized ? (
            <Calendar 
              displayedDate={displayedDate}
              monthName={monthName}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onDayClick={handleDayClick}
              dataVersion={dataVersion}
            />
          ) : (
             <div className="text-center p-8 bg-slate-800 rounded-xl shadow-lg">
              <p className="text-xl text-slate-300">Initializing Database...</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-4 text-white">Fishing Quality Legend</h3>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-full bg-green-400"></div><span>Excellent</span></div>
                      <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-full bg-blue-400"></div><span>Good</span></div>
                      <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-full bg-yellow-400"></div><span>Average</span></div>
                      <div className="flex items-center space-x-3"><div className="w-4 h-4 rounded-full bg-red-500"></div><span>Poor</span></div>
                  </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                  <h3 className="text-xl font-bold mb-4 text-white">Current Location</h3>
                  {userLocation ? (
                      <div>
                          <p className="font-semibold text-teal-300">{userLocation.name}</p>
                          <p className="text-sm text-slate-400">Lat: {userLocation.lat.toFixed(4)}, Lon: {userLocation.lon.toFixed(4)}</p>
                      </div>
                  ) : (
                      <p className="text-slate-400">No location set. Click a day to set your location for bite times and weather.</p>
                  )}
              </div>
          </div>
        </div>
        
        <footer className="w-full text-center text-slate-500 text-sm mt-12 pb-6">
          <p>Māori Fishing Calendar • Based on traditional Māori lunar knowledge</p>
        </footer>
      </main>
      
      {renderActiveModal()}
    </div>
  );
};

export default App;
