/**
 * JOGuard Core Type Definitions
 * 
 * Defines all domain contracts, extension settings, block statistics,
 * message passing protocols, rule formats, and API data shapes.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ExtensionSettings {
  protectionEnabled: boolean;
  adBlockingEnabled: boolean;
  trackerBlockingEnabled: boolean;
  cosmeticFilteringEnabled: boolean;
  antiAntiAdblockEnabled: boolean;
  theme: ThemeMode;
  autoUpdateRules: boolean;
  debugLogs: boolean;
}

export interface BlockStats {
  adsBlockedTotal: number;
  trackersBlockedTotal: number;
  bandwidthSavedBytes: number; // Estimated bytes saved (e.g. ~100KB per ad/tracker script)
  estimatedTimeSavedMs: number; // Estimated milliseconds saved (e.g. ~50ms per network item)
  sessionAdsBlocked: number;
  sessionTrackersBlocked: number;
  lastUpdated: number;
}

export interface WhitelistItem {
  domain: string;
  addedAt: number;
  enabled: boolean;
  notes?: string;
}

export type ActivityType = 'ad' | 'tracker' | 'anti_adblock' | 'whitelist' | 'system';

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: ActivityType;
  domain: string;
  details: string;
}

export type RuleType = 'cosmetic' | 'network' | 'tracker' | 'custom';

export interface BlockRule {
  id: string;
  type: RuleType;
  selector?: string; // For CSS cosmetic rules
  urlPattern?: string; // For URL/network rules
  domainPattern?: string;
  action: 'hide' | 'block' | 'allow';
  enabled: boolean;
}

export interface TabStatus {
  tabId: number;
  url: string;
  domain: string;
  isWhitelisted: boolean;
  isProtected: boolean;
  isInternal: boolean;
  adsBlockedOnTab: number;
  trackersBlockedOnTab: number;
}

// ──────────────────────────────
// Message Passing Protocol Types
// ──────────────────────────────

export type MessageAction =
  | 'GET_SETTINGS'
  | 'UPDATE_SETTINGS'
  | 'GET_STATS'
  | 'RESET_STATS'
  | 'TOGGLE_PROTECTION'
  | 'ADD_WHITELIST'
  | 'REMOVE_WHITELIST'
  | 'GET_CURRENT_TAB_STATUS'
  | 'RECORD_BLOCK_EVENT'
  | 'EXPORT_SETTINGS'
  | 'IMPORT_SETTINGS'
  | 'PING'
  | 'PONG';

export interface ChromeMessage<T = unknown> {
  action: MessageAction;
  payload?: T;
  timestamp?: number;
}

export interface ChromeMessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RecordBlockEventPayload {
  domain: string;
  adsCount: number;
  trackersCount: number;
  bytesSaved: number;
  activityType: ActivityType;
  details: string;
}
