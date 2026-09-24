import React from 'react';
import { PageMapResult, ExtractedContentItem } from '../../types';
import { copyStructureOutline } from '../../lib/exporter';
import { useTimedFeedback } from '../../lib/hooks/useTimedFeedback';
import { GitFork, Copy, Check, ChevronRight, Hash } from 'lucide-react';

interface StructureTabProps {
  data: PageMapResult;
  onItemClick: (item: ExtractedContentItem) => void;
  activeItemId?: string;
}

export const StructureTab: React.FC<StructureTabProps> = ({
  data,
  onItemClick,
  activeItemId,
}) => {
  const [copiedOutline, triggerCopiedOutline] = useTimedFeedback(false, 2000);
  const [activeHeadingId, triggerActiveHeadingId] = useTimedFeedback<string | null>(null, 1400);

  // Filter only actual heading elements in DOM order
  const headings = data.items.filter((item) => item.type.startsWith('H'));

  const handleCopyOutline = async () => {
    const ok = await copyStructureOutline(data);
    if (ok) {
      triggerCopiedOutline(true);
    }
  };

  const handleHeadingClick = (item: ExtractedContentItem) => {
    triggerActiveHeadingId(item.id);
    onItemClick(item);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Top Header Bar for UI/UX Designers */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <GitFork className="w-3.5 h-3.5 text-accent-600" />
            <span className="font-bold text-xs text-slate-900 font-mono uppercase tracking-wider">
              Heading Hierarchy
            </span>
          </div>

          <button
            onClick={handleCopyOutline}
            disabled={headings.length === 0}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
              copiedOutline
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-accent-600 hover:bg-accent-700 text-white shadow-xs shadow-accent-600/20 active:scale-[0.98] disabled:opacity-40'
            }`}
          >
            {copiedOutline ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>Copy Outline</span>
          </button>
        </div>

        {/* Heading Distribution Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-md bg-accent-600 text-white font-bold shadow-2xs">
            {data.stats.h1Count} H1
          </span>
          <span className="px-2 py-0.5 rounded-md bg-accent-50 text-accent-700 font-bold border border-accent-200">
            {data.stats.h2Count} H2
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {data.stats.h3Count} H3
          </span>
          {data.stats.h4Count > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {data.stats.h4Count} H4
            </span>
          )}
          <span className="text-slate-400 pl-1 font-sans text-[11px] font-medium">
            ({headings.length} headings)
          </span>
        </div>
      </div>

      {/* Heading Tree List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
        {headings.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Hash className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-700">
              No HTML Headings Found
            </p>
            <p className="text-[11px] text-slate-500 max-w-[220px] mx-auto">
              This webpage doesn't use standard H1-H6 tags. Check the Content tab for raw text.
            </p>
          </div>
        ) : (
          headings.map((item) => {
            const level = item.level || parseInt(item.type.charAt(1), 10) || 1;
            const isH1 = level === 1;
            const isH2 = level === 2;
            const isH3 = level === 3;
            const isCurrent = item.id === activeItemId || item.id === activeHeadingId;

            // Visual Indentation based on heading level
            const indentClass =
              level === 1
                ? 'ml-0'
                : level === 2
                ? 'ml-3'
                : level === 3
                ? 'ml-6'
                : level === 4
                ? 'ml-8'
                : 'ml-10';

            return (
              <div
                key={item.id}
                onClick={() => handleHeadingClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleHeadingClick(item);
                  }
                }}
                className={`group flex items-start space-x-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${indentClass} ${
                  isCurrent
                    ? 'bg-accent-50/90 border-accent-400 ring-2 ring-accent-100 shadow-sm'
                    : isH1
                    ? 'bg-white hover:bg-slate-50/80 border-slate-300 shadow-card hover:border-accent-300'
                    : isH2
                    ? 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-card hover:border-accent-200'
                    : 'bg-white/80 hover:bg-slate-50/80 border-slate-200/70 hover:border-accent-200'
                }`}
              >
                {/* Heading Level Badge */}
                <span
                  className={`shrink-0 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md border mt-0.5 ${
                    isH1
                      ? 'bg-accent-600 text-white border-accent-600 shadow-2xs'
                      : isH2
                      ? 'bg-accent-50 text-accent-700 border-accent-200'
                      : isH3
                      ? 'bg-slate-100 text-slate-800 border-slate-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.type}
                </span>

                {/* Heading Text Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`leading-snug tracking-tight ${
                      isH1
                        ? 'text-xs font-bold text-slate-900'
                        : isH2
                        ? 'text-xs font-bold text-slate-900'
                        : isH3
                        ? 'text-[11.5px] font-semibold text-slate-800'
                        : 'text-[11px] text-slate-700 font-normal'
                    }`}
                  >
                    {item.text || '<Empty Heading>'}
                  </div>
                </div>

                {/* Arrow */}
                <div className="shrink-0 pt-0.5">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
