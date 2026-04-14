"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutbrainWidget = OutbrainWidget;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const htmlBuilder_1 = require("./htmlBuilder");
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
function OutbrainWidget(props) {
    const { handler, style, darkMode = false } = props, widgetProps = __rest(props, ["handler", "style", "darkMode"]);
    const webViewRef = (0, react_1.useRef)(null);
    const [widgetHeight, setWidgetHeight] = (0, react_1.useState)(1);
    // Generate HTML only when props change
    const html = (0, react_1.useMemo)(() => (0, htmlBuilder_1.buildWidgetHtml)(Object.assign(Object.assign({}, widgetProps), { darkMode, handler })), [
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
    const onMessage = (0, react_1.useCallback)((event) => {
        var _a, _b;
        try {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.type) {
                case "heightChange": {
                    const newHeight = Math.ceil(message.data.height);
                    if (newHeight > 0 && newHeight !== widgetHeight) {
                        setWidgetHeight(newHeight);
                        (_a = handler === null || handler === void 0 ? void 0 : handler.onHeightChange) === null || _a === void 0 ? void 0 : _a.call(handler, newHeight);
                    }
                    break;
                }
                case "recClick": {
                    const url = message.data.url;
                    if (handler === null || handler === void 0 ? void 0 : handler.onRecClick) {
                        handler.onRecClick(url);
                    }
                    else {
                        // Default: open in system browser
                        react_native_1.Linking.openURL(url).catch((err) => console.warn("OutbrainWidget: Failed to open URL", err));
                    }
                    break;
                }
                case "organicClick": {
                    const url = message.data.url;
                    if (handler === null || handler === void 0 ? void 0 : handler.onOrganicClick) {
                        handler.onOrganicClick(url);
                    }
                    else {
                        // Default: open in system browser
                        react_native_1.Linking.openURL(url).catch((err) => console.warn("OutbrainWidget: Failed to open URL", err));
                    }
                    break;
                }
                case "widgetEvent": {
                    (_b = handler === null || handler === void 0 ? void 0 : handler.onWidgetEvent) === null || _b === void 0 ? void 0 : _b.call(handler, message.data.eventName, message.data.data || {});
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
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: [containerStyle, style], children: (0, jsx_runtime_1.jsx)(react_native_webview_1.WebView, { ref: webViewRef, source: { html, baseUrl: "https://widgets.outbrain.com" }, style: styles.webview, onMessage: onMessage, 
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
const styles = react_native_1.StyleSheet.create({
    webview: {
        flex: 1,
        width: "100%",
        backgroundColor: "transparent",
        opacity: 0.99, // Android WebView rendering fix
    },
});
