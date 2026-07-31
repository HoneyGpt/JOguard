import React, { useState, useEffect } from 'react';
import {
  Shield,
  Sliders,
  Globe,
  BarChart3,
  Download,
  RotateCcw,
  Sparkles,
  Info,
  Moon,
  Sun,
  Laptop,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Switch } from '../../components/Switch';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useExtensionStorage } from '../../hooks/useExtensionStorage';
import { WhitelistItem } from '../../types';
import { messagingService } from '../../services/messagingService';
import { formatNumber, formatBytes, formatTimeSaved } from '../../utils/formatters';

type Tab = 'general' | 'whitelist' | 'stats' | 'roadmap';

const Options: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const { settings, stats, updateSettings, resetStats } = useExtensionStorage();
  const [whitelist, setWhitelist] = useState<WhitelistItem[]>([]);
  const [newDomainInput, setNewDomainInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    loadWhitelist();
  }, []);

  const loadWhitelist = async () => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const data = await chrome.storage.local.get('joguard_whitelist');
      setWhitelist((data.joguard_whitelist as WhitelistItem[]) || []);
    }
  };

  const handleAddWhitelist = async () => {
    if (!newDomainInput.trim()) return;
    const res = await messagingService.sendMessage<WhitelistItem[]>('ADD_WHITELIST', {
      domain: newDomainInput.trim(),
    });
    if (res.success && res.data) {
      setWhitelist(res.data);
      setNewDomainInput('');
      showStatus('Domain added to Whitelist');
    }
  };

  const handleRemoveWhitelist = async (domain: string) => {
    const res = await messagingService.sendMessage<WhitelistItem[]>('REMOVE_WHITELIST', { domain });
    if (res.success && res.data) {
      setWhitelist(res.data);
      showStatus('Domain removed from Whitelist');
    }
  };

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const exportSettingsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ settings, stats, whitelist }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'joguard-settings-backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showStatus('Settings exported successfully');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-warm-200 dark:border-warm-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-terracotta-600 text-white shadow-terracotta-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-warm-900 dark:text-warm-50">
              JOGuard Platform Dashboard
            </h1>
            <p className="text-sm text-warm-500 dark:text-warm-400 mt-0.5">
              Protect Your Browsing. Quietly. Manage security, privacy, rules & data.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-sm font-medium animate-fade-in border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            {statusMessage}
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'general'
                ? 'bg-terracotta-600 text-white shadow-terracotta-glow'
                : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            General Protection
          </button>

          <button
            onClick={() => setActiveTab('whitelist')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'whitelist'
                ? 'bg-terracotta-600 text-white shadow-terracotta-glow'
                : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            Whitelisted Sites
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'stats'
                ? 'bg-terracotta-600 text-white shadow-terracotta-glow'
                : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistics & Data
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'roadmap'
                ? 'bg-terracotta-600 text-white shadow-terracotta-glow'
                : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Future AI Roadmap
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* TAB 1: GENERAL PROTECTION */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="space-y-6">
                <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-terracotta-600" />
                  Core Protection Modules
                </h2>

                <div className="space-y-4 divide-y divide-warm-200/60 dark:divide-warm-800/60">
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="font-semibold text-warm-900 dark:text-warm-50">Master Protection</p>
                      <p className="text-xs text-warm-500">Global kill-switch for all JOGuard features</p>
                    </div>
                    <Switch
                      checked={settings.protectionEnabled}
                      onChange={(checked) => updateSettings({ protectionEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-semibold text-warm-900 dark:text-warm-50">Ad Blocking</p>
                      <p className="text-xs text-warm-500">Block network ad banners and video ads</p>
                    </div>
                    <Switch
                      checked={settings.adBlockingEnabled}
                      onChange={(checked) => updateSettings({ adBlockingEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-semibold text-warm-900 dark:text-warm-50">Tracker Blocking</p>
                      <p className="text-xs text-warm-500">Block telemetry scripts & analytics beacons</p>
                    </div>
                    <Switch
                      checked={settings.trackerBlockingEnabled}
                      onChange={(checked) => updateSettings({ trackerBlockingEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-semibold text-warm-900 dark:text-warm-50">Cosmetic Filtering</p>
                      <p className="text-xs text-warm-500">Inject element hiding rules to remove ad gaps</p>
                    </div>
                    <Switch
                      checked={settings.cosmeticFilteringEnabled}
                      onChange={(checked) => updateSettings({ cosmeticFilteringEnabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="font-semibold text-warm-900 dark:text-warm-50">Anti Anti-Adblock Bypass</p>
                      <p className="text-xs text-warm-500">Remove anti-adblock overlay backdrops & unlock page scroll</p>
                    </div>
                    <Switch
                      checked={settings.antiAntiAdblockEnabled}
                      onChange={(checked) => updateSettings({ antiAntiAdblockEnabled: checked })}
                    />
                  </div>
                </div>
              </Card>

              {/* Theme Settings Card */}
              <Card className="space-y-4">
                <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50">Appearance Theme</h2>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => updateSettings({ theme: 'light' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      settings.theme === 'light'
                        ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300'
                        : 'border-warm-200 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800'
                    }`}
                  >
                    <Sun className="w-4 h-4" /> Light
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'dark' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      settings.theme === 'dark'
                        ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300'
                        : 'border-warm-200 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800'
                    }`}
                  >
                    <Moon className="w-4 h-4" /> Dark
                  </button>

                  <button
                    onClick={() => updateSettings({ theme: 'system' })}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                      settings.theme === 'system'
                        ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-800 dark:bg-terracotta-950/40 dark:text-terracotta-300'
                        : 'border-warm-200 dark:border-warm-800 hover:bg-warm-100 dark:hover:bg-warm-800'
                    }`}
                  >
                    <Laptop className="w-4 h-4" /> System
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: WHITELIST MANAGEMENT */}
          {activeTab === 'whitelist' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="space-y-4">
                <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-terracotta-600" />
                  Whitelisted Domains
                </h2>
                <p className="text-xs text-warm-500">
                  Whitelisted websites bypass ad and tracker blocking rules.
                </p>

                {/* Add domain form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. example.com"
                    value={newDomainInput}
                    onChange={(e) => setNewDomainInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-warm-100 dark:bg-warm-800 border border-warm-200 dark:border-warm-700 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/30"
                  />
                  <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAddWhitelist}>
                    Add Site
                  </Button>
                </div>

                {/* Whitelist Domain List */}
                <div className="space-y-2 pt-2">
                  {whitelist.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-warm-300 dark:border-warm-700 rounded-2xl">
                      <Globe className="w-8 h-8 text-warm-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium text-warm-600 dark:text-warm-400">No Whitelisted Websites</p>
                      <p className="text-xs text-warm-400 mt-1">Add domains above or click Whitelist Site in Popup toolbar.</p>
                    </div>
                  ) : (
                    whitelist.map((item) => (
                      <div
                        key={item.domain}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-warm-100/70 dark:bg-warm-800/60 border border-warm-200/50 dark:border-warm-700/50"
                      >
                        <span className="font-semibold text-sm text-warm-800 dark:text-warm-200">{item.domain}</span>
                        <button
                          onClick={() => handleRemoveWhitelist(item.domain)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                          title="Remove domain"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: STATISTICS & DATA */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="space-y-6">
                <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-terracotta-600" />
                  Aggregate Protection Analytics
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800">
                    <p className="text-xs text-warm-500">Ads Blocked</p>
                    <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 mt-1">
                      {formatNumber(stats.adsBlockedTotal)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800">
                    <p className="text-xs text-warm-500">Trackers Blocked</p>
                    <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 mt-1">
                      {formatNumber(stats.trackersBlockedTotal)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800">
                    <p className="text-xs text-warm-500">Data Saved</p>
                    <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 mt-1">
                      {formatBytes(stats.bandwidthSavedBytes)}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800">
                    <p className="text-xs text-warm-500">Time Saved</p>
                    <p className="text-2xl font-bold text-warm-900 dark:text-warm-50 mt-1">
                      {formatTimeSaved(stats.estimatedTimeSavedMs)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-warm-200 dark:border-warm-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-warm-900 dark:text-warm-50 text-sm">Backup & Data Reset</p>
                    <p className="text-xs text-warm-500">Export platform settings or reset statistics counter</p>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={exportSettingsJSON}>
                      Export
                    </Button>

                    <Button variant="danger" size="sm" icon={<RotateCcw className="w-3.5 h-3.5" />} onClick={resetStats}>
                      Reset Stats
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 4: FUTURE ROADMAP & AI FEATURES */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fade-in">
              <Card className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-warm-900 dark:text-warm-50 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-terracotta-600" />
                    Future Features Architecture Roadmap
                  </h2>
                  <Badge variant="terracotta" size="sm">
                    Platform Expansion
                  </Badge>
                </div>

                <p className="text-xs text-warm-500">
                  JOGuard's modular Clean Architecture is prepared for seamless version upgrades:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800/60 border border-warm-200/50 dark:border-warm-700/50 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-terracotta-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-warm-900 dark:text-warm-50">Version 2 — Cookie Cleaner & Fingerprint Protection</h3>
                      <p className="text-xs text-warm-500 mt-0.5">Automated cookie cleanup, canvas fingerprint spoofing, and website privacy scoring.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800/60 border border-warm-200/50 dark:border-warm-700/50 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-warm-900 dark:text-warm-50">Version 3 — Phishing & Scam Detection</h3>
                      <p className="text-xs text-warm-500 mt-0.5">Real-time threat intelligence matching for malicious domain & scam protection.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-warm-100 dark:bg-warm-800/60 border border-warm-200/50 dark:border-warm-700/50 flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm text-warm-900 dark:text-warm-50">Version 4 — AI Privacy Advisor & Reading Mode</h3>
                      <p className="text-xs text-warm-500 mt-0.5">On-device AI privacy policy summarization, tracker explanation, and distraction-free reading mode.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;
