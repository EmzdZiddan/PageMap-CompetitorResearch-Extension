let activeHighlightOverlay: HTMLDivElement | null = null;
let activeTimeout: number | null = null;
let activeFadeTimeout: number | null = null;

export function highlightAndScrollTo(itemId: string): boolean {
  clearHighlight();

  const target = document.querySelector(`[data-pagemap-id="${itemId}"]`) as HTMLElement | null;
  if (!target) return false;

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest',
  });

  const rect = target.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  const overlay = document.createElement('div');
  overlay.id = 'pagemap-highlight-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = `${rect.top + scrollY - 4}px`;
  overlay.style.left = `${rect.left + scrollX - 4}px`;
  overlay.style.width = `${Math.max(rect.width + 8, 20)}px`;
  overlay.style.height = `${Math.max(rect.height + 8, 20)}px`;
  overlay.style.pointerEvents = 'none';
  overlay.style.borderRadius = '6px';
  overlay.style.border = '2px solid #2563eb';
  overlay.style.backgroundColor = 'rgba(37, 99, 235, 0.08)';
  overlay.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.2), 0 4px 16px rgba(37, 99, 235, 0.15)';
  overlay.style.zIndex = '2147483647';
  overlay.style.transition = 'opacity 0.35s ease-out, transform 0.35s ease-out';
  overlay.style.opacity = '1';

  document.body.appendChild(overlay);
  activeHighlightOverlay = overlay;

  activeTimeout = window.setTimeout(() => {
    if (activeHighlightOverlay) {
      activeHighlightOverlay.style.opacity = '0';
      activeFadeTimeout = window.setTimeout(() => {
        clearHighlight();
      }, 350);
    }
  }, 2200);

  return true;
}

export function clearHighlight() {
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
  if (activeFadeTimeout) {
    clearTimeout(activeFadeTimeout);
    activeFadeTimeout = null;
  }
  if (activeHighlightOverlay && activeHighlightOverlay.parentNode) {
    activeHighlightOverlay.parentNode.removeChild(activeHighlightOverlay);
  }
  activeHighlightOverlay = null;
}
