import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState } from "react";
import { Linking, StyleSheet, View, } from "react-native";
import { WebView } from "react-native-webview";
import { buildWidgetHtml } from "./htmlBuilder";
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
export function OutbrainWidget(props) {
    const { handler, style, darkMode = false, ...widgetProps } = props;
    const webViewRef = useRef(null);
    const [widgetHeight, setWidgetHeight] = useState(1);
    // Generate HTML only when props change
    const html = useMemo(() => buildWidgetHtml({ ...widgetProps, darkMode, handler }), [
        widgetProps.widgetId,
        widgetProps.widgetIndex,
        widgetProps.articleUrl,
        widgetProps.partnerKey,
        widgetProps.extId,
        widgetProps.extSecondaryId,
        widgetProps.pubImpId,
        widgetProps.testMode,
        widgetProps.testLocation,
        widgetProps.consentV1,
        widgetProps.consentV2,
        widgetProps.ccpaString,
        widgetProps.userId,
        widgetProps.usePortalUrl,
        widgetProps.useBundleUrl,
        widgetProps.useContentUrl,
        widgetProps.lang,
        widgetProps.psub,
        darkMode,
    ]);
    /**
     * Handle messages from the WebView bridge
     */
    const onMessage = useCallback((event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.type) {
                case "heightChange": {
                    const newHeight = Math.ceil(message.data.height);
                    if (newHeight > 0 && newHeight !== widgetHeight) {
                        setWidgetHeight(newHeight);
                        handler?.onHeightChange?.(newHeight);
                    }
                    break;
                }
                case "recClick": {
                    const url = message.data.url;
                    if (handler?.onRecClick) {
                        handler.onRecClick(url);
                    }
                    else {
                        // Default: open in system browser
                        Linking.openURL(url).catch((err) => console.warn("OutbrainWidget: Failed to open URL", err));
                    }
                    break;
                }
                case "organicClick": {
                    const url = message.data.url;
                    if (handler?.onOrganicClick) {
                        handler.onOrganicClick(url);
                    }
                    else {
                        // Default: open in system browser
                        Linking.openURL(url).catch((err) => console.warn("OutbrainWidget: Failed to open URL", err));
                    }
                    break;
                }
                case "widgetEvent": {
                    handler?.onWidgetEvent?.(message.data.eventName, message.data.data || {});
                    break;
                }
                default:
                    break;
            }
        }
        catch (e) {
            // Invalid JSON message, ignore
        }
    }, [handler, widgetHeight]);
    const containerStyle = {
        width: "100%",
        height: widgetHeight,
        overflow: "hidden",
        backgroundColor: darkMode ? "#1a1a1a" : "#ffffff",
    };
    return (_jsx(View, { style: [containerStyle, style], children: _jsx(WebView, { ref: webViewRef, source: { html, baseUrl: "https://widgets.outbrain.com" }, style: styles.webview, onMessage: onMessage, 
            // Performance & compatibility
            javaScriptEnabled: true, domStorageEnabled: true, startInLoadingState: false, originWhitelist: ["*"], mixedContentMode: "compatibility", allowsInlineMediaPlayback: true, mediaPlaybackRequiresUserAction: false, 
            // Disable scrolling - parent ScrollView handles it
            scrollEnabled: false, nestedScrollEnabled: false, showsHorizontalScrollIndicator: false, showsVerticalScrollIndicator: false, bounces: false, overScrollMode: "never", 
            // Security
            allowsFullscreenVideo: false, 
            // Android-specific
            androidLayerType: "hardware", 
            // Allow Outbrain to open links
            setSupportMultipleWindows: false, 
            // Allow third-party cookies for Outbrain tracking
            thirdPartyCookiesEnabled: true, sharedCookiesEnabled: true, 
            // Disable caching issues
            cacheEnabled: true, 
            // User agent - append Outbrain identifier
            applicationNameForUserAgent: "OutbrainReactNativeSDK/1.0.0" }) }));
}
const styles = StyleSheet.create({
    webview: {
        flex: 1,
        width: "100%",
        backgroundColor: "transparent",
        opacity: 0.99, // Android WebView rendering fix
    },
});
