import type { PageMapResult } from '../../types';

export function generateJsonExport(data: PageMapResult): string {
  const exportPayload = {
    generator: 'PageMap Competitor Research Tool',
    url: data.url,
    domain: data.domain,
    pageTitle: data.title,
    analyzedAt: data.analyzedAt,
    statistics: data.stats,
    items: data.items.map((item) => ({
      index: item.index,
      type: item.type,
      text: item.text || undefined,
      url: item.url || undefined,
      alt: item.alt || undefined,
      tagName: item.tagName,
    })),
  };

  return JSON.stringify(exportPayload, null, 2);
}
