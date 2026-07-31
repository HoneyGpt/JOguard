/**
 * Anti-Anti-Adblock Engine - Version 2.0
 * 
 * Detects anti-adblock overlays, paywall backdrops, and body scroll locks,
 * restoring original webpage scrollability, pointer events, and keyboard focus.
 */
export class AntiAntiAdblockEngine {
  private antiAdblockSelectors = [
    '.adblock-overlay',
    '.adblock-modal',
    '.adblock-backdrop',
    '.adblock-dialog',
    '.adblock-notice',
    '[class*="adblock-wall"]',
    '[id*="adblock-wall"]',
    '[class*="anti-adblock"]',
    '[id*="anti-adblock"]',
    '.tp-backdrop',
    '.tp-modal',
  ];

  /**
   * Scans DOM for anti-adblock overlays and restores page scrollability and pointer events.
   * Returns count of removed anti-adblock elements.
   */
  public bypassAntiAdblockOverlays(rootDocument: Document): number {
    if (!rootDocument || !rootDocument.body) return 0;

    let removedCount = 0;

    // 1. Remove anti-adblock overlay elements
    for (const selector of this.antiAdblockSelectors) {
      try {
        const elements = rootDocument.querySelectorAll(selector);
        elements.forEach((el) => {
          el.remove();
          removedCount++;
        });
      } catch {
        // Ignore selector errors
      }
    }

    // 2. Unlock scroll, pointer events, and blur filters on body/html
    const body = rootDocument.body;
    const html = rootDocument.documentElement;

    if (body) {
      const computed = getComputedStyle(body);
      if (computed.overflow === 'hidden') {
        body.style.setProperty('overflow', 'auto', 'important');
      }
      if (computed.pointerEvents === 'none') {
        body.style.setProperty('pointer-events', 'auto', 'important');
      }
      if (computed.filter && computed.filter.includes('blur')) {
        body.style.setProperty('filter', 'none', 'important');
      }
    }

    if (html) {
      const computed = getComputedStyle(html);
      if (computed.overflow === 'hidden') {
        html.style.setProperty('overflow', 'auto', 'important');
      }
    }

    return removedCount;
  }
}

export const antiAntiAdblockEngine = new AntiAntiAdblockEngine();
