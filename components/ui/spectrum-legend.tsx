'use client';

import { cn } from '@/lib/utils';

const spectrumItems = [
  { leaning: 'Left', color: 'bg-blue-600' },
  { leaning: 'Lean Left', color: 'bg-sky-500' },
  { leaning: 'Center', color: 'bg-purple-500' },
  { leaning: 'Lean Right', color: 'bg-orange-500' },
  { leaning: 'Right', color: 'bg-red-600' },
  { leaning: 'Neutral', color: 'bg-gray-500' },
];

export function SpectrumLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-card/50 backdrop-blur-sm border-t border-border">
      <span className="text-xs text-muted-foreground font-medium">Political Spectrum:</span>
      {spectrumItems.map((item) => (
        <div key={item.leaning} className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full", item.color)} />
          <span className="text-xs text-muted-foreground">{item.leaning}</span>
        </div>
      ))}
    </div>
  );
}
