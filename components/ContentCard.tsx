import React from 'react';
import { ExtractedContentItem } from '../types';
import { TAG_BADGE_THEMES, formatIndex } from '../lib/utils';
import { copyToClipboard } from '../lib/exporter';
import { useTimedFeedback } from '../lib/hooks/useTimedFeedback';
import {
  Image as ImageIcon,
  Video,
  ExternalLink,
  ChevronRight,
  Check,
  Copy,
} from 'lucide-react';

interface ContentCardProps {
  item: ExtractedContentItem;
  onClick: (item: ExtractedContentItem) => void;
  isCurrent?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onClick,
  isCurrent,
}) => {
  const theme = TAG_BADGE_THEMES[item.type] || TAG_BADGE_THEMES.TEXT;
  const [jumped, triggerJumped] = useTimedFeedback(false, 1400);
  const [copied, triggerCopied] = useTimedFeedback(false, 1400);

  const handleClick = () => {
    triggerJumped(true);
    onClick(item);
  };

  const handleCopyItem = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = item.text || item.url || '';
    if (textToCopy) {
      const ok = await copyToClipboard(textToCopy);
      if (ok) {
        triggerCopied(true);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      className={`group w-full text-left p-2.5 rounded-xl border transition-all duration-150 relative overflow-hidden select-none cursor-pointer outline-none ${
        isCurrent || jumped
          ? 'bg-accent-50/90 border-accent-400 shadow-sm ring-2 ring-accent-100'
          : 'bg-white hover:bg-slate-50/70 border-slate-200/90 hover:border-accent-200 shadow-card'
      }`}
    >
      {/* Card Header Row: Index, Tag Badge, Quick Copy & Jump indicator */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
            {formatIndex(item.index)}
          </span>
          <span
            className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
          >
            {item.type}
          </span>
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handleCopyItem}
            title="Copy item content"
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-accent-600 hover:bg-accent-50 rounded-md transition-all"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>

          {jumped ? (
            <span className="flex items-center space-x-0.5 text-[10px] font-bold text-accent-700 bg-accent-100 px-1.5 py-0.5 rounded-md">
              <Check className="w-3 h-3" />
              <span>Jumped</span>
            </span>
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-accent-600 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>

      {/* Card Content based on type */}
      {/* 1. Headings H1 - H6 */}
      {item.type.startsWith('H') && (
        <div
          className={`leading-snug tracking-tight text-slate-900 ${
            item.type === 'H1'
              ? 'text-sm font-bold text-slate-900'
              : item.type === 'H2'
              ? 'text-[12.5px] font-bold text-slate-900'
              : 'text-xs font-semibold text-slate-800'
          }`}
        >
          {item.text}
        </div>
      )}

      {/* 2. Text */}
      {item.type === 'TEXT' && (
        <div className="text-xs leading-relaxed text-slate-700 font-normal">
          {item.text}
        </div>
      )}

      {/* 3. Button / CTA */}
      {item.type === 'BUTTON' && (
        <div className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <span>{item.text}</span>
        </div>
      )}

      {/* 4. Link */}
      {item.type === 'LINK' && (
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-accent-600 group-hover:text-accent-700 group-hover:underline">
            {item.text || 'Link'}
          </div>
          {item.url && (
            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono truncate">
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{item.url}</span>
            </div>
          )}
        </div>
      )}

      {/* 5. Image */}
      {item.type === 'IMAGE' && (
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-rose-700 font-mono truncate">
            <ImageIcon className="w-3.5 h-3.5 shrink-0 text-rose-500" />
            <span className="truncate">{item.url}</span>
          </div>
          {item.alt && (
            <div className="text-[11px] text-slate-500 font-medium">
              <span className="font-bold text-slate-400">ALT: </span>
              {item.alt}
            </div>
          )}
        </div>
      )}

      {/* 6. Video */}
      {item.type === 'VIDEO' && (
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-amber-800 font-mono truncate">
            <Video className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span className="truncate">{item.url}</span>
          </div>
          {item.text && item.text !== item.url && (
            <div className="text-[11px] text-slate-700 font-semibold">{item.text}</div>
          )}
        </div>
      )}
    </div>
  );
};
