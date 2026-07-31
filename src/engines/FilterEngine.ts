import { adEngine } from './AdEngine';
import { cosmeticEngine } from './CosmeticEngine';

/**
 * Filter Engine - Version 1.1
 * 
 * High-performance DOM cosmetic filtering engine running inside the Content Script.
 * Uses CSS injection for zero-latency initial hide + requestAnimationFrame batched
 * multi-signal inspection via CosmeticEngine.
 */
export class FilterEngine {
  private styleElement: HTMLStyleElement | null = null;
  private isScanning = false;

  /**
   * Fast-path: Inject cosmetic stylesheet into webpage head immediately.
   */
  public injectCosmeticStyles(): void {
    if (this.styleElement && document.head.contains(this.styleElement)) {
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
      this.styleElement = style;
    }
  }

  /**
   * Scans document DOM tree and removes hidden ad elements directly to save memory.
   * Uses requestAnimationFrame to avoid blocking main UI thread.
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
        if (el && el.parentNode) {
          el.remove();
          removedCount++;
        }
      });

      // 2. Advanced Multi-Signal Native & Hardcoded Ad Removal via CosmeticEngine
      removedCount += cosmeticEngine.inspectAndRemove(document, debugLogs, domain);

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
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }
}

export const filterEngine = new FilterEngine();
