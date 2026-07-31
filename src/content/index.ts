import { filterEngine } from '../engines/FilterEngine';
import { antiAntiAdblockEngine } from '../engines/AntiAntiAdblockEngine';
import { messagingService } from '../services/messagingService';
import { extractDomain } from '../utils/domainUtils';

/**
 * JOGuard Content Script Entry Point
 * 
 * Injected into web pages at document_start. Manages cosmetic element hiding,
 * dynamic MutationObserver DOM scanning, anti-adblock bypass, and reports stats.
 */
class ContentScriptController {
  private currentDomain = '';
  private isProtectionActive = false;
  private observer: MutationObserver | null = null;
  private debounceTimer: number | null = null;

  public async init(): Promise<void> {
    this.currentDomain = extractDomain(window.location.href);
    if (!this.currentDomain) return;

    // Fetch active tab status & settings from Background Service Worker
    const response = await messagingService.sendMessage<{
      isProtected: boolean;
      isWhitelisted: boolean;
    }>('GET_CURRENT_TAB_STATUS');

    if (!response.success || !response.data) {
      return;
    }

    const { isProtected, isWhitelisted } = response.data;
    if (!isProtected || isWhitelisted) {
      // Whitelisted or Protection Paused — do not hide elements
      return;
    }

    this.isProtectionActive = true;

    // 1. Immediate Cosmetic CSS Style Injection (Zero-latency visual hide)
    filterEngine.injectCosmeticStyles();

    // 2. Perform initial DOM ad element cleanup
    filterEngine.scanAndRemoveAdElements((removedCount) => {
      this.reportBlockEvents(removedCount, 0, `Blocked ${removedCount} ad elements`);
    });

    // 3. Bypass Anti-Adblock Overlays if present
    const antiAdblockRemoved = antiAntiAdblockEngine.bypassAntiAdblockOverlays(document);
    if (antiAdblockRemoved > 0) {
      this.reportBlockEvents(0, 0, `Bypassed ${antiAdblockRemoved} anti-adblock overlays`);
    }

    // 4. Setup Throttled MutationObserver for dynamically loaded ads
    this.setupDynamicMutationObserver();
  }

  /**
   * Sets up MutationObserver with debounced callback to prevent UI thread blocking
   * and avoid scanning whole DOM repeatedly.
   */
  private setupDynamicMutationObserver(): void {
    if (this.observer || !document.body) return;

    this.observer = new MutationObserver((mutations) => {
      // Check if added nodes contain potential ad wrappers before firing full scan
      const hasRelevantNodes = mutations.some((m) => m.addedNodes && m.addedNodes.length > 0);
      if (!hasRelevantNodes) return;

      if (this.debounceTimer !== null) {
        window.clearTimeout(this.debounceTimer);
      }

      // Debounce scan calls by 250ms to aggregate DOM batch updates
      this.debounceTimer = window.setTimeout(() => {
        if (!this.isProtectionActive) return;

        filterEngine.scanAndRemoveAdElements((removedCount) => {
          this.reportBlockEvents(removedCount, 0, `Removed ${removedCount} dynamic ad elements`);
        });

        antiAntiAdblockEngine.bypassAntiAdblockOverlays(document);
      }, 250);
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private reportBlockEvents(adsCount: number, trackersCount: number, details: string): void {
    if (adsCount <= 0 && trackersCount <= 0) return;

    messagingService.sendMessage('RECORD_BLOCK_EVENT', {
      domain: this.currentDomain,
      adsCount,
      trackersCount,
      activityType: adsCount > 0 ? 'ad' : 'tracker',
      details,
    });
  }
}

// Instantiate content script controller when DOM starts loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const controller = new ContentScriptController();
    controller.init();
  });
} else {
  const controller = new ContentScriptController();
  controller.init();
}
