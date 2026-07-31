import { useState, useEffect, useCallback } from 'react';
import { TabStatus } from '../types';
import { messagingService } from '../services/messagingService';

export function useCurrentTab() {
  const [tabStatus, setTabStatus] = useState<TabStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTabStatus = useCallback(async () => {
    setLoading(true);
    const res = await messagingService.sendMessage<TabStatus>('GET_CURRENT_TAB_STATUS');
    if (res.success && res.data) {
      setTabStatus(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTabStatus();
  }, [fetchTabStatus]);

  const toggleWhitelist = async () => {
    if (!tabStatus || !tabStatus.domain) return;

    if (tabStatus.isWhitelisted) {
      const res = await messagingService.sendMessage('REMOVE_WHITELIST', { domain: tabStatus.domain });
      if (res.success) {
        setTabStatus((prev) => (prev ? { ...prev, isWhitelisted: false, isProtected: true } : null));
      }
    } else {
      const res = await messagingService.sendMessage('ADD_WHITELIST', { domain: tabStatus.domain });
      if (res.success) {
        setTabStatus((prev) => (prev ? { ...prev, isWhitelisted: true, isProtected: false } : null));
      }
    }
  };

  return {
    tabStatus,
    loading,
    refreshTab: fetchTabStatus,
    toggleWhitelist,
  };
}
