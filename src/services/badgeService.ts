/**
 * Badge Service
 * 
 * Updates the extension toolbar badge with live protection status and blocked counts.
 */
class BadgeService {
  /**
   * Updates badge count text and background color.
   * - Enabled: Shows formatted block count (e.g. "12", "1.4k") with terracotta background (#EA580C).
   * - Disabled: Shows "OFF" badge text with subtle warm stone background (#78716C).
   */
  async updateBadge(count: number, isEnabled: boolean): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.action) {
      return;
    }

    try {
      if (!isEnabled) {
        await chrome.action.setBadgeText({ text: 'OFF' });
        await chrome.action.setBadgeBackgroundColor({ color: '#78716C' });
        await chrome.action.setTitle({ title: 'JOGuard: Protection Paused' });
        return;
      }

      if (count <= 0) {
        await chrome.action.setBadgeText({ text: '' });
        await chrome.action.setTitle({ title: 'JOGuard: Active & Protecting' });
        return;
      }

      // Format large counts concisely: 1245 -> "1.2k"
      let text = String(count);
      if (count >= 10000) {
        text = `${(count / 1000).toFixed(0)}k`;
      } else if (count >= 1000) {
        text = `${(count / 1000).toFixed(1)}k`;
      }

      await chrome.action.setBadgeText({ text });
      await chrome.action.setBadgeBackgroundColor({ color: '#EA580C' }); // Terracotta warm accent
      await chrome.action.setTitle({ title: `JOGuard: ${count} items blocked` });
    } catch (err) {
      console.error('BadgeService.updateBadge error:', err);
    }
  }
}

export const badgeService = new BadgeService();
