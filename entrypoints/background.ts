import { defineBackground } from 'wxt/sandbox';

export default defineBackground(() => {
  // Listen for extension installation or update
  chrome.runtime.onInstalled.addListener(() => {
    console.log('[PageMap] Extension installed successfully.');
  });
});
