import { filterEngine } from '../engines/FilterEngine';
import { antiAntiAdblockEngine } from '../engines/AntiAntiAdblockEngine';
import { messagingService } from '../services/messagingService';
import { extractDomain } from '../utils/domainUtils';
import { ExtensionSettings } from '../types';

/**
 * JOGuard Content Script Entry Point - Version 2.0
 * 
 * Executed immediately at document_start. Manages instant zero-latency CSS injection,
 * SPA navigation listeners (YouTube, Zee5, social), WeakSet MutationObserver,
 * and background stats reporting.
 */
class ContentScriptController {
  private currentDomain = '';
  private isProtectionActive = false;
  private debugLogs = false;
  private observer: MutationObserver | null = null;
  private debounceTimer: number | null = null;
  private lastUrl = '';

  public async init(): Promise<void> {
    this.currentDomain = extractDomain(window.location.href);
    this.lastUrl = window.location.href;
    if (!this.currentDomain) return;

    // 1. Instant CSS Injection at document_start (Zero-latency visual hide before initial render)
    filterEngine.injectCosmeticStyles();

    // 2. Fetch active tab status & settings asynchronously
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
      // Whitelisted or Protection Paused — remove early injected CSS
      filterEngine.removeCosmeticStyles();
      return;
    }

    this.isProtectionActive = true;

    // 3. Perform initial DOM ad element & native ad cleanup
    filterEngine.scanAndRemoveAdElements(
      (removedCount) => {
        this.reportBlockEvents(removedCount, 0, `Blocked ${removedCount} ad elements`);
      },
      this.debugLogs,
      this.currentDomain
    );

    // 4. Bypass Anti-Adblock Overlays if present
    const antiAdblockRemoved = antiAntiAdblockEngine.bypassAntiAdblockOverlays(document);
    if (antiAdblockRemoved > 0) {
      this.reportBlockEvents(0, 0, `Bypassed ${antiAdblockRemoved} anti-adblock overlays`);
    }

    // 5. Setup Throttled MutationObserver & SPA Navigation Listeners
    this.setupDynamicMutationObserver();
    this.setupSPANavigationListeners();
  }

  /**
   * SPA Navigation Interceptor (YouTube, Zee5, News, Social SPA routers)
   */
  private setupSPANavigationListeners(): void {
    // 1. YouTube & Custom Event Listeners
    const spaEvents = ['yt-navigate-finish', 'yt-navigate-start', 'yt-page-data-updated', 'popstate'];
    spaEvents.forEach((evt) => {
      window.addEventListener(evt, () => this.handleNavigationEvent());
    });

    // 2. History PushState / ReplaceState Interception
    const originalPushState = history.pushState;
    if (originalPushState) {
      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.handleNavigationEvent();
      };
    }

    // 3. Lightweight URL Poller Backup
    setInterval(() => {
      if (window.location.href !== this.lastUrl) {
        this.lastUrl = window.location.href;
        this.handleNavigationEvent();
      }
    }, 1000);
  }

  private handleNavigationEvent(): void {
    if (!this.isProtectionActive) return;

    filterEngine.injectCosmeticStyles();
    filterEngine.scanAndRemoveAdElements(
      (removedCount) => {
        this.reportBlockEvents(removedCount, 0, `Removed ${removedCount} ads on SPA navigation`);
      },
      this.debugLogs,
      this.currentDomain
    );
    antiAntiAdblockEngine.bypassAntiAdblockOverlays(document);
  }

  /**
   * Sets up MutationObserver with debounced callback to prevent UI thread blocking.
   */
  private setupDynamicMutationObserver(): void {
    if (this.observer) return;

    const targetNode = document.body || document.documentElement;
    if (!targetNode) return;

    this.observer = new MutationObserver((mutations) => {
      const hasRelevantNodes = mutations.some((m) => m.addedNodes && m.addedNodes.length > 0);
      if (!hasRelevantNodes) return;

      if (this.debounceTimer !== null) {
        window.clearTimeout(this.debounceTimer);
      }

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
      }, 150);
    });

    this.observer.observe(targetNode, {
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

// Immediate execution at document_start (No DOMContentLoaded delay!)
const controller = new ContentScriptController();
controller.init();
