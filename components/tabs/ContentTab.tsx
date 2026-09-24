import React, { useState, useMemo } from 'react';
import { PageMapResult, ExtractedContentItem } from '../../types';
import { ContentCard } from '../ContentCard';
import { useTimedFeedback } from '../../lib/hooks/useTimedFeedback';
import {
  copyAllContent,
  copyTextOnly,
  copyLinksOnly,
  copyMediaOnly,
} from '../../lib/exporter';
import { Search, X, Copy, Check } from 'lucide-react';

interface ContentTabProps {
  data: PageMapResult;
  onItemClick: (item: ExtractedContentItem) => void;
  activeItemId?: string;
}

export const ContentTab: React.FC<ContentTabProps> = ({
  data,
  onItemClick,
  activeItemId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAction, triggerCopiedAction] = useTimedFeedback<string | null>(null, 1800);

  // Filter items based on search query safely
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data.items;
    return data.items.filter((item) => {
      const matchText = (item.text || '').toLowerCase().includes(q);
      const matchUrl = (item.url || '').toLowerCase().includes(q);
      const matchAlt = (item.alt || '').toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      return matchText || matchUrl || matchAlt || matchType;
    });
  }, [data.items, searchQuery]);

  const handleCopyAction = async (action: 'all' | 'text' | 'links' | 'media') => {
    let ok = false;
    if (action === 'all') ok = await copyAllContent(data);
    else if (action === 'text') ok = await copyTextOnly(data);
    else if (action === 'links') ok = await copyLinksOnly(data);
    else if (action === 'media') ok = await copyMediaOnly(data);

    if (ok) {
      triggerCopiedAction(action);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Top Search & Action Bar */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Search Input with Blue 600 Focus Ring */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keyword, phrase, heading, CTA, text..."
            className="w-full pl-8 pr-20 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
          />
          {searchQuery ? (
            <div className="absolute right-2 flex items-center space-x-1.5">
              <span className="text-[10px] font-mono font-bold text-accent-700 bg-accent-50 border border-accent-200 px-1.5 py-0.5 rounded-md">
                {filteredItems.length} match{filteredItems.length === 1 ? '' : 'es'}
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="absolute right-2.5 text-[10px] text-slate-400 font-mono">
              {data.items.length} items
            </span>
          )}
        </div>

        {/* Quick Copy Toolbar */}
        <div className="flex items-center space-x-1.5 pt-0.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleCopyAction('all')}
            className={`px-2.5 py-1 rounded-md font-bold flex items-center space-x-1 transition-all ${
              copiedAction === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-accent-600 hover:bg-accent-700 text-white shadow-xs shadow-accent-600/20 active:scale-[0.98]'
            }`}
          >
            {copiedAction === 'all' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>Copy All</span>
          </button>

          <button
            onClick={() => handleCopyAction('text')}
            className={`px-2 py-1 rounded-md font-semibold flex items-center space-x-1 border transition-all ${
              copiedAction === 'text'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {copiedAction === 'text' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>Copy Text</span>
          </button>

          <button
            onClick={() => handleCopyAction('links')}
            className={`px-2 py-1 rounded-md font-semibold flex items-center space-x-1 border transition-all ${
              copiedAction === 'links'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {copiedAction === 'links' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>Copy Links</span>
          </button>

          <button
            onClick={() => handleCopyAction('media')}
            className={`px-2 py-1 rounded-md font-semibold flex items-center space-x-1 border transition-all ${
              copiedAction === 'media'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {copiedAction === 'media' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
            <span>Copy Media</span>
          </button>
        </div>
      </div>

      {/* Extracted DOM Item List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              No elements matched "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-accent-600 font-semibold hover:underline"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onClick={onItemClick}
              isCurrent={item.id === activeItemId}
            />
          ))
        )}
      </div>
    </div>
  );
};
