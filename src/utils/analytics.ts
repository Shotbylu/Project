export interface AnalyticsPayload {
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const trackAnalyticsEvent = (eventName: string, payload: AnalyticsPayload = {}): void => {
  if (typeof window === 'undefined') return;

  const detail = { event: eventName, payload };

  try {
    window.dispatchEvent(new CustomEvent('analytics:track', { detail }));
  } catch {
    // Swallow errors from CustomEvent in unsupported environments.
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload });
  }
};

export default trackAnalyticsEvent;
