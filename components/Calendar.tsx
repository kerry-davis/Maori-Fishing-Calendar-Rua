import React from 'react';
import type { CalendarDay } from '../types';
import { FishingRating } from '../types';
import { useCalendarData } from '../hooks/useMaramataka';

interface CalendarProps {
  displayedDate: Date;
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (date: Date) => void;
  dataVersion: number;
}

const ratingColorMap: Record<FishingRating, string> = {
  [FishingRating.Excellent]: 'bg-green-400',
  [FishingRating.Good]: 'bg-blue-400',
  [FishingRating.Average]: 'bg-yellow-400',
  [FishingRating.Poor]: 'bg-red-500',
};

const DayCell: React.FC<{ day: CalendarDay; onClick: () => void }> = ({ day, onClick }) => {
  const cellClasses = [
    'relative flex flex-col items-center justify-start h-24 p-2 rounded-lg transition-all duration-200 cursor-pointer',
    'hover:scale-105 hover:bg-slate-700',
    day.isCurrentMonth ? 'bg-slate-800/50' : 'bg-slate-900/50 text-slate-600',
    day.isToday ? 'border-2 border-teal-400' : 'border border-slate-700/50',
  ].join(' ');

  const dayNumberClasses = [
    'font-semibold',
    day.isToday ? 'text-teal-300' : 'text-slate-300'
  ].join(' ');

  return (
    <div className={cellClasses} onClick={onClick} role="button" tabIndex={0} aria-label={`View details for ${day.date.toDateString()}`}>
      <span className={dayNumberClasses}>{day.dayOfMonth}</span>
      {day.isCurrentMonth && (
        <div title={day.phase.quality} className={`absolute bottom-2 w-2.5 h-2.5 rounded-full ${ratingColorMap[day.phase.quality]}`}></div>
      )}
      {day.hasLog && (
        <i className="fas fa-fish text-cyan-400 text-xs absolute bottom-1.5 right-1.5" title="Trip Logged"></i>
      )}
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ displayedDate, monthName, onPrevMonth, onNextMonth, onDayClick, dataVersion }) => {
  const { days, loading } = useCalendarData(displayedDate, dataVersion);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
      return (
          <div className="text-center p-8 bg-slate-800 rounded-xl shadow-lg border border-slate-700 min-h-[480px] flex items-center justify-center">
              <p className="text-xl text-slate-300 animate-pulse">Calculating the currents...</p>
          </div>
      )
  }

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{monthName}</h2>
        <div className="flex space-x-2">
          <button onClick={onPrevMonth} aria-label="Previous month" className="w-10 h-10 flex items-center justify-center bg-teal-500/80 hover:bg-teal-500 rounded-md transition-colors">&lt;</button>
          <button onClick={onNextMonth} aria-label="Next month" className="w-10 h-10 flex items-center justify-center bg-teal-500/80 hover:bg-teal-500 rounded-md transition-colors">&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-400 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => <DayCell key={index} day={day} onClick={() => onDayClick(day.date)} />)}
      </div>
    </div>
  );
};

export default Calendar;
