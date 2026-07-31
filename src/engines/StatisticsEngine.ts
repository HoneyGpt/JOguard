import { BlockStats } from '../types';
import { STATS_ESTIMATES } from '../constants/storageKeys';

/**
 * Statistics Engine
 * 
 * Computes metrics: Ads blocked, Trackers blocked, Bandwidth saved, Estimated time saved.
 */
export class StatisticsEngine {
  /**
   * Calculates new aggregate statistics based on newly blocked item counts.
   */
  public computeUpdatedStats(
    currentStats: BlockStats,
    newAdsCount: number,
    newTrackersCount: number
  ): BlockStats {
    const additionalAdsBytes = newAdsCount * STATS_ESTIMATES.BYTES_PER_AD;
    const additionalTrackerBytes = newTrackersCount * STATS_ESTIMATES.BYTES_PER_TRACKER;
    const totalNewItems = newAdsCount + newTrackersCount;
    const additionalTimeMs = totalNewItems * STATS_ESTIMATES.TIME_MS_PER_ITEM;

    return {
      ...currentStats,
      adsBlockedTotal: currentStats.adsBlockedTotal + newAdsCount,
      trackersBlockedTotal: currentStats.trackersBlockedTotal + newTrackersCount,
      bandwidthSavedBytes: currentStats.bandwidthSavedBytes + additionalAdsBytes + additionalTrackerBytes,
      estimatedTimeSavedMs: currentStats.estimatedTimeSavedMs + additionalTimeMs,
      sessionAdsBlocked: currentStats.sessionAdsBlocked + newAdsCount,
      sessionTrackersBlocked: currentStats.sessionTrackersBlocked + newTrackersCount,
      lastUpdated: Date.now(),
    };
  }
}

export const statisticsEngine = new StatisticsEngine();
