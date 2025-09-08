import { useState, useEffect, useMemo, useCallback } from 'react';
import type { CalendarDay, MaramatakaPhase } from '../types';
import { MARAMATAKA_PHASES } from '../data/maramatakaData';
import { getTripsByDate } from '../lib/db';

const newMoonDatesUTC = [
    '2024-01-11T11:57Z', '2024-02-09T22:59Z', '2024-03-10T09:00Z', '2024-04-08T18:21Z', 
    '2024-05-08T03:22Z', '2024-06-06T12:38Z', '2024-07-05T22:57Z', '2024-08-04T11:13Z', 
    '2024-09-03T01:55Z', '2024-10-02T18:49Z', '2024-11-01T12:47Z', '2024-12-01T06:21Z', 
    '2024-12-30T22:27Z', '2025-01-29T12:36Z', '2025-02-28T00:45Z', '2025-03-29T10:58Z', 
    '2025-04-27T21:32Z', '2025-05-27T08:03Z', '2025-06-25T18:42Z', '2025-07-25T05:51Z', 
    '2025-08-23T17:15Z', '2025-09-22T05:19Z', '2025-10-21T18:17Z', '2025-11-20T08:14Z', 
    '2025-12-20T00:33Z'
].map(d => new Date(d));

export const findLastNewMoon = (currentDate: Date): Date => {
    let lastNewMoon = newMoonDatesUTC[0];
    for (const newMoon of newMoonDatesUTC) {
        if (newMoon <= currentDate) {
            lastNewMoon = newMoon;
        } else {
            break;
        }
    }
    return lastNewMoon;
};

export const getMaramatakaPhaseForDate = (date: Date): MaramatakaPhase => {
    const lastNewMoon = findLastNewMoon(date);
    const diffTime = date.getTime() - lastNewMoon.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const lunarDayIndex = diffDays % 30;
    return MARAMATAKA_PHASES[lunarDayIndex];
};

export const useCalendarData = (displayedDate: Date, dataVersion: number) => {
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState<CalendarDay[]>([]);

    const generateCalendar = useCallback(async (date: Date) => {
        setLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(year, month, 1);
        const dayOfWeek = firstDayOfMonth.getDay();
        const paddingDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(firstDayOfMonth.getDate() - paddingDays);

        const calendarDays: CalendarDay[] = [];
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            currentDate.setHours(0, 0, 0, 0);
            
            const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
            const trips = await getTripsByDate(dateString);

            calendarDays.push({
                date: currentDate,
                dayOfMonth: currentDate.getDate(),
                phase: getMaramatakaPhaseForDate(currentDate),
                isToday: currentDate.getTime() === today.getTime(),
                isCurrentMonth: currentDate.getMonth() === month,
                hasLog: trips.length > 0,
            });
        }
        setDays(calendarDays);
        setLoading(false);
    }, []);
    
    useEffect(() => {
        generateCalendar(displayedDate);
    }, [displayedDate, dataVersion, generateCalendar]);

    return { days, loading };
};
