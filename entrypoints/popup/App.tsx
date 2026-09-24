import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageMapResult, ExtractedContentItem, TabType, AnalysisResponse } from '../../types';
import { Header } from '../../components/Header';
import { OverviewTab } from '../../components/tabs/OverviewTab';
import { ContentTab } from '../../components/tabs/ContentTab';
import { StructureTab } from '../../components/tabs/StructureTab';
import { FrequencyTab } from '../../components/tabs/FrequencyTab';
import { AssetsTab } from '../../components/tabs/AssetsTab';
import { LoadingState } from '../../components/LoadingState';
import { EmptyState } from '../../components/EmptyState';
import { Footer } from '../../components/Footer';
import { calculateWordFrequency } from '../../lib/frequency';

function isRestrictedUrl(url?: string): boolean {
  if (!url) return true;
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url.startsWith('about:') ||
    url.startsWith('view-source:') ||
    url.startsWith('devtools://') ||
    url.includes('chrome.google.com/webstore') ||
    url.includes('chromewebstore.google.com')
  );
}

export const App: React.FC = () => {
  const [data, setData] = useState<PageMapResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | undefined>(undefined);
  const [errorState, setErrorState] = useState<{
    type: 'restricted' | 'no_content' | 'error';
    message?: string;
  } | null>(null);

  const extractCurrentTab = useCallback(async () => {
    setIsLoading(true);
    setErrorState(null);

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        setErrorState({
          type: 'error',
          message: 'Unable to access the active browser tab.',
        });
        setIsLoading(false);
        return;
      }

      setActiveTabId(tab.id);

      // Check restricted URLs
      if (isRestrictedUrl(tab.url)) {
        setErrorState({
          type: 'restricted',
          message: 'Chrome security prevents PageMap from extracting content on internal browser pages or the Web Store.',
        });
        setIsLoading(false);
        return;
      }

      // Send message to content script with typed response
      const sendMessage = (): Promise<AnalysisResponse> =>
        new Promise((resolve, reject) => {
          chrome.tabs.sendMessage(tab.id!, { type: 'ANALYZE_PAGE' }, (response: AnalysisResponse) => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        });

      let res: AnalysisResponse | undefined;
      try {
        res = await sendMessage();
      } catch {
        try {
          // If content script was not already loaded on this tab, inject it on-demand
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content-scripts/content.js'],
          });
          await new Promise((r) => setTimeout(r, 150));
          res = await sendMessage();
        } catch (injectionErr) {
          console.warn('[PageMap] Content script injection failed:', injectionErr);
        }
      }

      if (res?.success && res.data) {
        const result: PageMapResult = res.data;
        if (!result.items || result.items.length === 0) {
          setData(result);
          setErrorState({
            type: 'no_content',
            message: "PageMap couldn't find readable visible content on this page.",
          });
        } else {
          setData(result);
          setErrorState(null);
        }
      } else {
        setErrorState({
          type: 'error',
          message: res?.error || 'Could not extract content from this page. Please refresh the page and try again.',
        });
      }
    } catch (err: unknown) {
      console.error('[PageMap] Error during extraction:', err);
      setErrorState({
        type: 'error',
        message: 'Could not connect to the webpage.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    extractCurrentTab();
  }, [extractCurrentTab]);

  const handleItemClick = async (item: ExtractedContentItem) => {
    setActiveItemId(item.id);
    if (!activeTabId) return;

    try {
      chrome.tabs.sendMessage(activeTabId, {
        type: 'SCROLL_AND_HIGHLIGHT',
        itemId: item.id,
      });
    } catch (err) {
      console.warn('[PageMap] Could not send scroll highlight message:', err);
    }
  };

  // Memoized statistical word frequency result
  const frequencyResult = useMemo(() => {
    if (!data?.items || data.items.length === 0) return null;
    return calculateWordFrequency(data.items);
  }, [data]);

  return (
    <div className="flex flex-col h-[560px] max-h-[580px] bg-slate-50 text-slate-900 antialiased select-none font-sans overflow-hidden">
      {/* Header with Title, Domain, and 5 Tabs */}
      <Header
        domain={data?.domain}
        itemCount={data?.items?.length}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={extractCurrentTab}
      />

      {/* Main Body */}
      {isLoading ? (
        <LoadingState />
      ) : errorState ? (
        <EmptyState
          type={errorState.type}
          message={errorState.message}
          onRetry={extractCurrentTab}
        />
      ) : data && data.items.length > 0 ? (
        <>
          {activeTab === 'overview' && (
            <OverviewTab
              data={data}
              onNavigateToTab={setActiveTab}
              onItemClick={handleItemClick}
            />
          )}

          {activeTab === 'content' && (
            <ContentTab
              data={data}
              onItemClick={handleItemClick}
              activeItemId={activeItemId}
            />
          )}

          {activeTab === 'structure' && (
            <StructureTab
              data={data}
              onItemClick={handleItemClick}
              activeItemId={activeItemId}
            />
          )}

          {activeTab === 'frequency' && frequencyResult && (
            <FrequencyTab frequency={frequencyResult} />
          )}

          {activeTab === 'assets' && (
            <AssetsTab
              data={data}
              onItemClick={handleItemClick}
            />
          )}
        </>
      ) : (
        <EmptyState
          type="no_content"
          onRetry={extractCurrentTab}
        />
      )}

      {/* Minimal Footer */}
      <Footer
        analyzedAt={data?.analyzedAt}
        wordCount={data?.stats?.wordCount}
      />
    </div>
  );
};

export default App;
