import React, { useState } from 'react';
import { WordFrequencyResult, FrequencyItem } from '../../lib/frequency';
import { copyToClipboard } from '../../lib/exporter';
import { useTimedFeedback } from '../../lib/hooks/useTimedFeedback';
import { BarChart3, Copy, Check, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FrequencyTabProps {
  frequency: WordFrequencyResult;
}

export const FrequencyTab: React.FC<FrequencyTabProps> = ({ frequency }) => {
  const [activeNgramTab, setActiveNgramTab] = useState<'all' | '1' | '2' | '3'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedSection, setExpandedSection] = useState<'1' | '2' | '3' | null>(null);
  const [copiedSection, triggerCopiedSection] = useTimedFeedback<string | null>(null, 1800);

  const toggleExpand = (sec: '1' | '2' | '3') => {
    setExpandedSection(expandedSection === sec ? null : sec);
  };

  const handleCopySection = async (title: string, list: FrequencyItem[]) => {
    const lines = [
      `${title} FREQUENCY (${list.length} phrases):`,
      ...list.map((item) => `${item.phrase} ........ ${item.count}`),
    ];
    const ok = await copyToClipboard(lines.join('\n'));
    if (ok) {
      triggerCopiedSection(title);
    }
  };

  const filterList = (items: FrequencyItem[]) => {
    if (!searchFilter.trim()) return items;
    const q = searchFilter.toLowerCase().trim();
    return items.filter((item) => item.phrase.toLowerCase().includes(q));
  };

  const renderSection = (
    title: string,
    key: '1' | '2' | '3',
    rawItems: FrequencyItem[],
    dotColor: string
  ) => {
    const items = filterList(rawItems);
    const isExpanded = expandedSection === key;
    const displayList = isExpanded ? items.slice(0, 50) : items.slice(0, 6);
    const maxCount = items[0]?.count || 1;

    if (items.length === 0) {
      if (searchFilter) return null;
      return (
        <div className="p-4 rounded-xl border border-slate-200 bg-white text-center text-xs text-slate-400">
          No frequency data available for {title}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-slate-200/90 bg-white p-3 space-y-2.5 shadow-card">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            <span className="font-mono text-xs font-bold text-slate-900 tracking-wider uppercase">
              {title}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({items.length} unique)
            </span>
          </div>

          <button
            onClick={() => handleCopySection(title, isExpanded ? items.slice(0, 50) : items.slice(0, 6))}
            title={`Copy ${title} frequency table`}
            className="p-1 text-slate-400 hover:text-accent-600 hover:bg-accent-50 rounded-md transition-colors"
          >
            {copiedSection === title ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Phrase + Count List */}
        <div className="space-y-1 font-mono text-xs">
          {displayList.map((item, idx) => {
            const percentage = Math.round((item.count / maxCount) * 100);
            return (
              <div
                key={idx}
                className="group flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors relative overflow-hidden"
              >
                {/* Visual frequency bar with Blue 600 tint */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-accent-100/60 rounded pointer-events-none transition-all"
                  style={{ width: `${percentage}%` }}
                />

                {/* Phrase & dots */}
                <div className="flex items-center space-x-2 truncate z-10 mr-2 flex-1">
                  <span className="text-slate-400 text-[10px] w-4 shrink-0 font-mono">
                    {idx + 1}.
                  </span>
                  <span className="text-slate-900 truncate capitalize font-medium text-xs font-sans">
                    {item.phrase}
                  </span>
                </div>

                {/* Count Pill */}
                <div className="shrink-0 z-10 flex items-center space-x-1.5">
                  <span className="text-slate-300 text-[10px] select-none tracking-widest hidden group-hover:inline">
                    ........
                  </span>
                  <span className="bg-accent-50 text-accent-800 px-1.5 py-0.5 rounded-md text-[11px] font-bold border border-accent-200">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More toggle */}
        {items.length > 6 && (
          <button
            onClick={() => toggleExpand(key)}
            className="w-full pt-1 text-[11px] text-accent-700 hover:text-accent-800 font-semibold flex items-center justify-center space-x-1 transition-colors outline-none"
          >
            <span>{isExpanded ? 'Show Top 6' : `See All (${items.length})`}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Search & Filter Header */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-accent-600" />
            <span className="font-bold text-xs text-slate-900 font-mono uppercase tracking-wider">
              Word & Phrase Frequency
            </span>
          </div>

          <span className="font-mono text-[11px] text-slate-500">
            {frequency.totalWordsProcessed.toLocaleString()} words
          </span>
        </div>

        {/* Search inside frequency */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter words or phrases..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
          />
        </div>

        {/* N-gram Filter Tabs */}
        <div className="flex items-center space-x-1 text-[11px]">
          <button
            onClick={() => setActiveNgramTab('all')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
              activeNgramTab === 'all'
                ? 'bg-accent-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveNgramTab('1')}
            className={`px-2 py-1 rounded-md font-semibold transition-all ${
              activeNgramTab === '1'
                ? 'bg-accent-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            1 Word ({frequency.oneWord.length})
          </button>
          <button
            onClick={() => setActiveNgramTab('2')}
            className={`px-2 py-1 rounded-md font-semibold transition-all ${
              activeNgramTab === '2'
                ? 'bg-accent-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            2 Words ({frequency.twoWords.length})
          </button>
          <button
            onClick={() => setActiveNgramTab('3')}
            className={`px-2 py-1 rounded-md font-semibold transition-all ${
              activeNgramTab === '3'
                ? 'bg-accent-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
            }`}
          >
            3 Words ({frequency.threeWords.length})
          </button>
        </div>
      </div>

      {/* Frequency Content List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {(activeNgramTab === 'all' || activeNgramTab === '1') &&
          renderSection('1 WORD', '1', frequency.oneWord, 'bg-accent-600')}

        {(activeNgramTab === 'all' || activeNgramTab === '2') &&
          renderSection('2 WORDS', '2', frequency.twoWords, 'bg-accent-500')}

        {(activeNgramTab === 'all' || activeNgramTab === '3') &&
          renderSection('3 WORDS', '3', frequency.threeWords, 'bg-sky-500')}
      </div>
    </div>
  );
};
