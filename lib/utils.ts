import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ContentElementType } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIndex(idx: number): string {
  return idx < 10 ? `0${idx}` : `${idx}`;
}

export function extractDomain(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return 'Webpage';
  }
}

export interface TagBadgeTheme {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const TAG_BADGE_THEMES: Record<ContentElementType, TagBadgeTheme> = {
  H1: {
    label: 'H1',
    badgeBg: 'bg-accent-600',
    badgeText: 'text-white font-bold',
    badgeBorder: 'border-accent-600',
  },
  H2: {
    label: 'H2',
    badgeBg: 'bg-accent-50',
    badgeText: 'text-accent-700 font-semibold',
    badgeBorder: 'border-accent-200',
  },
  H3: {
    label: 'H3',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800 font-medium',
    badgeBorder: 'border-slate-200',
  },
  H4: {
    label: 'H4',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
  },
  H5: {
    label: 'H5',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    badgeBorder: 'border-slate-200',
  },
  H6: {
    label: 'H6',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    badgeBorder: 'border-slate-200',
  },
  TEXT: {
    label: 'TEXT',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-600',
    badgeBorder: 'border-slate-200/80',
  },
  IMAGE: {
    label: 'IMAGE',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700 font-medium',
    badgeBorder: 'border-rose-200',
  },
  VIDEO: {
    label: 'VIDEO',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800 font-medium',
    badgeBorder: 'border-amber-200',
  },
  LINK: {
    label: 'LINK',
    badgeBg: 'bg-accent-50',
    badgeText: 'text-accent-700 font-medium',
    badgeBorder: 'border-accent-200',
  },
  BUTTON: {
    label: 'BUTTON',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700 font-semibold',
    badgeBorder: 'border-emerald-200',
  },
};
