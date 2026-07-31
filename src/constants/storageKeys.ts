import { ExtensionSettings, BlockStats } from '../types';

/**
 * Storage Keys & System Defaults
 */

export const STORAGE_KEYS = {
  SETTINGS: 'joguard_settings',
  STATS: 'joguard_stats',
  WHITELIST: 'joguard_whitelist',
  ACTIVITY_LOGS: 'joguard_activity_logs',
  CUSTOM_RULES: 'joguard_custom_rules',
} as const;

export const DEFAULT_SETTINGS: ExtensionSettings = {
  protectionEnabled: true,
  adBlockingEnabled: true,
  trackerBlockingEnabled: true,
  cosmeticFilteringEnabled: true,
  antiAntiAdblockEnabled: true,
  theme: 'system',
  autoUpdateRules: true,
  debugLogs: false,
};

export const DEFAULT_STATS: BlockStats = {
  adsBlockedTotal: 0,
  trackersBlockedTotal: 0,
  bandwidthSavedBytes: 0,
  estimatedTimeSavedMs: 0,
  sessionAdsBlocked: 0,
  sessionTrackersBlocked: 0,
  lastUpdated: Date.now(),
};

// Estimations per blocked ad / tracker item
export const STATS_ESTIMATES = {
  BYTES_PER_AD: 120 * 1024,      // ~120 KB average ad creative saved
  BYTES_PER_TRACKER: 35 * 1024,  // ~35 KB average tracker script saved
  TIME_MS_PER_ITEM: 65,           // ~65 ms parsing/network wait saved per item
};

export const MAX_ACTIVITY_LOGS = 50;
