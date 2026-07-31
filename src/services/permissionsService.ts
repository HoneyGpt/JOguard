/**
 * Permissions Service
 * 
 * Inspects and requests optional extension permissions safely.
 */
class PermissionsService {
  async hasPermission(permission: string): Promise<boolean> {
    if (typeof chrome === 'undefined' || !chrome.permissions?.contains) {
      return true;
    }

    try {
      return await chrome.permissions.contains({ permissions: [permission] });
    } catch {
      return false;
    }
  }

  async requestPermission(permission: string): Promise<boolean> {
    if (typeof chrome === 'undefined' || !chrome.permissions?.request) {
      return true;
    }

    try {
      return await chrome.permissions.request({ permissions: [permission] });
    } catch {
      return false;
    }
  }
}

export const permissionsService = new PermissionsService();
