/**
 * Chrome Extension API Mock Framework for Unit Testing
 */

export function setupChromeMock() {
  const storageStore: Record<string, unknown> = {};

  const mockChrome = {
    storage: {
      local: {
        get: async (keys: string | string[]) => {
          if (typeof keys === 'string') {
            return { [keys]: storageStore[keys] };
          }
          const res: Record<string, unknown> = {};
          keys.forEach((k) => {
            res[k] = storageStore[k];
          });
          return res;
        },
        set: async (items: Record<string, unknown>) => {
          Object.assign(storageStore, items);
        },
        clear: async () => {
          Object.keys(storageStore).forEach((k) => delete storageStore[k]);
        },
      },
    },
    runtime: {
      sendMessage: async () => ({ success: true }),
      onMessage: {
        addListener: () => {},
        removeListener: () => {},
      },
      onInstalled: {
        addListener: () => {},
      },
    },
    tabs: {
      query: async () => [{ id: 1, url: 'https://news.example.com', title: 'Example' }],
      sendMessage: async () => ({ success: true }),
      reload: async () => {},
      onActivated: {
        addListener: () => {},
      },
    },
    action: {
      setBadgeText: async () => {},
      setBadgeBackgroundColor: async () => {},
      setTitle: async () => {},
    },
    permissions: {
      contains: async () => true,
      request: async () => true,
    },
  };

  (globalThis as unknown as { chrome: typeof mockChrome }).chrome = mockChrome;
  return mockChrome;
}
