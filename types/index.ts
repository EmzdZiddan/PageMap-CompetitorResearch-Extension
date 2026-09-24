export type HeadingType = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6';

export type ContentElementType =
  | HeadingType
  | 'TEXT'
  | 'IMAGE'
  | 'VIDEO'
  | 'LINK'
  | 'BUTTON';

export interface ExtractedContentItem {
  id: string; // Unique DOM tracking ID (e.g., 'pm-item-1')
  index: number; // 1-based index
  type: ContentElementType;
  text?: string;
  url?: string;
  alt?: string;
  tagName: string;
  level?: number; // 1-6 for headings
}

export interface PageStats {
  totalItems: number;
  wordCount: number;
  headingCount: number;
  linkCount: number;
  imageCount: number;
  videoCount: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
}

export interface PageMapResult {
  url: string;
  domain: string;
  title: string;
  items: ExtractedContentItem[];
  analyzedAt: string;
  stats: PageStats;
}

export type TabType = 'overview' | 'content' | 'structure' | 'frequency' | 'assets';

export type ExtensionMessage =
  | { type: 'ANALYZE_PAGE' }
  | { type: 'SCROLL_AND_HIGHLIGHT'; itemId: string }
  | { type: 'CLEAR_HIGHLIGHT' }
  | { type: 'PING' };

export interface AnalysisResponse {
  success: boolean;
  data?: PageMapResult;
  error?: string;
}

export interface HighlightResponse {
  success: boolean;
}
