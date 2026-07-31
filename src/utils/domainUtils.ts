/**
 * High-efficiency domain parsing and URL validation utilities.
 */

/**
 * Extracts clean domain hostname from a full URL string.
 * Example: 'https://www.news.example.com/article?id=123' -> 'news.example.com'
 */
export function extractDomain(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    let hostname = parsed.hostname.toLowerCase();
    
    // Strip leading 'www.' for clean matching
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }
    
    return hostname;
  } catch {
    return '';
  }
}

/**
 * Checks whether a URL is a internal browser system page or extension page.
 * Extensions must never block system pages like chrome://extensions.
 */
export function isInternalUrl(url: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase().trim();
  return (
    lower.startsWith('chrome://') ||
    lower.startsWith('chrome-extension://') ||
    lower.startsWith('edge://') ||
    lower.startsWith('about:') ||
    lower.startsWith('devtools://') ||
    lower.startsWith('view-source:')
  );
}

/**
 * Checks if a candidate domain matches a whitelisted domain pattern.
 * Supports exact domain match and subdomain matching.
 * Example: 'news.example.com' matches whitelist item 'example.com'
 */
export function matchesDomain(candidateDomain: string, whitelistDomain: string): boolean {
  if (!candidateDomain || !whitelistDomain) return false;
  
  const cand = candidateDomain.toLowerCase().trim();
  const target = whitelistDomain.toLowerCase().trim();
  
  if (cand === target) return true;
  return cand.endsWith('.' + target);
}
