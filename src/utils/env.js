/**
 * Environment variable helpers.
 * All VITE_ prefixed vars are available at build time via import.meta.env.
 */

/** Site URL (no trailing slash) */
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://your-domain.com';

/** Site title */
export const SITE_TITLE = import.meta.env.VITE_SITE_TITLE || 'Portfolio — Developer';

/** Site description for meta tags */
export const SITE_DESCRIPTION =
  import.meta.env.VITE_SITE_DESCRIPTION ||
  'Immersive developer portfolio powered by Three.js & React';

/** Google Analytics measurement ID — empty string disables GA */
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/** Whether analytics are enabled */
export const ANALYTICS_ENABLED =
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true' && !!GA_MEASUREMENT_ID;

/** Whether the dev performance overlay is shown */
export const PERF_OVERLAY_ENABLED = import.meta.env.VITE_ENABLE_PERFORMANCE_OVERLAY === 'true';

/** Contact email */
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || '';

/** Social links */
export const SOCIAL = {
  github: import.meta.env.VITE_GITHUB_URL || '',
  linkedin: import.meta.env.VITE_LINKEDIN_URL || '',
  twitter: import.meta.env.VITE_TWITTER_URL || '',
};

/** Current mode */
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;
