import { extractDomain, isInternalUrl } from '../utils/domainUtils';

export interface ActiveTabInfo {
  tabId: number;
  url: string;
  domain: string;
  isInternal: boolean;
  title: string;
  favIconUrl?: string;
}

/**
 * Tab Service
 * 
 * Safe wrapper around chrome.tabs for active website inspection.
 */
class TabService {
  async getActiveTab(): Promise<ActiveTabInfo | null> {
    if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
      // Mock tab fallback for standalone UI development/testing
      return {
        tabId: 1,
        url: 'https://news.example.com/article/tech-today',
        domain: 'news.example.com',
        isInternal: false,
        title: 'News Example - Tech Today',
      };
    }

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      if (!activeTab || !activeTab.id || !activeTab.url) {
        return null;
      }

      const domain = extractDomain(activeTab.url);
      const isInternal = isInternalUrl(activeTab.url);

      return {
        tabId: activeTab.id,
        url: activeTab.url,
        domain,
        isInternal,
        title: activeTab.title || domain || 'Active Tab',
        favIconUrl: activeTab.favIconUrl,
      };
    } catch (err) {
      console.error('TabService.getActiveTab error:', err);
      return null;
    }
  }

  async reloadTab(tabId: number): Promise<void> {
    if (typeof chrome !== 'undefined' && chrome.tabs?.reload) {
      try {
        await chrome.tabs.reload(tabId);
      } catch (err) {
        console.error('TabService.reloadTab error:', err);
      }
    }
  }
}

export const tabService = new TabService();
