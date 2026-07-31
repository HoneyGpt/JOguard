import { BlockRule } from '../types';

/**
 * EasyPrivacy Core Tracker & Analytics Blocking Rules
 */
export const EASYPRIVACY_RULES: BlockRule[] = [
  { id: 'ep-1', type: 'tracker', urlPattern: 'google-analytics.com', action: 'block', enabled: true },
  { id: 'ep-2', type: 'tracker', urlPattern: 'googletagmanager.com', action: 'block', enabled: true },
  { id: 'ep-3', type: 'tracker', urlPattern: 'segment.com', action: 'block', enabled: true },
  { id: 'ep-4', type: 'tracker', urlPattern: 'mixpanel.com', action: 'block', enabled: true },
  { id: 'ep-5', type: 'tracker', urlPattern: 'hotjar.com', action: 'block', enabled: true },
  { id: 'ep-6', type: 'tracker', urlPattern: 'clarity.ms', action: 'block', enabled: true },
  { id: 'ep-7', type: 'tracker', urlPattern: 'connect.facebook.net', action: 'block', enabled: true },
  { id: 'ep-8', type: 'tracker', urlPattern: 'pixel.facebook.com', action: 'block', enabled: true },
  { id: 'ep-9', type: 'tracker', urlPattern: 'scorecardresearch.com', action: 'block', enabled: true },
  { id: 'ep-10', type: 'tracker', urlPattern: 'quantserve.com', action: 'block', enabled: true },
];
