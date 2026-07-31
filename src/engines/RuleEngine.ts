import { BlockRule } from '../types';
import { EASYLIST_RULES } from '../rules/easylist';
import { EASYPRIVACY_RULES } from '../rules/easyprivacy';
import { COSMETIC_AD_SELECTORS } from '../rules/cosmeticRules';
import { TRACKER_DOMAINS, TRACKER_URL_PATTERNS } from '../rules/trackerRules';
import { matchesDomain } from '../utils/domainUtils';

/**
 * Rule Engine
 * 
 * Responsible for loading, indexing, and evaluating rules against
 * URLs, domains, and DOM selectors.
 */
export class RuleEngine {
  private rules: BlockRule[] = [];
  private trackerDomains: Set<string> = new Set();
  private trackerPatterns: RegExp[] = [];
  private cosmeticSelectors: string[] = [];

  constructor() {
    this.loadBuiltInRules();
  }

  public loadBuiltInRules(): void {
    this.rules = [...EASYLIST_RULES, ...EASYPRIVACY_RULES];
    this.trackerDomains = new Set(TRACKER_DOMAINS);
    this.trackerPatterns = [...TRACKER_URL_PATTERNS];
    this.cosmeticSelectors = [...COSMETIC_AD_SELECTORS];
  }

  /**
   * Matches a candidate URL against ad-blocking rules.
   */
  public isAdUrl(url: string): boolean {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();

    return this.rules.some((rule) => {
      if (!rule.enabled || rule.type !== 'network') return false;
      return rule.urlPattern && lowerUrl.includes(rule.urlPattern.toLowerCase());
    });
  }

  /**
   * Matches a candidate domain/URL against tracker rules.
   */
  public isTrackerUrl(url: string, domain?: string): boolean {
    if (!url && !domain) return false;

    if (domain && this.trackerDomains.has(domain.toLowerCase())) {
      return true;
    }

    if (url) {
      const lowerUrl = url.toLowerCase();
      
      // Check domain match against set
      for (const tDomain of this.trackerDomains) {
        if (lowerUrl.includes(tDomain)) return true;
      }

      // Check pattern match
      for (const pattern of this.trackerPatterns) {
        if (pattern.test(lowerUrl)) return true;
      }
    }

    return false;
  }

  /**
   * Returns active CSS selectors for cosmetic DOM filtering.
   */
  public getCosmeticSelectors(): string[] {
    return this.cosmeticSelectors;
  }

  /**
   * Evaluates if a specific domain is whitelisted against whitelist rules.
   */
  public isWhitelisted(domain: string, whitelistDomains: string[]): boolean {
    if (!domain || !whitelistDomains || whitelistDomains.length === 0) {
      return false;
    }
    return whitelistDomains.some((wDomain) => matchesDomain(domain, wDomain));
  }
}

export const ruleEngine = new RuleEngine();
