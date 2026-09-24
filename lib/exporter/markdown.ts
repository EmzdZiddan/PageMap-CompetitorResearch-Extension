import type { PageMapResult } from '../../types';

/**
 * Generates clean plain text in DOM order without any internal labels.
 * Strictly complies with revisi.md section 10:
 * - clean, readable, DOM order
 * - NO internal labels like [H1] / [H2] / [TEXT] / [BUTTON] / [LINK]
 * - no duplicates or technical metadata
 */
export function generatePlainTextExport(data: PageMapResult): string {
  const blocks: string[] = [];
  const seenTexts = new Set<string>();

  data.items.forEach((item) => {
    if (item.type.startsWith('H') || item.type === 'TEXT' || item.type === 'BUTTON') {
      const text = (item.text || '').trim();
      if (text && !seenTexts.has(text)) {
        seenTexts.add(text);
        blocks.push(text);
      }
    } else if (item.type === 'LINK') {
      const linkText = (item.text || '').trim();
      if (linkText && !seenTexts.has(linkText)) {
        seenTexts.add(linkText);
        blocks.push(linkText);
      }
    }
  });

  return blocks.join('\n\n').trim();
}

/**
 * Copies all text, headings, and buttons only.
 */
export function generateTextOnlyExport(data: PageMapResult): string {
  const lines: string[] = [];
  data.items.forEach((item) => {
    if (item.type.startsWith('H') || item.type === 'TEXT' || item.type === 'BUTTON') {
      const t = (item.text || '').trim();
      if (t) lines.push(t);
    }
  });
  return lines.join('\n\n').trim();
}

/**
 * Copies all links with anchor text and URL.
 */
export function generateLinksOnlyExport(data: PageMapResult): string {
  const lines: string[] = [];
  data.items.forEach((item) => {
    if (item.type === 'LINK' && item.url) {
      const label = item.text && item.text !== item.url ? `${item.text} — ` : '';
      lines.push(`${label}${item.url}`);
    }
  });
  return lines.join('\n').trim();
}

/**
 * Copies all media URLs (Images and Videos).
 */
export function generateMediaOnlyExport(data: PageMapResult): string {
  const lines: string[] = [];
  data.items.forEach((item) => {
    if (item.type === 'IMAGE' && item.url) {
      lines.push(item.url);
    } else if (item.type === 'VIDEO' && item.url) {
      lines.push(item.url);
    }
  });
  return lines.join('\n').trim();
}

/**
 * Copies clean heading structure outline for UI/UX designers.
 */
export function generateStructureOutlineExport(data: PageMapResult): string {
  const lines: string[] = [`# Page Structure: ${data.title} (${data.domain})`, ''];
  data.items.forEach((item) => {
    if (item.type.startsWith('H')) {
      const level = item.level || parseInt(item.type.charAt(1), 10) || 1;
      const indent = '  '.repeat(Math.max(0, level - 1));
      lines.push(`${indent}${item.type} — ${item.text || ''}`);
    }
  });
  return lines.join('\n').trim();
}

/**
 * Markdown export for competitor documentation.
 */
export function generateMarkdownExport(data: PageMapResult): string {
  const lines: string[] = [];

  lines.push(`# ${data.title || data.domain}`);
  lines.push(`> Competitor Research Extraction — [${data.domain}](${data.url})`);
  lines.push(`> Extracted: ${data.stats.wordCount.toLocaleString()} Words • ${data.stats.headingCount} Headings • ${data.stats.linkCount} Links • ${data.stats.imageCount} Images • ${data.stats.videoCount} Videos`);
  lines.push('');
  lines.push('---');
  lines.push('');

  data.items.forEach((item) => {
    if (item.type === 'H1') {
      lines.push(`# ${item.text}`);
      lines.push('');
    } else if (item.type === 'H2') {
      lines.push(`## ${item.text}`);
      lines.push('');
    } else if (item.type === 'H3') {
      lines.push(`### ${item.text}`);
      lines.push('');
    } else if (item.type === 'H4') {
      lines.push(`#### ${item.text}`);
      lines.push('');
    } else if (item.type === 'H5' || item.type === 'H6') {
      lines.push(`##### ${item.text}`);
      lines.push('');
    } else if (item.type === 'TEXT') {
      lines.push(item.text || '');
      lines.push('');
    } else if (item.type === 'BUTTON') {
      lines.push(`👉 **[CTA: ${item.text}]**`);
      lines.push('');
    } else if (item.type === 'IMAGE') {
      lines.push(`![${item.alt || 'Image'}](${item.url || ''})`);
      lines.push('');
    } else if (item.type === 'VIDEO') {
      lines.push(`🎬 **Video:** [${item.text || 'Watch Video'}](${item.url || ''})`);
      lines.push('');
    } else if (item.type === 'LINK') {
      lines.push(`🔗 [${item.text || item.url}](${item.url || ''})`);
      lines.push('');
    }
  });

  return lines.join('\n').trim();
}
