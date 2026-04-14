import type { OutbrainWidgetProps } from "./types";
/**
 * Generates the HTML content for the Outbrain Bridge widget.
 *
 * The Outbrain "Bridge" approach works by loading a WebView that:
 * 1. Initializes the Outbrain SDK JS
 * 2. Renders the SmartLogic/SmartFeed widget
 * 3. Communicates back to React Native via postMessage
 *
 * This is the same approach used by Outbrain's official native SDKs
 * (SFWebViewWidget on Android, SFWidget on iOS) — they all load a
 * WebView internally. We just do it directly from React Native.
 */
export declare function buildWidgetHtml(props: OutbrainWidgetProps): string;
