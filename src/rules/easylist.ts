import { BlockRule } from '../types';

/**
 * EasyList Core Ad Blocking Rules
 */
export const EASYLIST_RULES: BlockRule[] = [
  { id: 'el-1', type: 'network', urlPattern: 'googlesyndication.com', action: 'block', enabled: true },
  { id: 'el-2', type: 'network', urlPattern: 'doubleclick.net', action: 'block', enabled: true },
  { id: 'el-3', type: 'network', urlPattern: 'adform.net', action: 'block', enabled: true },
  { id: 'el-4', type: 'network', urlPattern: 'rubiconproject.com', action: 'block', enabled: true },
  { id: 'el-5', type: 'network', urlPattern: 'pubmatic.com', action: 'block', enabled: true },
  { id: 'el-6', type: 'network', urlPattern: 'openx.net', action: 'block', enabled: true },
  { id: 'el-7', type: 'network', urlPattern: 'appnexus.com', action: 'block', enabled: true },
  { id: 'el-8', type: 'network', urlPattern: 'adnxs.com', action: 'block', enabled: true },
  { id: 'el-9', type: 'network', urlPattern: 'smartadserver.com', action: 'block', enabled: true },
  { id: 'el-10', type: 'network', urlPattern: 'advertising.com', action: 'block', enabled: true },
];
