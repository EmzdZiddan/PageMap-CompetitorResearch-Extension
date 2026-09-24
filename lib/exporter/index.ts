import type { PageMapResult } from '../../types';
import {
  generatePlainTextExport,
  generateTextOnlyExport,
  generateLinksOnlyExport,
  generateMediaOnlyExport,
  generateStructureOutlineExport,
  generateMarkdownExport,
} from './markdown';
import { generateJsonExport } from './json';

export {
  generatePlainTextExport,
  generateTextOnlyExport,
  generateLinksOnlyExport,
  generateMediaOnlyExport,
  generateStructureOutlineExport,
  generateMarkdownExport,
  generateJsonExport,
};

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyAllContent(data: PageMapResult): Promise<boolean> {
  const plainText = generatePlainTextExport(data);
  return copyToClipboard(plainText);
}

export async function copyTextOnly(data: PageMapResult): Promise<boolean> {
  const text = generateTextOnlyExport(data);
  return copyToClipboard(text);
}

export async function copyLinksOnly(data: PageMapResult): Promise<boolean> {
  const links = generateLinksOnlyExport(data);
  return copyToClipboard(links);
}

export async function copyMediaOnly(data: PageMapResult): Promise<boolean> {
  const media = generateMediaOnlyExport(data);
  return copyToClipboard(media);
}

export async function copyStructureOutline(data: PageMapResult): Promise<boolean> {
  const outline = generateStructureOutlineExport(data);
  return copyToClipboard(outline);
}

export function exportAsMarkdown(data: PageMapResult, action: 'download' | 'copy' = 'download'): Promise<boolean> | void {
  const md = generateMarkdownExport(data);
  const filename = `${data.domain.replace(/[^a-z0-9]/gi, '_')}-pagemap.md`;
  if (action === 'download') {
    downloadFile(md, filename, 'text/markdown;charset=utf-8');
  } else {
    return copyToClipboard(md);
  }
}

export function exportAsJson(data: PageMapResult, action: 'download' | 'copy' = 'download'): Promise<boolean> | void {
  const json = generateJsonExport(data);
  const filename = `${data.domain.replace(/[^a-z0-9]/gi, '_')}-pagemap.json`;
  if (action === 'download') {
    downloadFile(json, filename, 'application/json;charset=utf-8');
  } else {
    return copyToClipboard(json);
  }
}
