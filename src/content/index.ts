import { filterEngine } from '../engines/FilterEngine';
import { antiAntiAdblockEngine } from '../engines/AntiAntiAdblockEngine';
import { messagingService } from '../services/messagingService';
import { extractDomain } from '../utils/domainUtils';
import { ExtensionSettings } from '../types';

/**
 * JOGuard Content Script Entry Point - Version 1.1
 * 
 * Injected into web pages at document_start. Manages cosmetic element hiding,
 * CosmeticEngine multi-signal native ad removal, throttled MutationObserver DOM scanning,
 * anti-adblock bypass, and reports stats.
 */
class ContentScriptController {
  private currentDomain = '';
  private isProtectionActive = false;
  private debugLogs = false;
  private observer: MutationObserver | null = null;
  private debounceTimer: number | null = null;

  public async init(): Promise<void> {
    this.currentDomain = extractDomain(window.location.href);
    if (!this.currentDomain) return;

    // Fetch active tab status & settings from Background Service Worker
    const [tabResponse, settingsResponse] = await Promise.all([
      messagingService.sendMessage<{ isProtected: boolean; isWhitelisted: boolean }>('GET_CURRENT_TAB_STATUS'),
      messagingService.sendMessage<ExtensionSettings>('GET_SETTINGS'),
    ]);

    if (!tabResponse.success || !tabResponse.data) {
      return;
    }

    if (settingsResponse.success && settingsResponse.data) {
      this.debugLogs = Boolean(settingsResponse.data.debugLogs);
    }

    const { isProtected, isWhitelisted } = tabResponse.data;
    if (!isProtected || isWhitelisted) {
      // Whitelisted or Protection Paused — do not hide elements
      return;
    }

    this.isProtectionActive = true;

    // 1. Immediate Cosmetic CSS Style Injection (Zero-latency visual hide)
    filterEngine.injectCosmeticStyles();

    // 2. Perform initial DOM ad element & native ad cleanup
    filterEngine.scanAndRemoveAdElements(
      (removedCount) => {
        this.reportBlockEvents(removedCount, 0, `Blocked ${removedCount} ad elements`);
      },
      this.debugLogs,
      this.currentDomain
    );

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

        filterEngine.scanAndRemoveAdElements(
          (removedCount) => {
            this.reportBlockEvents(removedCount, 0, `Removed ${removedCount} dynamic ad elements`);
          },
          this.debugLogs,
          this.currentDomain
        );

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
