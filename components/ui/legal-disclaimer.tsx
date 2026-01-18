'use client';

import { AlertTriangle } from 'lucide-react';

export function LegalDisclaimer() {
  return (
    <div className="px-4 py-2 bg-muted/30 border-t border-border">
      <div className="flex items-start gap-2 max-w-4xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong className="text-foreground/80">Disclaimer:</strong> AI-generated summaries are for educational use only. 
          Bias classifications are algorithmic estimates and may not reflect nuanced editorial positions. 
          Always verify critical information through original sources.
        </p>
      </div>
    </div>
  );
}
