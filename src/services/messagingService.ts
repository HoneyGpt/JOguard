import { ChromeMessage, ChromeMessageResponse, MessageAction } from '../types';

/**
 * Messaging Service
 * 
 * Manages strongly-typed message passing between Popup, Background Service Worker,
 * and Content Scripts with fallback handling.
 */
class MessagingService {
  /**
   * Send a strongly-typed message to the Background Service Worker.
   */
  async sendMessage<TResponse = unknown, TPayload = unknown>(
    action: MessageAction,
    payload?: TPayload
  ): Promise<ChromeMessageResponse<TResponse>> {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      return { success: false, error: 'Chrome Messaging API unavailable' };
    }

    const message: ChromeMessage<TPayload> = {
      action,
      payload,
      timestamp: Date.now(),
    };

    try {
      const response = await chrome.runtime.sendMessage(message);
      return response || { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`MessagingService.sendMessage [${action}] error:`, errorMsg);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Send a message directly to a specific browser tab's content script.
   */
  async sendMessageToTab<TResponse = unknown, TPayload = unknown>(
    tabId: number,
    action: MessageAction,
    payload?: TPayload
  ): Promise<ChromeMessageResponse<TResponse>> {
    if (typeof chrome === 'undefined' || !chrome.tabs?.sendMessage) {
      return { success: false, error: 'Chrome Tabs Messaging API unavailable' };
    }

    const message: ChromeMessage<TPayload> = {
      action,
      payload,
      timestamp: Date.now(),
    };

    try {
      const response = await chrome.tabs.sendMessage(tabId, message);
      return response || { success: true };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Register a message listener for incoming messages.
   */
  onMessage(
    handler: (
      message: ChromeMessage,
      sender: chrome.runtime.MessageSender
    ) => Promise<ChromeMessageResponse> | ChromeMessageResponse | void
  ): () => void {
    if (typeof chrome === 'undefined' || !chrome.runtime?.onMessage) {
      return () => {};
    }

    const listener = (
      message: ChromeMessage,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: unknown) => void
    ) => {
      const result = handler(message, sender);
      if (result instanceof Promise) {
        result.then(sendResponse).catch((err) =>
          sendResponse({ success: false, error: String(err) })
        );
        return true; // Indicates async response
      } else if (result) {
        sendResponse(result);
      }
      return false;
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }
}

export const messagingService = new MessagingService();
