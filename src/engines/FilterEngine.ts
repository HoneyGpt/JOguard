import { adEngine } from './AdEngine';
import { ruleEngine } from './RuleEngine';

/**
 * Filter Engine
 * 
 * High-performance DOM cosmetic filtering engine running inside the Content Script.
 * Uses CSS injection for zero-latency initial hide + throttled DOM scanning.
 */
export class FilterEngine {
  private styleElement: HTMLStyleElement | null = null;
  private isScanning = false;

  /**
   * Fast-path: Inject cosmetic stylesheet into webpage head immediately.
   */
  public injectCosmeticStyles(): void {
    if (this.styleElement && document.head?.contains(this.styleElement)) {
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
  public scanAndRemoveAdElements(onAdRemoved?: (count: number) => void): void {
    if (this.isScanning) return;
    this.isScanning = true;

    requestAnimationFrame(() => {
      let removedCount = 0;
      const selectors = ruleEngine.getCosmeticSelectors();

      if (selectors.length > 0) {
        try {
          const elements = document.querySelectorAll(selectors.join(', '));
          elements.forEach((el) => {
            if (el && el.parentNode) {
              el.remove();
              removedCount++;
            }
          });
        } catch (err) {
          console.error('FilterEngine.scanAndRemoveAdElements querySelectorAll error:', err);
        }
      }

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
