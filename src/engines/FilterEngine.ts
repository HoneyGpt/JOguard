import { adEngine } from './AdEngine';
import { cosmeticEngine } from './CosmeticEngine';
import { domainOptimizerEngine } from './DomainOptimizerEngine';

/**
 * Filter Engine - Version 2.0
 * 
 * High-performance DOM cosmetic filtering engine running inside Content Script.
 * Features:
 * - Duplicate-safe early CSS injection into documentElement or head.
 * - WeakSet element memory cache to prevent duplicate node scans.
 * - DomainOptimizerEngine integration for YouTube, ZEE5, news, and social platforms.
 */
export class FilterEngine {
  private isScanning = false;
  private processedNodes = new WeakSet<Node>();

  /**
   * Fast-path: Inject cosmetic stylesheet immediately into document.head or document.documentElement.
   */
  public injectCosmeticStyles(): void {
    if (document.getElementById('joguard-cosmetic-rules')) {
      return;
    }

    const cssContent = adEngine.generateCosmeticStylesheet();
    if (!cssContent) return;

    const style = document.createElement('style');
    style.id = 'joguard-cosmetic-rules';
    style.textContent = cssContent;

    const target = document.head || document.documentElement;
    if (target) {
      target.appendChild(style);
    }
  }

  /**
   * Scans document DOM tree and removes hidden ad elements directly to save memory.
   * Uses requestAnimationFrame to avoid blocking main UI thread and WeakSet cache.
   */
  public scanAndRemoveAdElements(
    onAdRemoved?: (count: number) => void,
    debugLogs: boolean = false,
    domain: string = ''
  ): void {
    if (this.isScanning) return;
    this.isScanning = true;

    requestAnimationFrame(() => {
      let removedCount = 0;

      // 1. Basic Cosmetic Removal
      const elements = document.querySelectorAll(
        '#dfp-ad-container, .ad-container, .ad-banner, .ad-slot, .ad-unit, [id^="div-gpt-ad"], [aria-label="advertisement"], [aria-label="Sponsored"]'
      );

      elements.forEach((el) => {
        if (!this.processedNodes.has(el)) {
          this.processedNodes.add(el);
          if (el && el.parentNode) {
            el.remove();
            removedCount++;
          }
        }
      });

      // 2. Advanced Multi-Signal Native & Hardcoded Ad Removal via CosmeticEngine
      removedCount += cosmeticEngine.inspectAndRemove(document, debugLogs, domain);

      // 3. Domain-Specific Handler Removal (YouTube, ZEE5, Eenadu, News, Social)
      removedCount += domainOptimizerEngine.optimizeDomain(domain || window.location.hostname);

      this.isScanning = false;
      if (removedCount > 0 && onAdRemoved) {
        onAdRemoved(removedCount);
      }
    });
  }

  /**
   * Cleanup method to remove injected styles when protection is disabled.
   */
  public removeCosmeticStyles(): void {
    const existing = document.getElementById('joguard-cosmetic-rules');
    if (existing && existing.parentNode) {
      existing.remove();
    }
  }
}

export const filterEngine = new FilterEngine();
