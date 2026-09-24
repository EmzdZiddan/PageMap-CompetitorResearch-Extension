import React from 'react';
import { PageMapResult, ExtractedContentItem } from '../../types';
import { copyAllContent, exportAsMarkdown, exportAsJson } from '../../lib/exporter';
import { useTimedFeedback } from '../../lib/hooks/useTimedFeedback';
import {
  FileText,
  Heading,
  Link2,
  Image as ImageIcon,
  Video,
  Copy,
  Check,
  Download,
  ExternalLink,
  ArrowRight,
  BarChart2,
} from 'lucide-react';

interface OverviewTabProps {
  data: PageMapResult;
  onNavigateToTab: (tab: 'content' | 'structure' | 'frequency' | 'assets') => void;
  onItemClick: (item: ExtractedContentItem) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  onNavigateToTab,
  onItemClick,
}) => {
  const [copiedAll, triggerCopiedAll] = useTimedFeedback(false, 2000);
  const [copiedType, triggerCopiedType] = useTimedFeedback<'md' | 'json' | null>(null, 1800);

  const handleCopyAll = async () => {
    const ok = await copyAllContent(data);
    if (ok) {
      triggerCopiedAll(true);
    }
  };

  const handleExport = async (type: 'md' | 'json', action: 'copy' | 'download') => {
    if (type === 'md') {
      if (action === 'download') exportAsMarkdown(data, 'download');
      else {
        await exportAsMarkdown(data, 'copy');
        triggerCopiedType('md');
      }
    } else {
      if (action === 'download') exportAsJson(data, 'download');
      else {
        await exportAsJson(data, 'copy');
        triggerCopiedType('json');
      }
    }
  };

  // Quick Content preview: Get top headings or prominent content
  const quickHeadings = data.items.filter((item) => item.type.startsWith('H')).slice(0, 5);
  const sampleItems = quickHeadings.length > 0
    ? quickHeadings
    : data.items.filter((i) => i.text && i.text.trim().length > 0).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 scrollbar-thin">
      {/* 1. PAGE SNAPSHOT */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
            <span>Page Snapshot</span>
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {data.items.length} total elements
          </span>
        </div>

        {/* 5-Metric Snapshot Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Words */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-card flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Words</span>
              <FileText className="w-3.5 h-3.5 text-accent-600" />
            </div>
            <div className="font-bold text-base text-slate-900 tracking-tight">
              {data.stats.wordCount.toLocaleString()}
            </div>
          </div>

          {/* Headings */}
          <button
            onClick={() => onNavigateToTab('structure')}
            className="text-left bg-white border border-slate-200/90 hover:border-accent-400 hover:bg-accent-50/30 rounded-xl p-2.5 shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide group-hover:text-accent-700">Headings</span>
              <Heading className="w-3.5 h-3.5 text-accent-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-base text-slate-900 flex items-center justify-between tracking-tight">
              <span>{data.stats.headingCount}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-accent-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Links */}
          <button
            onClick={() => onNavigateToTab('assets')}
            className="text-left bg-white border border-slate-200/90 hover:border-accent-400 hover:bg-accent-50/30 rounded-xl p-2.5 shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide group-hover:text-accent-700">Links</span>
              <Link2 className="w-3.5 h-3.5 text-accent-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-base text-slate-900 flex items-center justify-between tracking-tight">
              <span>{data.stats.linkCount}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-accent-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Images */}
          <button
            onClick={() => onNavigateToTab('assets')}
            className="text-left bg-white border border-slate-200/90 hover:border-accent-400 hover:bg-accent-50/30 rounded-xl p-2.5 shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide group-hover:text-accent-700">Images</span>
              <ImageIcon className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-base text-slate-900 flex items-center justify-between tracking-tight">
              <span>{data.stats.imageCount}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-accent-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Videos */}
          <button
            onClick={() => onNavigateToTab('assets')}
            className="text-left bg-white border border-slate-200/90 hover:border-accent-400 hover:bg-accent-50/30 rounded-xl p-2.5 shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide group-hover:text-accent-700">Videos</span>
              <Video className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-bold text-base text-slate-900 flex items-center justify-between tracking-tight">
              <span>{data.stats.videoCount}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-accent-600 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>

          {/* Top Frequency Quick Jump */}
          <button
            onClick={() => onNavigateToTab('frequency')}
            className="text-left bg-accent-50/80 border border-accent-200 hover:bg-accent-100/70 hover:border-accent-300 rounded-xl p-2.5 shadow-card transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-accent-700 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wide">Phrases</span>
              <BarChart2 className="w-3.5 h-3.5 text-accent-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] font-bold text-accent-900 leading-tight">
              Frequency View
            </div>
          </button>
        </div>
      </div>

      {/* 2. PAGE TITLE */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-card space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Page Title
        </div>
        <h2 className="text-xs font-bold text-slate-900 leading-snug">
          {data.title || 'Untitled Document'}
        </h2>
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 truncate">
          <span className="truncate max-w-[285px] font-mono text-[10.5px]" title={data.url}>{data.url}</span>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-600 hover:text-accent-700 shrink-0 inline-flex items-center space-x-0.5 font-medium ml-2 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* 3. PRIMARY ACTION: COPY ALL IN BLUE 600 */}
      <div className="space-y-2">
        <button
          onClick={handleCopyAll}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm ${
            copiedAll
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-accent-600 hover:bg-accent-700 text-white shadow-accent-600/25 hover:shadow-accent-600/35 active:scale-[0.99]'
          }`}
        >
          {copiedAll ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied All Content to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy All Extracted Content</span>
            </>
          )}
        </button>

        {/* Quick Export Formats */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-400">Export formats:</span>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => handleExport('md', 'copy')}
              className="text-accent-700 hover:text-accent-800 font-semibold hover:underline flex items-center space-x-1"
            >
              {copiedType === 'md' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>Markdown</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => handleExport('json', 'download')}
              className="text-accent-700 hover:text-accent-800 font-semibold hover:underline flex items-center space-x-1"
            >
              <Download className="w-3 h-3" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK CONTENT PREVIEW */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-600"></span>
            <span>Quick Content Preview</span>
          </span>
          <button
            onClick={() => onNavigateToTab('content')}
            className="text-[11px] text-accent-700 hover:text-accent-800 font-semibold flex items-center space-x-1 hover:underline"
          >
            <span>View All ({data.items.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 shadow-card overflow-hidden">
          {sampleItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item)}
              className="w-full text-left p-2.5 hover:bg-slate-50/80 transition-colors flex items-start space-x-2.5 group"
            >
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-accent-50 text-accent-700 border border-accent-200 shrink-0 mt-0.5">
                {item.type}
              </span>
              <span className="text-xs text-slate-700 group-hover:text-slate-900 line-clamp-2 leading-relaxed flex-1 font-medium">
                {item.text || item.url}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
