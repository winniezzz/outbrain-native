// Component
export { OutbrainWidget } from "./OutbrainWidget";

// Types
export type { OutbrainWidgetProps, OutbrainWidgetHandler } from "./types";

// Native SDK bridge
export {
  registerOutbrain,
  setTestMode,
  setTestLocation,
  setDisplayTest,
} from "./nativeModule";

// Utils
export { getVersionInfo } from "./outbrainInit";
