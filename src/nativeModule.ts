import { requireNativeModule } from "expo-modules-core";

/**
 * Native Outbrain module bridge.
 *
 * Exposes Outbrain.register(), setTestMode(), testLocation()
 * from the native Android/iOS SDKs via Expo Modules API.
 */
function getExpoOutbrain() {
  return requireNativeModule("ExpoOutbrain");
}

/**
 * Register the app with Outbrain.
 * Must be called once at app startup, before rendering any OutbrainWidget.
 *
 * @param partnerKey - Your installation/partner key from Outbrain
 * @returns Promise<boolean> - true if registration succeeded
 *
 * @example
 * ```ts
 * import { registerOutbrain } from 'expo-outbrain-widget';
 *
 * // In your App.tsx or _layout.tsx
 * await registerOutbrain('YOUR_PARTNER_KEY');
 * ```
 */
export async function registerOutbrain(partnerKey: string): Promise<boolean> {
  return await getExpoOutbrain().register(partnerKey);
}

/**
 * Enable/disable test mode.
 * In test mode, Outbrain won't count impressions or bill for clicks.
 * Call this AFTER registerOutbrain().
 *
 * @param enabled - true to enable test mode
 */
export function setTestMode(enabled: boolean): void {
  getExpoOutbrain().setTestMode(enabled);
}

/**
 * Simulate a geographic location (test mode only).
 * Useful for testing recommendations for different regions.
 *
 * @param location - 2-letter country code (e.g. "us", "gb", "fr")
 */
export function setTestLocation(location: string): void {
  getExpoOutbrain().testLocation(location);
}

/**
 * Enable Display Ads test mode (SDK 5.0.0+).
 * Adds an extra card on top of the feed with test action buttons.
 *
 * @param enabled - true to enable display ads test mode
 */
export function setDisplayTest(enabled: boolean): void {
  getExpoOutbrain().setDisplayTest(enabled);
}
