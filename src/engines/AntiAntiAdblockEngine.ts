/**
 * Anti-Anti-Adblock Engine
 * 
 * Detects anti-adblock overlays, paywall backdrops, and body scroll locks,
 * restoring original webpage scrollability without triggering re-renders.
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
  ];

  /**
   * Scans DOM for anti-adblock overlays and restores page scrollability.
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
        // Ignore invalid CSS selector errors
      }
    }

    // 2. Unlock scroll if page locked body/html overflow
    const body = rootDocument.body;
    const html = rootDocument.documentElement;

    if (body) {
      if (getComputedStyle(body).overflow === 'hidden') {
        body.style.setProperty('overflow', 'auto', 'important');
        body.style.setProperty('position', 'static', 'important');
      }
    }

    if (html) {
      if (getComputedStyle(html).overflow === 'hidden') {
        html.style.setProperty('overflow', 'auto', 'important');
      }
    }

    return removedCount;
  }
}

export const antiAntiAdblockEngine = new AntiAntiAdblockEngine();
