/**
 * Tracker & Telemetry Rule Definitions
 * 
 * Contains domain signatures for tracking scripts, analytics beacons,
 * fingerprinting services, and telemetry endpoints.
 */

export const TRACKER_DOMAINS: string[] = [
  'google-analytics.com',
  'googletagmanager.com',
  'analytics.google.com',
  'connect.facebook.net',
  'pixel.facebook.com',
  'doubleclick.net',
  'adservice.google.com',
  'hotjar.com',
  'mixpanel.com',
  'segment.io',
  'segment.com',
  'crazyegg.com',
  'clarity.ms',
  'mc.yandex.ru',
  'scorecardresearch.com',
  'quantserve.com',
  'criteo.com',
  'criteo.net',
  'taboola.com',
  'outbrain.com',
  'amazon-adsystem.com',
  'ads-twitter.com',
  'static.ads-twitter.com',
];

export const TRACKER_URL_PATTERNS: RegExp[] = [
  /\/gtag\/js/i,
  /\/analytics\.js/i,
  /\/pixel\.js/i,
  /\/beacon\.js/i,
  /\/telemetry/i,
  /\/tr\/\?id=/i,
  /\/collect\?v=/i,
  /\/event\?category=/i,
];
