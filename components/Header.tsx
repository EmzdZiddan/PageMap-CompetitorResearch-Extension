import React from 'react';
import { RefreshCw, Globe, Layers, AlignLeft, GitFork, BarChart3, Image as ImageIcon } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  domain?: string;
  itemCount?: number;
  isLoading: boolean;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  domain,
  itemCount,
  isLoading,
  activeTab,
  onTabChange,
  onRefresh,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'content', label: 'Content', icon: <AlignLeft className="w-3.5 h-3.5" /> },
    { id: 'structure', label: 'Structure', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'frequency', label: 'Frequency', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'assets', label: 'Assets', icon: <ImageIcon className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 select-none shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Top Header Row */}
      <div className="px-3.5 pt-3 pb-2.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Logo icon with Blue 600 */}
          <div className="w-6 h-6 rounded-lg bg-accent-600 flex items-center justify-center shadow-sm shadow-accent-600/30">
            <Layers className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 leading-none">
              <span className="font-bold text-[13px] tracking-tight text-slate-900">
                PageMap
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-accent-50 text-accent-700 border border-accent-100">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-none">
              Competitor Research Tool
            </p>
          </div>
        </div>

        {/* Right side: Domain Chip & Refresh Button */}
        <div className="flex items-center space-x-1.5">
          {domain && (
            <div
              className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-700 max-w-[155px] truncate transition-colors"
              title={domain}
            >
              <Globe className="w-3 h-3 text-accent-600 shrink-0" />
              <span className="truncate font-medium">{domain}</span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Re-extract page content"
            className="p-1.5 text-slate-500 hover:text-accent-600 hover:bg-accent-50 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-transparent hover:border-accent-200 focus:outline-none"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-accent-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5-Tab Navigation Bar with Blue 600 Active Styling */}
      <div className="px-2.5 pb-2 pt-0.5 flex items-center space-x-1 border-t border-slate-100 bg-slate-50/70 text-[11px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1.5 px-1 rounded-md font-medium flex items-center justify-center space-x-1 transition-all outline-none ${
                isActive
                  ? 'bg-accent-600 text-white font-semibold shadow-sm shadow-accent-600/25'
                  : 'text-slate-600 hover:text-accent-700 hover:bg-accent-50/80'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
