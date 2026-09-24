import { defineContentScript } from 'wxt/sandbox';
import { parsePageDOM } from '../lib/parser';
import { highlightAndScrollTo, clearHighlight } from '../lib/highlighter';
import type { ExtensionMessage } from '../types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
      try {
        if (message.type === 'PING') {
          sendResponse({ status: 'ok' });
          return true;
        }

        if (message.type === 'ANALYZE_PAGE') {
          const result = parsePageDOM();
          sendResponse({ success: true, data: result });
          return true;
        }

        if (message.type === 'SCROLL_AND_HIGHLIGHT') {
          const ok = highlightAndScrollTo(message.itemId);
          sendResponse({ success: ok });
          return true;
        }

        if (message.type === 'CLEAR_HIGHLIGHT') {
          clearHighlight();
          sendResponse({ success: true });
          return true;
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Error processing request';
        console.error('[PageMap] Content script error:', err);
        sendResponse({ success: false, error: errorMessage });
        return true;
      }
    });
  },
});
