import { useState, useEffect, useCallback } from 'react';
import { ExtensionSettings, BlockStats, ActivityLog } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_STATS } from '../constants/storageKeys';
import { messagingService } from '../services/messagingService';

export function useExtensionStorage() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<BlockStats>(DEFAULT_STATS);
  const [logs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = useCallback(async () => {
    setLoading(true);

    const [settingsRes, statsRes] = await Promise.all([
      messagingService.sendMessage<ExtensionSettings>('GET_SETTINGS'),
      messagingService.sendMessage<BlockStats>('GET_STATS'),
    ]);

    if (settingsRes.success && settingsRes.data) {
      setSettings(settingsRes.data);
    }
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const toggleProtection = async () => {
    const res = await messagingService.sendMessage<ExtensionSettings>('TOGGLE_PROTECTION');
    if (res.success && res.data) {
      setSettings(res.data);
    }
  };

  const updateSettings = async (partial: Partial<ExtensionSettings>) => {
    const res = await messagingService.sendMessage<ExtensionSettings>('UPDATE_SETTINGS', partial);
    if (res.success && res.data) {
      setSettings(res.data);
    }
  };

  const resetStats = async () => {
    const res = await messagingService.sendMessage<BlockStats>('RESET_STATS');
    if (res.success && res.data) {
      setStats(res.data);
    }
  };

  return {
    settings,
    stats,
    logs,
    loading,
    refreshData,
    toggleProtection,
    updateSettings,
    resetStats,
  };
}
