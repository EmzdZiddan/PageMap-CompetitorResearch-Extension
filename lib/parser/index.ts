import type { ExtractedContentItem, PageMapResult, ContentElementType, HeadingType } from '../../types';
import { toAbsoluteUrl, isVideoSource, isIgnoredTag, isElementHidden, getCleanText, countWordsInText } from './extractor';
import { extractDomain } from '../utils';

const DATA_ID_ATTR = 'data-pagemap-id';
const MAX_DOM_DEPTH = 120;

export function parsePageDOM(): PageMapResult {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const domain = extractDomain(url);
  const pageTitle = (typeof document !== 'undefined' && document.title) ? document.title : domain;

  const items: ExtractedContentItem[] = [];
  const processedElements = new Set<HTMLElement>();

  let wordCount = 0;
  let headingCount = 0;
  let imageCount = 0;
  let videoCount = 0;
  let linkCount = 0;
  let h1Count = 0;
  let h2Count = 0;
  let h3Count = 0;
  let h4Count = 0;

  function addItem(
    el: HTMLElement,
    type: ContentElementType,
    details: { text?: string; url?: string; alt?: string; level?: number }
  ) {
    if (processedElements.has(el)) return;
    processedElements.add(el);

    const itemId = `pm-item-${items.length + 1}`;
    el.setAttribute(DATA_ID_ATTR, itemId);

    if (type === 'H1') { headingCount++; h1Count++; }
    else if (type === 'H2') { headingCount++; h2Count++; }
    else if (type === 'H3') { headingCount++; h3Count++; }
    else if (type === 'H4') { headingCount++; h4Count++; }
    else if (type === 'H5' || type === 'H6') { headingCount++; }
    else if (type === 'IMAGE') imageCount++;
    else if (type === 'VIDEO') videoCount++;
    else if (type === 'LINK') linkCount++;

    if (details.text) {
      wordCount += countWordsInText(details.text);
    }

    items.push({
      id: itemId,
      index: items.length + 1,
      type,
      text: details.text,
      url: details.url,
      alt: details.alt,
      tagName: el.tagName.toLowerCase(),
      level: details.level,
    });
  }

  function walk(node: Node, depth = 0) {
    if (depth > MAX_DOM_DEPTH) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      if (isIgnoredTag(tag) || isElementHidden(el)) {
        return;
      }

      // 1. HEADINGS (H1 - H6)
      if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(tag)) {
        const level = parseInt(tag.charAt(1), 10);
        const text = getCleanText(el);
        if (text.length > 0) {
          addItem(el, tag as HeadingType, { text, level });
          return;
        }
      }

      // 2. IMAGE
      if (tag === 'IMG') {
        const img = el as HTMLImageElement;
        const rawSrc = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.getAttribute('srcset') || '';
        if (rawSrc && !rawSrc.startsWith('data:image/svg')) {
          const absoluteUrl = toAbsoluteUrl(rawSrc.split(' ')[0], url);
          const alt = (img.getAttribute('alt') || img.getAttribute('aria-label') || '').trim();
          addItem(el, 'IMAGE', { url: absoluteUrl, alt: alt || undefined, text: alt || undefined });
        }
        return;
      }

      // 3. VIDEO (HTML5 video)
      if (tag === 'VIDEO') {
        const video = el as HTMLVideoElement;
        let src = video.currentSrc || video.src || video.getAttribute('data-src') || '';
        if (!src) {
          const source = video.querySelector('source');
          if (source) src = source.src || source.getAttribute('src') || '';
        }
        const poster = video.poster ? toAbsoluteUrl(video.poster, url) : undefined;
        if (src) {
          addItem(el, 'VIDEO', { url: toAbsoluteUrl(src, url), text: video.title || poster || undefined });
        }
        return;
      }

      // 4. VIDEO IFRAME (YouTube, Vimeo, etc.)
      if (tag === 'IFRAME') {
        const iframe = el as HTMLIFrameElement;
        const src = iframe.src || iframe.getAttribute('data-src') || iframe.getAttribute('src') || '';
        if (src && isVideoSource(src)) {
          addItem(el, 'VIDEO', { url: toAbsoluteUrl(src, url), text: iframe.title || undefined });
        }
        return;
      }

      // 5. BUTTON & INPUT BUTTON
      if (tag === 'BUTTON' || (tag === 'INPUT' && ['button', 'submit'].includes((el as HTMLInputElement).type))) {
        const text = getCleanText(el) || (el as HTMLInputElement).value || '';
        if (text.length > 0) {
          addItem(el, 'BUTTON', { text });
        }
        return;
      }

      // 6. LINK (<a>)
      if (tag === 'A') {
        const a = el as HTMLAnchorElement;
        const text = getCleanText(a);
        const rawHref = a.getAttribute('href') || a.href || '';
        if (rawHref && !rawHref.startsWith('javascript:')) {
          const absoluteUrl = toAbsoluteUrl(rawHref, url);
          addItem(el, 'LINK', { text: text || absoluteUrl, url: absoluteUrl });
        } else if (text.length > 0) {
          addItem(el, 'TEXT', { text });
        }
        return;
      }

      // 7. BLOCK TEXT ELEMENTS (P, LI, BLOCKQUOTE, DT, DD, TH, TD, FIGCAPTION, CAPTION, LABEL)
      if (['P', 'LI', 'BLOCKQUOTE', 'DT', 'DD', 'TH', 'TD', 'FIGCAPTION', 'CAPTION', 'LABEL'].includes(tag)) {
        const hasMediaOrInteractive = el.querySelector('img, video, iframe, a, button, h1, h2, h3, h4, h5, h6');
        if (!hasMediaOrInteractive) {
          const text = getCleanText(el);
          if (text.length > 0) {
            addItem(el, 'TEXT', { text });
          }
          return;
        }
      }

      // Recurse into child nodes
      for (let i = 0; i < el.childNodes.length; i++) {
        walk(el.childNodes[i], depth + 1);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.nodeValue || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
      if (text.length > 0) {
        const parent = node.parentElement;
        if (
          parent &&
          !processedElements.has(parent) &&
          !['BODY', 'HTML', 'MAIN', 'DIV', 'SECTION', 'ARTICLE', 'ASIDE', 'NAV', 'HEADER', 'FOOTER'].includes(parent.tagName.toUpperCase())
        ) {
          const fullText = getCleanText(parent);
          if (fullText.length > 0 && !processedElements.has(parent)) {
            addItem(parent, 'TEXT', { text: fullText });
          }
        }
      }
    }
  }

  // Walk entire body safely
  const root = typeof document !== 'undefined' ? (document.body || document.documentElement) : null;
  if (root) {
    for (let i = 0; i < root.childNodes.length; i++) {
      walk(root.childNodes[i], 0);
    }
  }

  return {
    url,
    domain,
    title: pageTitle,
    items,
    analyzedAt: new Date().toISOString(),
    stats: {
      totalItems: items.length,
      wordCount,
      headingCount,
      linkCount,
      imageCount,
      videoCount,
      h1Count,
      h2Count,
      h3Count,
      h4Count,
    },
  };
}
