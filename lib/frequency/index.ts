import type { ExtractedContentItem } from '../../types';
import { isStopword } from './stopwords';

export interface FrequencyItem {
  phrase: string;
  count: number;
}

export interface WordFrequencyResult {
  oneWord: FrequencyItem[];
  twoWords: FrequencyItem[];
  threeWords: FrequencyItem[];
  totalWordsProcessed: number;
}

// Word tokenization regex (Unicode letters and internal hyphens/apostrophes)
const WORD_REGEX = /[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu;

export function calculateWordFrequency(items: ExtractedContentItem[]): WordFrequencyResult {
  const oneWordMap = new Map<string, number>();
  const twoWordsMap = new Map<string, number>();
  const threeWordsMap = new Map<string, number>();

  let totalWordsProcessed = 0;

  items.forEach((item) => {
    // Only extract from text-bearing elements (Headings, Text, Button, Link text)
    const isTextElement =
      item.type.startsWith('H') ||
      item.type === 'TEXT' ||
      item.type === 'BUTTON' ||
      item.type === 'LINK';

    if (!isTextElement) {
      return;
    }

    const rawText = (item.text || '').trim();
    if (!rawText || rawText.length === 0) return;

    // Split into sentences / phrase chunks by punctuation
    const chunks = rawText.split(/[.!?,;:|•\n\r/()[\]{}""''«»—–]+/);

    chunks.forEach((chunk) => {
      const tokens = (chunk.match(WORD_REGEX) || [])
        .map((t) => t.toLowerCase())
        .filter((t) => {
          // Ignore purely numeric tokens (e.g. "2026", "20", "1")
          if (/^\d+$/.test(t)) return false;
          // Ignore 1-character tokens
          if (t.length <= 1) return false;
          return true;
        });

      if (tokens.length === 0) return;
      totalWordsProcessed += tokens.length;

      // 1 WORD FREQUENCY (with stopword filtering)
      tokens.forEach((token) => {
        if (!isStopword(token) && token.length >= 2) {
          oneWordMap.set(token, (oneWordMap.get(token) || 0) + 1);
        }
      });

      // 2 WORDS N-GRAMS
      for (let i = 0; i < tokens.length - 1; i++) {
        const w1 = tokens[i];
        const w2 = tokens[i + 1];

        // Filter out if BOTH are stopwords (e.g. "yang dan", "in the")
        if (isStopword(w1) && isStopword(w2)) {
          continue;
        }

        const phrase = `${w1} ${w2}`;
        twoWordsMap.set(phrase, (twoWordsMap.get(phrase) || 0) + 1);
      }

      // 3 WORDS N-GRAMS
      for (let i = 0; i < tokens.length - 2; i++) {
        const w1 = tokens[i];
        const w2 = tokens[i + 1];
        const w3 = tokens[i + 2];

        // Filter out if ALL are stopwords
        if (isStopword(w1) && isStopword(w2) && isStopword(w3)) {
          continue;
        }
        // Filter out if starting and ending with stopwords with uninformative middle
        if (isStopword(w1) && isStopword(w3) && isStopword(w2)) {
          continue;
        }

        const phrase = `${w1} ${w2} ${w3}`;
        threeWordsMap.set(phrase, (threeWordsMap.get(phrase) || 0) + 1);
      }
    });
  });

  const sortMap = (map: Map<string, number>): FrequencyItem[] => {
    return Array.from(map.entries())
      .map(([phrase, count]) => ({ phrase, count }))
      .filter((item) => item.count >= 1)
      .sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase));
  };

  return {
    oneWord: sortMap(oneWordMap),
    twoWords: sortMap(twoWordsMap),
    threeWords: sortMap(threeWordsMap),
    totalWordsProcessed,
  };
}
