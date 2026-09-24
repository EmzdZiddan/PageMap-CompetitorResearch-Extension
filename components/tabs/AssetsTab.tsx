import React, { useState, useMemo } from 'react';
import { PageMapResult, ExtractedContentItem } from '../../types';
import { copyToClipboard } from '../../lib/exporter';
import { useTimedFeedback } from '../../lib/hooks/useTimedFeedback';
import {
  Image as ImageIcon,
  Video,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Search,
  Layers,
} from 'lucide-react';

interface AssetsTabProps {
  data: PageMapResult;
  onItemClick: (item: ExtractedContentItem) => void;
}

export const AssetsTab: React.FC<AssetsTabProps> = ({ data, onItemClick }) => {
  const [assetType, setAssetType] = useState<'images' | 'videos' | 'links'>('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, triggerCopiedUrl] = useTimedFeedback<string | null>(null, 1500);
  const [copiedAll, triggerCopiedAll] = useTimedFeedback(false, 1800);

  // Group assets
  const images = useMemo(() => data.items.filter((item) => item.type === 'IMAGE' && item.url), [data.items]);
  const videos = useMemo(() => data.items.filter((item) => item.type === 'VIDEO' && item.url), [data.items]);
  const links = useMemo(() => data.items.filter((item) => item.type === 'LINK' && item.url), [data.items]);

  const currentList = assetType === 'images' ? images : assetType === 'videos' ? videos : links;

  // Filter based on search query safely
  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return currentList;
    return currentList.filter((item) => {
      const u = (item.url || '').toLowerCase();
      const t = (item.text || '').toLowerCase();
      const a = (item.alt || '').toLowerCase();
      return u.includes(q) || t.includes(q) || a.includes(q);
    });
  }, [currentList, searchQuery]);

  const handleCopySingleUrl = async (url: string) => {
    const ok = await copyToClipboard(url);
    if (ok) {
      triggerCopiedUrl(url);
    }
  };

  const handleCopyAllCategoryUrls = async () => {
    const urls = filteredList.map((item) => item.url).filter(Boolean) as string[];
    if (urls.length === 0) return;
    const ok = await copyToClipboard(urls.join('\n'));
    if (ok) {
      triggerCopiedAll(true);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      {/* Top Header & Sub-tabs */}
      <div className="p-3 bg-white border-b border-slate-200/90 space-y-2 select-none shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-600" />
            <span className="font-bold text-xs text-slate-900 font-mono uppercase tracking-wider">
              Asset Explorer
            </span>
          </div>

          <button
            onClick={handleCopyAllCategoryUrls}
            disabled={filteredList.length === 0}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
              copiedAll
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-accent-600 hover:bg-accent-700 text-white shadow-xs shadow-accent-600/20 active:scale-[0.98] disabled:opacity-40'
            }`}
          >
            {copiedAll ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>Copy All {assetType === 'images' ? 'Images' : assetType === 'videos' ? 'Videos' : 'Links'}</span>
          </button>
        </div>

        {/* Sub Navigation (Images, Videos, Links) */}
        <div className="flex items-center space-x-1.5 text-[11px]">
          <button
            onClick={() => setAssetType('images')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center space-x-1 transition-all ${
              assetType === 'images'
                ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 border border-transparent'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>Images ({images.length})</span>
          </button>

          <button
            onClick={() => setAssetType('videos')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center space-x-1 transition-all ${
              assetType === 'videos'
                ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 border border-transparent'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-amber-600" />
            <span>Videos ({videos.length})</span>
          </button>

          <button
            onClick={() => setAssetType('links')}
            className={`flex-1 py-1 px-2 rounded-md font-semibold flex items-center justify-center space-x-1 transition-all ${
              assetType === 'links'
                ? 'bg-accent-50 text-accent-800 border border-accent-200 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600 border border-transparent'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-accent-600" />
            <span>Links ({links.length})</span>
          </button>
        </div>

        {/* Search Asset Filter */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${assetType} by URL or label...`}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-100 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Asset List Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              {assetType === 'images' ? (
                <ImageIcon className="w-5 h-5" />
              ) : assetType === 'videos' ? (
                <Video className="w-5 h-5" />
              ) : (
                <Link2 className="w-5 h-5" />
              )}
            </div>
            <p className="text-xs font-bold text-slate-700">
              No {assetType} found
            </p>
            {searchQuery && (
              <p className="text-[11px] text-slate-500">
                No matches for query "{searchQuery}"
              </p>
            )}
          </div>
        ) : (
          filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-xl p-2.5 space-y-2 shadow-card hover:border-accent-200 transition-colors"
            >
              {/* IMAGES CARD */}
              {assetType === 'images' && (
                <div className="flex items-start space-x-3">
                  {/* Image Thumbnail with lazy loading */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={item.url}
                      alt={item.alt || 'Thumbnail'}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <ImageIcon className="w-4 h-4 text-slate-300 absolute pointer-events-none" />
                  </div>

                  {/* Image Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    {item.alt ? (
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {item.alt}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">No ALT text</div>
                    )}
                    <div className="text-[10px] text-slate-500 font-mono truncate" title={item.url}>
                      {item.url}
                    </div>
                  </div>
                </div>
              )}

              {/* VIDEOS CARD */}
              {assetType === 'videos' && (
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 shrink-0 flex items-center justify-center text-amber-700">
                    <Video className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {item.text || 'Video Player / Embed'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate" title={item.url}>
                      {item.url}
                    </div>
                  </div>
                </div>
              )}

              {/* LINKS CARD */}
              {assetType === 'links' && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-50 border border-accent-200 shrink-0 flex items-center justify-center text-accent-700 mt-0.5">
                    <Link2 className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.text || 'Untitled Link'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate" title={item.url}>
                      {item.url}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-[11px]">
                <button
                  onClick={() => onItemClick(item)}
                  className="text-accent-600 hover:text-accent-700 font-semibold text-[10.5px] hover:underline"
                >
                  Jump in DOM
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopySingleUrl(item.url || '')}
                    className="inline-flex items-center space-x-1 text-slate-600 hover:text-accent-700 font-medium px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-slate-400 hover:text-accent-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    title="Open URL in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
