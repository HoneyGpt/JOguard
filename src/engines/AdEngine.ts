import { ruleEngine } from './RuleEngine';

/**
 * Ad Engine
 * 
 * Responsible for ad classification and cosmetic filtering rule generation.
 */
export class AdEngine {
  /**
   * Generates aggregated CSS code for injecting element-hiding styles into web pages.
   */
  public generateCosmeticStylesheet(): string {
    const selectors = ruleEngine.getCosmeticSelectors();
    if (selectors.length === 0) return '';

    return `
      ${selectors.join(',\n')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
      }
    `;
  }

  /**
   * Checks if an element matches known ad class/ID signatures.
   */
  public isAdElement(element: Element): boolean {
    if (!element) return false;
    const selectors = ruleEngine.getCosmeticSelectors();
    return selectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch {
        return false;
      }
    });
  }
}

export const adEngine = new AdEngine();
