import React from 'react';
import { AlertCircle, FileQuestion, ShieldAlert, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  type?: 'restricted' | 'no_content' | 'error';
  message?: string;
  onRetry: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no_content',
  message,
  onRetry,
}) => {
  let icon = <FileQuestion className="w-7 h-7 text-accent-600" />;
  let title = 'No Visible Content';
  let defaultDesc = "PageMap couldn't detect readable webpage content on this active tab.";

  if (type === 'restricted') {
    icon = <ShieldAlert className="w-7 h-7 text-amber-600" />;
    title = 'Restricted Browser Page';
    defaultDesc = "Chrome security restricts extensions from running on internal browser pages or the Chrome Web Store.";
  } else if (type === 'error') {
    icon = <AlertCircle className="w-7 h-7 text-rose-600" />;
    title = 'Extraction Failed';
    defaultDesc = "Could not communicate with the webpage. Please refresh the page and try again.";
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-center mb-3 shadow-card">
        {icon}
      </div>
      <h3 className="font-bold text-sm text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed mb-4">
        {message || defaultDesc}
      </p>

      {type !== 'restricted' && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-xs shadow-accent-600/20 active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Extraction</span>
        </button>
      )}
    </div>
  );
};
