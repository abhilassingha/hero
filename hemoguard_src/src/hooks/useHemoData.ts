import { useState, useEffect } from 'react';
import { HemoData, INITIAL_DATA } from '@/src/types';

export function useHemoData() {
  const [data, setData] = useState<HemoData>(INITIAL_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          hr: prev.vitals.hr + (Math.random() > 0.5 ? 1 : -1),
          shockIndex: Number((prev.vitals.shockIndex + (Math.random() * 0.02 - 0.01)).toFixed(2)),
          spo2: Math.min(100, Math.max(80, prev.vitals.spo2 + (Math.random() > 0.7 ? 1 : Math.random() < 0.3 ? -1 : 0))),
        },
        volumeEstimateMl: prev.volumeEstimateMl + Math.floor(Math.random() * 5),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
}
