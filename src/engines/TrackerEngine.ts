import { ruleEngine } from './RuleEngine';

/**
 * Tracker Engine
 * 
 * Responsible for tracker detection, analytics beacon matching,
 * and third-party script analysis.
 */
export class TrackerEngine {
  /**
   * Evaluates whether a network URL or script element source is a tracker.
   */
  public isTracker(url: string, pageDomain?: string): boolean {
    if (!url) return false;
    return ruleEngine.isTrackerUrl(url, pageDomain);
  }

  /**
   * Scans a DOM script element to check if it points to a tracking service.
   */
  public isTrackerScript(scriptElement: HTMLScriptElement): boolean {
    if (!scriptElement) return false;
    const src = scriptElement.src || scriptElement.getAttribute('data-src') || '';
    if (src && this.isTracker(src)) {
      return true;
    }
    
    // Check inline script contents for tracking signatures
    const textContent = scriptElement.textContent || '';
    return (
      textContent.includes('gtag(') ||
      textContent.includes('ga("create"') ||
      textContent.includes('fbq("init"') ||
      textContent.includes('hj("init"')
    );
  }
}

export const trackerEngine = new TrackerEngine();
