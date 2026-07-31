import React from 'react';
import {
  Shield,
  ShieldAlert,
  Settings,
  RefreshCw,
  EyeOff,
  Zap,
  HardDrive,
  Clock,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { Card } from '../components/Card';
import { Switch } from '../components/Switch';
import { Badge } from '../components/Badge';
import { MetricCard } from '../components/MetricCard';
import { Button } from '../components/Button';
import { useExtensionStorage } from '../hooks/useExtensionStorage';
import { useCurrentTab } from '../hooks/useCurrentTab';
import { formatNumber, formatBytes, formatTimeSaved } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const { settings, stats, toggleProtection } = useExtensionStorage();
  const { tabStatus, toggleWhitelist } = useCurrentTab();

  const openOptionsPage = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('../pages/options/index.html', '_blank');
    }
  };

  const isProtected = settings.protectionEnabled && (!tabStatus || !tabStatus.isWhitelisted);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-1 border-b border-warm-200/60 dark:border-warm-800/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-terracotta-600 text-white shadow-terracotta-glow">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-warm-900 dark:text-warm-50 leading-none">
              JOGuard
            </h1>
            <p className="text-[11px] font-medium text-warm-500 dark:text-warm-400 mt-0.5">
              Protect Your Browsing. Quietly.
            </p>
          </div>
        </div>

        <button
          onClick={openOptionsPage}
          className="p-2 rounded-xl text-warm-500 hover:text-warm-900 dark:hover:text-warm-100 hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors"
          title="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Large Protection Status Card */}
      <Card className="relative overflow-hidden border-terracotta-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-2xl transition-colors duration-300 ${
                settings.protectionEnabled
                  ? 'bg-terracotta-100 dark:bg-terracotta-900/40 text-terracotta-600 dark:text-terracotta-400'
                  : 'bg-warm-200 dark:bg-warm-800 text-warm-500'
              }`}
            >
              {settings.protectionEnabled ? (
                <Shield className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-warm-900 dark:text-warm-50">
                  {settings.protectionEnabled ? 'Protection Active' : 'Protection Paused'}
                </h2>
                <Badge
                  variant={settings.protectionEnabled ? 'terracotta' : 'neutral'}
                  size="sm"
                >
                  {settings.protectionEnabled ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <p className="text-xs text-warm-500 dark:text-warm-400 mt-0.5">
                {settings.protectionEnabled
                  ? 'Blocking ads, trackers & dynamic overlays'
                  : 'JOGuard features temporarily disabled'}
              </p>
            </div>
          </div>

          <Switch
            checked={settings.protectionEnabled}
            onChange={toggleProtection}
            size="md"
          />
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <MetricCard
          label="Ads Blocked"
          value={formatNumber(stats.adsBlockedTotal)}
          subtitle="Cosmetic & network"
          icon={<EyeOff className="w-4 h-4" />}
        />
        <MetricCard
          label="Trackers Blocked"
          value={formatNumber(stats.trackersBlockedTotal)}
          subtitle="Telemetry & scripts"
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricCard
          label="Data Saved"
          value={formatBytes(stats.bandwidthSavedBytes)}
          subtitle="Bandwidth saved"
          icon={<HardDrive className="w-4 h-4" />}
        />
        <MetricCard
          label="Time Saved"
          value={formatTimeSaved(stats.estimatedTimeSavedMs)}
          subtitle="Est. load time saved"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Current Website Card */}
      {tabStatus && tabStatus.domain && (
        <Card padding="sm" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <Globe className="w-3.5 h-3.5 text-warm-400 shrink-0" />
              <span className="text-xs font-semibold text-warm-800 dark:text-warm-200 truncate">
                {tabStatus.domain}
              </span>
            </div>

            <Badge
              variant={
                tabStatus.isWhitelisted
                  ? 'warning'
                  : isProtected
                  ? 'success'
                  : 'neutral'
              }
              size="sm"
            >
              {tabStatus.isWhitelisted
                ? 'Whitelisted'
                : isProtected
                ? 'Protected'
                : 'System Page'}
            </Badge>
          </div>

          {!tabStatus.isInternal && (
            <div className="flex items-center justify-between pt-1 border-t border-warm-200/50 dark:border-warm-800/50">
              <span className="text-[11px] text-warm-500">Whitelist this domain</span>
              <Button
                variant={tabStatus.isWhitelisted ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleWhitelist}
              >
                {tabStatus.isWhitelisted ? 'Remove Whitelist' : 'Whitelist Site'}
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Quick Action Footer */}
      <div className="pt-1 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => window.location.reload()}
        >
          Refresh Stats
        </Button>

        <Button
          variant="secondary"
          size="sm"
          icon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={openOptionsPage}
        >
          Full Settings
        </Button>
      </div>
    </div>
  );
};
