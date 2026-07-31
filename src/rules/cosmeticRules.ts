/**
 * Modular Cosmetic Filtering Rule Definitions
 * 
 * Defines CSS selectors targeting ad banners, sponsored containers,
 * sticky video overlay ads, native sponsored cards, and promo popups.
 */

export const COSMETIC_AD_SELECTORS: string[] = [
  // Standard Ad Unit IDs and Classes
  '#dfp-ad-container',
  '.ad-container',
  '.ad-wrapper',
  '.ad-banner',
  '.ad-slot',
  '.ad-unit',
  '.ad-placement',
  '.ad_box',
  '.ad_sidebar',
  '.sponsored-post',
  '.sponsored-card',
  '.sponsored-content',
  '.promoted-item',
  '.promoted-content',

  // Common Ad Network Selectors & Attributes
  '[id^="div-gpt-ad"]',
  '[id^="google_ads_iframe"]',
  '[id^="taboola-"]',
  '[id^="outbrain-"]',
  '[aria-label="advertisement"]',
  '[aria-label="Advertisement"]',
  '[aria-label="Sponsored"]',
  '[data-ad-client]',
  '[data-ad-slot]',
  '[data-adunit]',
  '[data-ad-spec]',

  // Sticky Footers & Video Overlay Ad Popups
  '.sticky-ad-container',
  '.floating-ad-unit',
  '.video-ad-overlay',
  '.outstream-ad-box',
  '.interstitial-ad-backdrop',
];

export const COSMETIC_CSS_HIDE_RULE = `
${COSMETIC_AD_SELECTORS.join(',\n')} {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}
`;
