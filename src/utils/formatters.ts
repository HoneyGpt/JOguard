/**
 * Human-readable formatters for numbers, bytes, time, and relative timestamps.
 */

/**
 * Formats byte counts into human-friendly strings (B, KB, MB, GB).
 * Example: 1548576 -> "1.5 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const val = bytes / Math.pow(1024, i);
  return `${val.toFixed(val < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Formats milliseconds into human-friendly estimated time saved (ms, s, m, h).
 * Example: 14500 -> "14.5s"
 */
export function formatTimeSaved(ms: number): string {
  if (ms <= 0) return '0s';
  const seconds = ms / 1000;
  
  if (seconds < 60) {
    return `${seconds.toFixed(seconds < 10 ? 1 : 0)}s`;
  }
  
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toFixed(1)}m`;
  }
  
  const hours = minutes / 60;
  return `${hours.toFixed(1)}h`;
}

/**
 * Formats integers with standard locale comma separators.
 * Example: 12450 -> "12,450"
 */
export function formatNumber(num: number): string {
  return (num || 0).toLocaleString();
}

/**
 * Formats unix timestamp into relative time string.
 * Example: Date.now() - 60000 -> "1 min ago"
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Just now';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}
