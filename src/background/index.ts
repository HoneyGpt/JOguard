import { messageEngine } from '../engines/MessageEngine';
import { storageService } from '../services/storageService';
import { badgeService } from '../services/badgeService';
import { ChromeMessage } from '../types';

/**
 * JOGuard Background Service Worker Entry Point
 * 
 * Event-driven service worker for state management, messaging,
 * storage sync, and toolbar badge updates.
 */

// Initialize Extension State on Install / Startup
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // Ensure default settings and statistics exist in storage
    const settings = await storageService.getSettings();
    const stats = await storageService.getStats();
    await badgeService.updateBadge(
      stats.adsBlockedTotal + stats.trackersBlockedTotal,
      settings.protectionEnabled
    );

    await storageService.addActivityLog({
      type: 'system',
      domain: 'JOGuard Platform',
      details: 'JOGuard successfully installed and ready',
    });
  }
});

// Register Message Handler Bridge for Popup & Content Scripts
chrome.runtime.onMessage.addListener(
  (
    message: ChromeMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    messageEngine
      .handleMessage(message, sender)
      .then((res) => sendResponse(res))
      .catch((err) => sendResponse({ success: false, error: String(err) }));

    return true; // Keep message channel open for async response
  }
);

// Update Toolbar Badge when switching tabs or loading pages
chrome.tabs.onActivated.addListener(async () => {
  try {
    const settings = await storageService.getSettings();
    const stats = await storageService.getStats();
    await badgeService.updateBadge(
      stats.adsBlockedTotal + stats.trackersBlockedTotal,
      settings.protectionEnabled
    );
  } catch (err) {
    console.error('Background tabs.onActivated error:', err);
  }
});
