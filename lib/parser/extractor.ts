export function toAbsoluteUrl(url: string, baseUrl?: string): string {
  if (!url) return '';
  try {
    const base = baseUrl || (typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

export function isVideoSource(src: string): boolean {
  if (!src) return false;
  const s = src.toLowerCase();
  return (
    s.includes('youtube.com') ||
    s.includes('youtu.be') ||
    s.includes('vimeo.com') ||
    s.includes('wistia.com') ||
    s.includes('dailymotion.com') ||
    s.includes('tiktok.com') ||
    s.includes('loom.com') ||
    s.endsWith('.mp4') ||
    s.endsWith('.webm') ||
    s.endsWith('.ogg') ||
    s.endsWith('.m3u8') ||
    s.includes('/embed/') ||
    s.includes('/video/')
  );
}

export function isIgnoredTag(tagName: string): boolean {
  const t = tagName.toUpperCase();
  return ['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS', 'TEMPLATE', 'AUDIO', 'TRACK', 'SOURCE', 'HEAD', 'META', 'LINK'].includes(t);
}

export function isElementHidden(el: HTMLElement): boolean {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

  if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return true;

  try {
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

export function getCleanText(elem: HTMLElement): string {
  if (!elem) return '';

  const pieces: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const val = node.nodeValue || '';
      if (val.trim().length > 0) {
        pieces.push(val.trim());
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (isIgnoredTag(el.tagName) || isElementHidden(el)) {
        return;
      }
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  }

  walk(elem);

  return pieces.join(' ').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

export function countWordsInText(text: string): number {
  if (!text) return 0;
  const matches = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return matches ? matches.length : 0;
}
