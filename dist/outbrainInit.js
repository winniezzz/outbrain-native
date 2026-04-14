"use strict";
/**
 * Outbrain SDK initialization helpers.
 *
 * Note: The WebView-based bridge approach does NOT require calling
 * Outbrain.register() natively — the JS widget handles its own
 * initialization via the installation key / partner key passed as
 * data attributes.
 *
 * These functions are provided for apps that also use the native
 * Outbrain SDK directly (e.g., in native screens alongside RN screens).
 * For pure React Native usage, you don't need to call any of these.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNativeInitRequired = isNativeInitRequired;
exports.setTestMode = setTestMode;
exports.isTestMode = isTestMode;
exports.getVersionInfo = getVersionInfo;
const react_native_1 = require("react-native");
let _initialized = false;
let _testMode = false;
/**
 * Check if the native SDK needs separate initialization.
 *
 * With the WebView bridge approach used by this plugin, the Outbrain
 * widget JS script handles its own setup. The native SDK (obsdk)
 * is included as a dependency primarily for:
 *
 * 1. Viewability tracking (native SDK provides better accuracy)
 * 2. Charles Proxy support (network security config)
 * 3. Future native-first features
 *
 * For most use cases, you do NOT need to call initializeOutbrain().
 * The <OutbrainWidget /> component handles everything.
 */
function isNativeInitRequired() {
    return false; // WebView bridge is self-contained
}
/**
 * Enable/disable test mode globally.
 * This affects the testMode prop default for all OutbrainWidget instances.
 */
function setTestMode(enabled) {
    _testMode = enabled;
}
/**
 * Get current test mode state
 */
function isTestMode() {
    return _testMode;
}
/**
 * Get the Outbrain SDK version info
 */
function getVersionInfo() {
    return {
        pluginVersion: "1.0.0",
        bridgeType: "webview",
        platform: react_native_1.Platform.OS,
        newArchitecture: true,
        expoSdkMin: 55,
    };
}
