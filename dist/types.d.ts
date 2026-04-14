/**
 * Types for Outbrain Widget events and props
 */
export interface OutbrainWidgetHandler {
    /** Called when the widget height changes (for dynamic sizing) */
    onHeightChange?: (newHeight: number) => void;
    /** Called when a paid recommendation is clicked */
    onRecClick?: (url: string) => void;
    /** Called when an organic (publisher's own content) recommendation is clicked */
    onOrganicClick?: (url: string) => void;
    /** Called for generic widget events */
    onWidgetEvent?: (eventName: string, data: Record<string, any>) => void;
}
export interface OutbrainWidgetProps {
    /** The widget ID provided by Outbrain */
    widgetId: string;
    /** Zero-based index for multiple widgets on same page */
    widgetIndex?: number;
    /** The article/content URL for recommendation context */
    articleUrl: string;
    /** Partner/installation key from Outbrain account manager */
    partnerKey: string;
    /** Optional external ID for reporting */
    extId?: string;
    /** Optional secondary external ID for reporting */
    extSecondaryId?: string;
    /** Optional publisher impression ID (session/click identifier) */
    pubImpId?: string;
    /** Enable dark mode for the widget */
    darkMode?: boolean;
    /** Enable test mode (disables billing/reporting) */
    testMode?: boolean;
    /** Simulate location in test mode (2-letter country code) */
    testLocation?: string;
    /** Event handler object */
    handler?: OutbrainWidgetHandler;
    /** Custom style for the container */
    style?: any;
    /** GDPR consent string v1 */
    consentV1?: string;
    /** GDPR consent string v2 (TCF) */
    consentV2?: string;
    /** CCPA consent string */
    ccpaString?: string;
    /** Custom user ID (e.g. IDFA if user consented) */
    userId?: string;
    /** Use Platforms API with portal URL */
    usePortalUrl?: boolean;
    /** Use Platforms API with bundle URL */
    useBundleUrl?: boolean;
    /** Use Platforms API with content URL */
    useContentUrl?: boolean;
    /** Language code for Platforms API (ISO 639-1) */
    lang?: string;
    /** Publisher sub-ID for Platforms API */
    psub?: string;
}
