import React from 'react';

interface FooterProps {
  analyzedAt?: string;
  wordCount?: number;
}

export const Footer: React.FC<FooterProps> = ({ analyzedAt, wordCount }) => {
  return (
    <footer className="border-t border-slate-200/80 bg-white px-3.5 py-1.5 flex items-center justify-between text-[10px] text-slate-400 select-none">
      <div className="flex items-center space-x-1.5">
        <span className="font-semibold text-slate-600">PageMap</span>
        <span>•</span>
        <span>Competitor Research Tool</span>
      </div>

      <div className="font-mono text-[9px] text-slate-400">
        v1.0
      </div>
    </footer>
  );
};
