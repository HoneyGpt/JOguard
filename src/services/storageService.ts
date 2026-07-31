import { ExtensionSettings, BlockStats, WhitelistItem, ActivityLog } from '../types';
import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_STATS } from '../constants/storageKeys';

/**
 * Storage Service
 * 
 * Safe wrapper around chrome.storage.local with in-memory fallback
 * for development, unit testing, and non-extension environments.
 */
class StorageService {
  private inMemoryCache: Record<string, unknown> = {};

  private isChromeStorageAvailable(): boolean {
    return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
  }

  async getSettings(): Promise<ExtensionSettings> {
    if (this.isChromeStorageAvailable()) {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
        return (result[STORAGE_KEYS.SETTINGS] as ExtensionSettings) || DEFAULT_SETTINGS;
      } catch (err) {
        console.error('StorageService.getSettings error:', err);
        return DEFAULT_SETTINGS;
      }
    }
    return (this.inMemoryCache[STORAGE_KEYS.SETTINGS] as ExtensionSettings) || DEFAULT_SETTINGS;
  }

  async setSettings(settings: Partial<ExtensionSettings>): Promise<ExtensionSettings> {
    const current = await this.getSettings();
    const updated: ExtensionSettings = { ...current, ...settings };

    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated });
      } catch (err) {
        console.error('StorageService.setSettings error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.SETTINGS] = updated;
    }
    return updated;
  }

  async getStats(): Promise<BlockStats> {
    if (this.isChromeStorageAvailable()) {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEYS.STATS);
        return (result[STORAGE_KEYS.STATS] as BlockStats) || DEFAULT_STATS;
      } catch (err) {
        console.error('StorageService.getStats error:', err);
        return DEFAULT_STATS;
      }
    }
    return (this.inMemoryCache[STORAGE_KEYS.STATS] as BlockStats) || DEFAULT_STATS;
  }

  async updateStats(updater: (prev: BlockStats) => BlockStats): Promise<BlockStats> {
    const current = await this.getStats();
    const updated = updater(current);
    updated.lastUpdated = Date.now();

    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.STATS]: updated });
      } catch (err) {
        console.error('StorageService.updateStats error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.STATS] = updated;
    }
    return updated;
  }

  async resetStats(): Promise<BlockStats> {
    const reset = { ...DEFAULT_STATS, lastUpdated: Date.now() };
    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.STATS]: reset });
      } catch (err) {
        console.error('StorageService.resetStats error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.STATS] = reset;
    }
    return reset;
  }

  async getWhitelist(): Promise<WhitelistItem[]> {
    if (this.isChromeStorageAvailable()) {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEYS.WHITELIST);
        return (result[STORAGE_KEYS.WHITELIST] as WhitelistItem[]) || [];
      } catch (err) {
        console.error('StorageService.getWhitelist error:', err);
        return [];
      }
    }
    return (this.inMemoryCache[STORAGE_KEYS.WHITELIST] as WhitelistItem[]) || [];
  }

  async addWhitelistDomain(domain: string, notes?: string): Promise<WhitelistItem[]> {
    const current = await this.getWhitelist();
    const cleanDomain = domain.toLowerCase().trim();
    if (!cleanDomain) return current;

    const exists = current.some((item) => item.domain === cleanDomain);
    if (exists) return current;

    const newItem: WhitelistItem = {
      domain: cleanDomain,
      addedAt: Date.now(),
      enabled: true,
      notes,
    };
    const updated = [newItem, ...current];

    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: updated });
      } catch (err) {
        console.error('StorageService.addWhitelistDomain error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.WHITELIST] = updated;
    }
    return updated;
  }

  async removeWhitelistDomain(domain: string): Promise<WhitelistItem[]> {
    const current = await this.getWhitelist();
    const cleanDomain = domain.toLowerCase().trim();
    const updated = current.filter((item) => item.domain !== cleanDomain);

    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.WHITELIST]: updated });
      } catch (err) {
        console.error('StorageService.removeWhitelistDomain error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.WHITELIST] = updated;
    }
    return updated;
  }

  async getActivityLogs(): Promise<ActivityLog[]> {
    if (this.isChromeStorageAvailable()) {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEYS.ACTIVITY_LOGS);
        return (result[STORAGE_KEYS.ACTIVITY_LOGS] as ActivityLog[]) || [];
      } catch (err) {
        console.error('StorageService.getActivityLogs error:', err);
        return [];
      }
    }
    return (this.inMemoryCache[STORAGE_KEYS.ACTIVITY_LOGS] as ActivityLog[]) || [];
  }

  async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog[]> {
    const current = await this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    // Keep maximum 50 recent activity logs
    const updated = [newLog, ...current].slice(0, 50);

    if (this.isChromeStorageAvailable()) {
      try {
        await chrome.storage.local.set({ [STORAGE_KEYS.ACTIVITY_LOGS]: updated });
      } catch (err) {
        console.error('StorageService.addActivityLog error:', err);
      }
    } else {
      this.inMemoryCache[STORAGE_KEYS.ACTIVITY_LOGS] = updated;
    }
    return updated;
  }
}

export const storageService = new StorageService();
