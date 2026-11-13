/**
 * Lead Tracking & Marketing Attribution Utility
 * Captures UTM parameters, referrer, landing pages, session ID, and device metadata.
 * Persists both first-touch and latest-touch attribution across navigation.
 */

export interface TouchAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPage?: string;
  timestamp?: string;
}

export interface LeadTrackingData {
  firstTouch: TouchAttribution;
  latestTouch: TouchAttribution;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referrer: string;
  landingPage: string;
  submissionPage: string;
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  userAgent: string;
}

const FIRST_TOUCH_STORAGE_KEY = 'zvisory_first_touch';
const LATEST_TOUCH_STORAGE_KEY = 'zvisory_latest_touch';
const SESSION_ID_STORAGE_KEY = 'zvisory_session_id';

/**
 * Generates or retrieves a unique session ID for the visitor.
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let sessionId = window.sessionStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (!sessionId) {
      sessionId =
        'zs_' +
        Date.now().toString(36) +
        '_' +
        Math.random().toString(36).substring(2, 9);
      window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'fallback_session';
  }
}

/**
 * Detects device category and browser from client context.
 */
function detectClientEnvironment(): {
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  userAgent: string;
} {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { deviceType: 'unknown', browser: 'unknown', userAgent: '' };
  }

  const ua = navigator.userAgent || '';
  const uaLower = ua.toLowerCase();

  let deviceType: 'desktop' | 'mobile' | 'tablet' | 'unknown' = 'desktop';
  if (/mobile|android|iphone|ipod/.test(uaLower)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad/.test(uaLower)) {
    deviceType = 'tablet';
  }

  let browser = 'Unknown';
  if (uaLower.includes('chrome') && !uaLower.includes('edg')) browser = 'Chrome';
  else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'Safari';
  else if (uaLower.includes('firefox')) browser = 'Firefox';
  else if (uaLower.includes('edg')) browser = 'Edge';

  return { deviceType, browser, userAgent: ua };
}

/**
 * Initializes or updates marketing attribution on page load.
 * Call this early or on layout mount.
 */
export function recordPageAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || '';
    const utmMedium = urlParams.get('utm_medium') || '';
    const utmCampaign = urlParams.get('utm_campaign') || '';
    const utmTerm = urlParams.get('utm_term') || '';
    const utmContent = urlParams.get('utm_content') || '';
    const referrer = document.referrer || '';
    const currentUrl = window.location.href;

    const hasNewUtms = Boolean(utmSource || utmCampaign || utmMedium);

    // 1. First Touch Attribution (persisted permanently in localStorage)
    const existingFirstTouchRaw = window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (!existingFirstTouchRaw) {
      const firstTouch: TouchAttribution = {
        utmSource: utmSource || (referrer ? 'referral' : 'direct'),
        utmMedium: utmMedium || (referrer ? 'referral' : 'none'),
        utmCampaign: utmCampaign || 'none',
        utmTerm,
        utmContent,
        referrer,
        landingPage: currentUrl,
        timestamp: new Date().toISOString(),
      };
      window.localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(firstTouch));
    }

    // 2. Latest Touch Attribution (updates if new UTM campaign or first visit in session)
    const existingLatestTouchRaw = window.sessionStorage.getItem(LATEST_TOUCH_STORAGE_KEY);
    if (!existingLatestTouchRaw || hasNewUtms) {
      const latestTouch: TouchAttribution = {
        utmSource: utmSource || (referrer ? 'referral' : 'direct'),
        utmMedium: utmMedium || (referrer ? 'referral' : 'none'),
        utmCampaign: utmCampaign || 'none',
        utmTerm,
        utmContent,
        referrer,
        landingPage: currentUrl,
        timestamp: new Date().toISOString(),
      };
      window.sessionStorage.setItem(LATEST_TOUCH_STORAGE_KEY, JSON.stringify(latestTouch));
    }
  } catch {
    // Fail silently in restricted iframe or private browsing modes
  }
}

/**
 * Compiles complete tracking and attribution payload for lead submission.
 */
export function getLeadTrackingPayload(): LeadTrackingData {
  if (typeof window === 'undefined') {
    return {
      firstTouch: {},
      latestTouch: {},
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      referrer: '',
      landingPage: '',
      submissionPage: '',
      sessionId: '',
      deviceType: 'unknown',
      browser: 'unknown',
      userAgent: '',
    };
  }

  // Ensure touch attribution is initialized
  recordPageAttribution();

  let firstTouch: TouchAttribution = {};
  let latestTouch: TouchAttribution = {};

  try {
    const ft = window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (ft) firstTouch = JSON.parse(ft);
  } catch {
    // ignore
  }

  try {
    const lt = window.sessionStorage.getItem(LATEST_TOUCH_STORAGE_KEY);
    if (lt) latestTouch = JSON.parse(lt);
  } catch {
    // ignore
  }

  const { deviceType, browser, userAgent } = detectClientEnvironment();
  const sessionId = getOrCreateSessionId();
  const submissionPage = window.location.href;

  return {
    firstTouch,
    latestTouch,
    utmSource: latestTouch.utmSource || firstTouch.utmSource || 'direct',
    utmMedium: latestTouch.utmMedium || firstTouch.utmMedium || 'none',
    utmCampaign: latestTouch.utmCampaign || firstTouch.utmCampaign || 'none',
    utmTerm: latestTouch.utmTerm || firstTouch.utmTerm || '',
    utmContent: latestTouch.utmContent || firstTouch.utmContent || '',
    referrer: latestTouch.referrer || firstTouch.referrer || document.referrer || '',
    landingPage: firstTouch.landingPage || latestTouch.landingPage || submissionPage,
    submissionPage,
    sessionId,
    deviceType,
    browser,
    userAgent,
  };
}

