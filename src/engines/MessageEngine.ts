import { ChromeMessage, ChromeMessageResponse, RecordBlockEventPayload } from '../types';
import { storageService } from '../services/storageService';
import { badgeService } from '../services/badgeService';
import { tabService } from '../services/tabService';
import { statisticsEngine } from './StatisticsEngine';
import { ruleEngine } from './RuleEngine';
import { extractDomain, isInternalUrl } from '../utils/domainUtils';

/**
 * Message Engine
 * 
 * Event-driven background message handler. Routes messages from Popup and
 * Content Scripts to state, storage, and statistical calculations.
 */
export class MessageEngine {
  public async handleMessage(
    message: ChromeMessage,
    sender?: chrome.runtime.MessageSender
  ): Promise<ChromeMessageResponse> {
    if (!message || !message.action) {
      return { success: false, error: 'Invalid message contract' };
    }

    try {
      switch (message.action) {
        case 'GET_SETTINGS': {
          const settings = await storageService.getSettings();
          return { success: true, data: settings };
        }

        case 'UPDATE_SETTINGS': {
          const partialSettings = message.payload as Partial<import('../types').ExtensionSettings>;
          const updated = await storageService.setSettings(partialSettings);
          
          // Refresh badge status
          const stats = await storageService.getStats();
          await badgeService.updateBadge(
            stats.adsBlockedTotal + stats.trackersBlockedTotal,
            updated.protectionEnabled
          );
          
          return { success: true, data: updated };
        }

        case 'TOGGLE_PROTECTION': {
          const settings = await storageService.getSettings();
          const newStatus = !settings.protectionEnabled;
          const updated = await storageService.setSettings({ protectionEnabled: newStatus });
          
          const stats = await storageService.getStats();
          await badgeService.updateBadge(
            stats.adsBlockedTotal + stats.trackersBlockedTotal,
            newStatus
          );

          await storageService.addActivityLog({
            type: 'system',
            domain: 'Global System',
            details: `Protection ${newStatus ? 'Activated' : 'Paused'}`,
          });

          return { success: true, data: updated };
        }

        case 'GET_STATS': {
          const stats = await storageService.getStats();
          return { success: true, data: stats };
        }

        case 'RESET_STATS': {
          const resetStats = await storageService.resetStats();
          const settings = await storageService.getSettings();
          await badgeService.updateBadge(0, settings.protectionEnabled);
          
          await storageService.addActivityLog({
            type: 'system',
            domain: 'Global System',
            details: 'Protection Statistics Reset',
          });

          return { success: true, data: resetStats };
        }

        case 'GET_CURRENT_TAB_STATUS': {
          const settings = await storageService.getSettings();
          const whitelist = await storageService.getWhitelist();

          // Prefer sender.tab if available (sent from Content Script)
          let tabId = sender?.tab?.id || 0;
          let url = sender?.tab?.url || '';
          let domain = extractDomain(url);
          let isInternal = isInternalUrl(url);

          // Fallback to active window tab if not sent from a tab (e.g. Popup)
          if (!url) {
            const activeTab = await tabService.getActiveTab();
            if (activeTab) {
              tabId = activeTab.tabId;
              url = activeTab.url;
              domain = activeTab.domain;
              isInternal = activeTab.isInternal;
            }
          }

          const isWhitelisted = domain ? ruleEngine.isWhitelisted(domain, whitelist.map((w) => w.domain)) : false;
          const isProtected = settings.protectionEnabled && !isWhitelisted && !isInternal;

          return {
            success: true,
            data: {
              tabId,
              url,
              domain,
              isWhitelisted,
              isProtected,
              isInternal,
              adsBlockedOnTab: 0,
              trackersBlockedOnTab: 0,
            },
          };
        }

        case 'ADD_WHITELIST': {
          const domain = (message.payload as { domain: string })?.domain;
          if (!domain) return { success: false, error: 'Domain required' };

          const updatedWhitelist = await storageService.addWhitelistDomain(domain);
          await storageService.addActivityLog({
            type: 'whitelist',
            domain,
            details: `Domain ${domain} added to Whitelist`,
          });

          // Reload tab if active
          const currentTab = await tabService.getActiveTab();
          if (currentTab && currentTab.domain === domain) {
            await tabService.reloadTab(currentTab.tabId);
          }

          return { success: true, data: updatedWhitelist };
        }

        case 'REMOVE_WHITELIST': {
          const domain = (message.payload as { domain: string })?.domain;
          if (!domain) return { success: false, error: 'Domain required' };

          const updatedWhitelist = await storageService.removeWhitelistDomain(domain);
          await storageService.addActivityLog({
            type: 'whitelist',
            domain,
            details: `Domain ${domain} removed from Whitelist`,
          });

          const currentTab = await tabService.getActiveTab();
          if (currentTab && currentTab.domain === domain) {
            await tabService.reloadTab(currentTab.tabId);
          }

          return { success: true, data: updatedWhitelist };
        }

        case 'RECORD_BLOCK_EVENT': {
          const payload = message.payload as RecordBlockEventPayload;
          if (!payload) return { success: false, error: 'Payload missing' };

          const updatedStats = await storageService.updateStats((prev) =>
            statisticsEngine.computeUpdatedStats(prev, payload.adsCount || 0, payload.trackersCount || 0)
          );

          const settings = await storageService.getSettings();
          await badgeService.updateBadge(
            updatedStats.adsBlockedTotal + updatedStats.trackersBlockedTotal,
            settings.protectionEnabled
          );

          if (payload.details) {
            await storageService.addActivityLog({
              type: payload.activityType || 'ad',
              domain: payload.domain || 'webpage',
              details: payload.details,
            });
          }

          return { success: true, data: updatedStats };
        }

        case 'PING':
          return { success: true, data: 'PONG' };

        default:
          return { success: false, error: `Unknown action: ${message.action}` };
      }
    } catch (err) {
      console.error(`MessageEngine error handling [${message.action}]:`, err);
      return { success: false, error: String(err) };
    }
  }
}

export const messageEngine = new MessageEngine();
