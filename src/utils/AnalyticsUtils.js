import ReactGa from "react-ga";

/**
 * Initializes Google Analytics.
 */
export const initAnalytics = () => {
    ReactGa.initialize(process.env.ANALYTICS_ID, {
        gaOptions: {
            siteSpeedSampleRate: 100,
        },
    });
    ReactGa.pageview(window.location.pathname);
};

/**
 * Measures the time taken by func and sends it to Google Analytics.
 *
 * @param func Function whose time will be measured. Func shouldn't return if there's an error, it must throw it.
 * @param action Type of action being measured, from {@link TIMED_ACTIONS}.
 * @param label Optional label to describe the action.
 * @param args The func's arguments.
 */
export const measureTime = (action = TIMED_ACTIONS.UNKNOWN, func, label) => async (...args) => {
    const t0 = performance.now();
    const result = await func(...args);
    const t1 = performance.now();

    recordTime(action, t0, t1, label);
    return result;
};

/**
 * Sends the time passed as an argument to Google Analytics.
 *
 * @param action Type of action being measured, from {@link TIMED_ACTIONS}.
 * @param t0 Timestamp before the action.
 * @param t1 Timestamp after the action.
 * @param label Optional label to describe the action.
 */
export const recordTime = (action = TIMED_ACTIONS.UNKNOWN, t0, t1, label) => {
    ReactGa.timing({
        ...action,
        value: t1 - t0,
        label,
    });
};

/** Creates a new event.
 *
 * @param event Type of event, from {@link EVENT_TYPES}.
 */
export const createEvent = (event = EVENT_TYPES.OTHER) => {
    ReactGa.event(event);
};

export const EVENT_TYPES = Object.freeze({
    ERROR: (action, type, status = 500) => ({
        category: "Error",
        action: `${action} Error`,
        label: `ERROR: ${type}`,
        value: status,
    }),
    SUCCESS: (action, label) => ({
        category: "Successful Response",
        action,
        label,
    }),
    OTHER: {
        category: "Other",
        action: "Another type of event",
    },
});

export const TIMED_ACTIONS = Object.freeze({
    OFFER_CREATE: {
        category: "Offer",
        variable: "Create Offer",
    },
    OFFER_SEARCH: {
        category: "Offer",
        variable: "Search Offers",
    },
    OFFER_HIDE: {
        category: "Offer",
        variable: "Hide Offer",
    },
    OFFER_DISABLE: {
        category: "Offer",
        variable: "Disable Offer",
    },
    OFFER_ENABLE: {
        category: "Offer",
        variable: "Enable Offer",
    },
    COMPLETE_REGISTRATION: {
        category: "Registration",
        variable: "Complete Registration",
    },
    APPLICATION_SEARCH: {
        category: "Application",
        variable: "Search Applications",
    },
    APPLICATION_APPROVE: {
        category: "Application",
        variable: "Approve Application",
    },
    APPLICATION_REJECT: {
        category: "Application",
        variable: "Reject Application",
    },
    APPLICATION_SUBMIT: {
        category: "Application",
        variable: "Submit Application",
    },
    COMPANY_OFFERS_FETCH: {
        category: "Company Offers",
        variable: "Fetch Company Offers",
    },
    OTHER: {
        category: "Other",
        variable: "Other",
    },
    UNKNOWN: {
        category: "Unknown",
        variable: "Unknown",
    },
});
