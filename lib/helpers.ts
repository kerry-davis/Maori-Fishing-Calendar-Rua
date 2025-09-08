// This file assumes SunCalc is available on the window object from the CDN script.
// @ts-nocheck

import { getMaramatakaPhaseForDate } from '../hooks/useMaramataka';

export const calculateBiteTimes = (date: Date, lat: number, lon: number) => {
  const phase = getMaramatakaPhaseForDate(date);
  
  // 1. Get moon rise and set times
  const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
  const { rise: moonrise, set: moonset } = moonTimes;

  // 2. Calculate moon transit times (upper and lower)
  // A simple approximation: Find the moon's highest point (upper transit)
  // The lower transit is roughly 12 hours 25 minutes from the upper transit.
  let upperTransit;
  let maxAltitude = -1;
  for (let i = 0; i < 24 * 60; i++) {
    const checkDate = new Date(date.getTime() + i * 60 * 1000);
    const moonPos = SunCalc.getMoonPosition(checkDate, lat, lon);
    if (moonPos.altitude > maxAltitude) {
      maxAltitude = moonPos.altitude;
      upperTransit = checkDate;
    }
  }

  let lowerTransit;
  if(upperTransit) {
    lowerTransit = new Date(upperTransit.getTime() + 12 * 60 * 60 * 1000 + 25 * 60 * 1000);
    // Ensure lowerTransit is on the same day for calculation simplicity
    if (lowerTransit.getDate() !== date.getDate()) {
       lowerTransit = new Date(upperTransit.getTime() - (12 * 60 * 60 * 1000 + 25 * 60 * 1000));
    }
  }

  const majorBites = [];
  const minorBites = [];

  // 3. Create bite windows based on these events
  if (upperTransit) {
    majorBites.push({
      start: new Date(upperTransit.getTime() - 60 * 60 * 1000),
      end: new Date(upperTransit.getTime() + 60 * 60 * 1000),
      quality: phase.biteQualities[0],
    });
  }
  
  if (lowerTransit) {
    majorBites.push({
      start: new Date(lowerTransit.getTime() - 60 * 60 * 1000),
      end: new Date(lowerTransit.getTime() + 60 * 60 * 1000),
      quality: phase.biteQualities[1],
    });
  }

  if (moonrise && !isNaN(moonrise.getTime())) {
    minorBites.push({
      start: new Date(moonrise.getTime() - 30 * 60 * 1000),
      end: new Date(moonrise.getTime() + 30 * 60 * 1000),
      quality: phase.biteQualities[2],
    });
  }
  
  if (moonset && !isNaN(moonset.getTime())) {
    minorBites.push({
      start: new Date(moonset.getTime() - 30 * 60 * 1000),
      end: new Date(moonset.getTime() + 30 * 60 * 1000),
      quality: phase.biteQualities[3],
    });
  }
  
  // Ensure we have 2 major and 2 minor bite times for display consistency, even if null
  while (majorBites.length < 2) majorBites.push({ start: new Date(0), end: new Date(0), quality: 'poor' });
  while (minorBites.length < 2) minorBites.push({ start: new Date(0), end: new Date(0), quality: 'poor' });
  
  // Sort for chronological order
  majorBites.sort((a,b) => a.start.getTime() - b.start.getTime());
  minorBites.sort((a,b) => a.start.getTime() - b.start.getTime());


  return { major: majorBites, minor: minorBites };
};
