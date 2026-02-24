import { useEffect } from 'react';
import { GA_MEASUREMENT_ID, ANALYTICS_ENABLED } from '../utils/env';

/**
 * Lightweight Google Analytics (gtag.js) integration.
 * Only loads when VITE_ENABLE_ANALYTICS=true AND a measurement ID is set.
 */
export function useAnalytics() {
  useEffect(() => {
    if (!ANALYTICS_ENABLED || !GA_MEASUREMENT_ID) return;

    // Avoid double-loading
    if (document.querySelector(`script[src*="googletagmanager"]`)) return;

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true,
    });
  }, []);
}

/**
 * Track a custom event (call from anywhere after analytics init).
 */
export function trackEvent(action, category = 'engagement', label = '', value = 0) {
  if (!ANALYTICS_ENABLED || typeof window.gtag !== 'function') return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  });
}
