/**
 * Cosmetic Engine - Version 1.1
 * 
 * Advanced Cosmetic Filtering & Native Ad Removal Engine.
 * Performs multi-signal inspection to identify and remove native sponsored cards,
 * hardcoded ad banners, and promotional overlays without breaking video players
 * or website content.
 */

export interface RemovalLog {
  domain: string;
  selector: string;
  reason: string;
}

export class CosmeticEngine {
  // Advanced Ad Attribute Selectors
  private cosmeticPatterns: string[] = [
    '.ad-banner',
    '.ad-wrapper',
    '.ad-container',
    '.ad-slot',
    '.ad-placement',
    '.sponsored-card',
    '.sponsored-content',
    '.sponsored-post',
    '.promoted-content',
    '.promoted-item',
    '.native-ad',
    '.article-sponsored',
    '.partner-box',
    '[aria-label="advertisement" i]',
    '[aria-label="sponsored" i]',
    '[data-ad-client]',
    '[data-ad-slot]',
    '[id^="div-gpt-ad"]',
    '[id^="google_ads_iframe"]',
    '[id^="taboola-"]',
    '[id^="outbrain-"]',
  ];

  // Text phrases matching native ad disclosures
  private nativeAdTextPhrases: string[] = [
    'sponsored',
    'advertisement',
    'paid partnership',
    'promoted',
    'partner content',
    'promoted content',
  ];

  // Protected containers that must NEVER be removed
  private protectedSelectors: string[] = [
    'video',
    'iframe[src*="youtube"]',
    'iframe[src*="zee5"]',
    '.html5-video-player',
    '#player',
    '.video-player',
    '#movie_player',
    'header',
    'nav',
    'body',
    'html',
    'main',
  ];

  /**
   * Performs multi-signal DOM inspection to detect and safely remove hardcoded/native ads.
   */
  public inspectAndRemove(
    root: Document | HTMLElement,
    debugLogs: boolean = false,
    domain: string = ''
  ): number {
    if (!root) return 0;

    let removedCount = 0;

    // 1. Selector Pattern Scan
    for (const pattern of this.cosmeticPatterns) {
      try {
        const elements = root.querySelectorAll(pattern);
        elements.forEach((el) => {
          if (this.isSafeAdCandidate(el, 'Selector match: ' + pattern)) {
            this.removeElement(el, domain, pattern, 'Selector pattern match', debugLogs);
            removedCount++;
          }
        });
      } catch {
        // Ignore invalid selector queries
      }
    }

    // 2. Native Text-Based Multi-Signal Inspection
    removedCount += this.scanTextBasedNativeAds(root, debugLogs, domain);

    return removedCount;
  }

  /**
   * Scans text labels for "Sponsored", "Advertisement", "Paid partnership"
   * and removes closest safe card container.
   */
  private scanTextBasedNativeAds(
    root: Document | HTMLElement,
    debugLogs: boolean,
    domain: string
  ): number {
    let count = 0;

    // Target small text badges, span, and paragraph elements containing keywords
    const candidateBadges = root.querySelectorAll('span, p, div, label');

    candidateBadges.forEach((badge) => {
      const text = badge.textContent?.trim().toLowerCase() || '';
      if (!text || text.length > 30) return; // Ignore large body paragraphs

      const matchesText = this.nativeAdTextPhrases.some((phrase) => text === phrase);
      if (!matchesText) return;

      // Find closest card container
      const cardContainer = badge.closest(
        '.card, article, section, [class*="item"], [class*="card"], [class*="sponsored"], [class*="promoted"]'
      ) as HTMLElement;

      if (cardContainer && this.isSafeAdCandidate(cardContainer, 'Native text match: ' + text)) {
        this.removeElement(
          cardContainer,
          domain,
          cardContainer.className || cardContainer.tagName,
          `Native text badge "${text}"`,
          debugLogs
        );
        count++;
      }
    });

    return count;
  }

  /**
   * Safety Verification: Ensures element is NOT inside a video player or critical page container.
   */
  private isSafeAdCandidate(element: Element, _reason: string): boolean {
    if (!element || !element.parentNode) return false;

    // Reject if element matches protected selectors
    for (const protectedSel of this.protectedSelectors) {
      try {
        if (element.matches(protectedSel) || element.closest(protectedSel)) {
          return false;
        }
      } catch {
        // Continue
      }
    }

    // Reject root structures
    const tagName = element.tagName.toLowerCase();
    if (['html', 'body', 'main', 'header', 'nav', 'article'].includes(tagName) && !element.className.toLowerCase().includes('sponsored')) {
      return false;
    }

    return true;
  }

  private removeElement(
    element: Element,
    domain: string,
    selector: string,
    reason: string,
    debugLogs: boolean
  ): void {
    if (debugLogs) {
      console.log('JOGuard: Removed cosmetic ad element:', {
        domain: domain || window.location.hostname,
        selector,
        reason,
      });
    }

    if (element.parentNode) {
      element.remove();
    }
  }
}

export const cosmeticEngine = new CosmeticEngine();
