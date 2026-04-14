import type { OutbrainWidgetProps } from "./types";
/**
 * OutbrainWidget - Renders an Outbrain SmartFeed widget inside a WebView.
 *
 * Compatible with Expo SDK 55+ and React Native New Architecture.
 * Uses react-native-webview (Fabric-compatible) as the rendering engine.
 *
 * The widget communicates with React Native via postMessage bridge:
 * - Height changes → auto-resizes the container
 * - Click events → routed to handler callbacks
 * - Widget events → forwarded to onWidgetEvent handler
 *
 * @example
 * ```tsx
 * <OutbrainWidget
 *   widgetId="MB_1"
 *   widgetIndex={0}
 *   articleUrl="https://my-site.com/article"
 *   partnerKey="MY_PARTNER_KEY"
 *   handler={{
 *     onRecClick: (url) => openBrowser(url),
 *     onOrganicClick: (url) => navigateInApp(url),
 *   }}
 * />
 * ```
 */
export declare function OutbrainWidget(props: OutbrainWidgetProps): import("react/jsx-runtime").JSX.Element;
