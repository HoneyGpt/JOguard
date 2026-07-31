/**
 * Domain Optimizer Engine - Version 2.0
 * 
 * High-performance domain-specific ad handlers targeting YouTube, ZEE5,
 * news outlets (Eenadu, TOI, NDTV), and social/e-commerce platforms.
 */

export class DomainOptimizerEngine {
  /**
   * Executes domain-specific optimization handlers based on current hostname.
   */
  public optimizeDomain(hostname: string): number {
    if (!hostname) return 0;

    const host = hostname.toLowerCase();
    let removedCount = 0;

    if (host.includes('youtube.com')) {
      removedCount += this.handleYouTube();
    } else if (host.includes('zee5.com')) {
      removedCount += this.handleZee5();
    } else if (host.includes('eenadu.net')) {
      removedCount += this.handleEenadu();
    } else if (host.includes('timesofindia') || host.includes('ndtv.com')) {
      removedCount += this.handleNewsSites();
    } else if (host.includes('reddit.com')) {
      removedCount += this.handleReddit();
    }

    return removedCount;
  }

  /**
   * YouTube Specific Handler:
   * 1. Auto-skips video ad overlays when skip button renders.
   * 2. Removes ytd-ad-slot-renderer and video overlay containers.
   */
  private handleYouTube(): number {
    let count = 0;

    // 1. Auto click video ad skip button if present
    const skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern');
    skipButtons.forEach((btn) => {
      if (btn && typeof (btn as HTMLElement).click === 'function') {
        (btn as HTMLElement).click();
        count++;
      }
    });

    // 2. Remove YouTube ad containers
    const ytAdSelectors = [
      'ytd-ad-slot-renderer',
      '#player-ads',
      '.video-ads',
      '.ytp-ad-module',
      '.ytp-ad-overlay-container',
      'ytd-in-feed-ad-layout-renderer',
      'ytd-banner-promo-renderer',
    ];

    ytAdSelectors.forEach((sel) => {
      try {
        const els = document.querySelectorAll(sel);
        els.forEach((el) => {
          if (el && el.parentNode) {
            el.remove();
            count++;
          }
        });
      } catch {
        // Continue
      }
    });

    return count;
  }

  /**
   * ZEE5 Handler: Removes ZEE5 ad wrappers.
   */
  private handleZee5(): number {
    let count = 0;
    const zeeSelectors = ['.adContainer', '[class*="ad_wrapper"]', '[id*="zee5_ad"]', '.ad-unit-wrapper'];
    zeeSelectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (el && el.parentNode) {
            el.remove();
            count++;
          }
        });
      } catch {}
    });
    return count;
  }

  /**
   * Eenadu Handler: Removes Eenadu ad boxes.
   */
  private handleEenadu(): number {
    let count = 0;
    const eenaduSelectors = ['.ad-box', '.top-ad', '.eenadu-ad', '[id^="div-gpt-ad"]'];
    eenaduSelectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (el && el.parentNode) {
            el.remove();
            count++;
          }
        });
      } catch {}
    });
    return count;
  }

  /**
   * News Sites Handler (TOI, NDTV)
   */
  private handleNewsSites(): number {
    let count = 0;
    const newsSelectors = ['.ad-widget', '.sponsored-news', '.outbrain_widget_container', '.taboola-main-container'];
    newsSelectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (el && el.parentNode) {
            el.remove();
            count++;
          }
        });
      } catch {}
    });
    return count;
  }

  /**
   * Reddit Handler: Removes promoted posts.
   */
  private handleReddit(): number {
    let count = 0;
    const redditSelectors = ['shreddit-ad-post', '[data-test-id="post-container"]:has([class*="promoted"])'];
    redditSelectors.forEach((sel) => {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          if (el && el.parentNode) {
            el.remove();
            count++;
          }
        });
      } catch {}
    });
    return count;
  }
}

export const domainOptimizerEngine = new DomainOptimizerEngine();
