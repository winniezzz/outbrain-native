/**
 * Expo Config Plugin for Outbrain Widget
 *
 * Handles:
 * - Android: Adds Outbrain maven repository (cherry-repo.com)
 * - Android: Adds Outbrain SDK dependency
 * - Android: Handles APPLICATION_ID conflict with GMA
 * - iOS: Adds OutbrainSDK pod dependency
 * - Both: Network security config for Charles Proxy (debug)
 */

const {
  withProjectBuildGradle,
  withAppBuildGradle,
  withAndroidManifest,
  withDangerousMod,
  createRunOncePlugin,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const OUTBRAIN_MAVEN_URL = "https://cherry-repo.com/repository/releases/";
const OUTBRAIN_SDK_VERSION = "5.1.7";

/**
 * Add Outbrain maven repository to project-level build.gradle
 */
function withOutbrainMavenRepo(config) {
  return withProjectBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    if (contents.includes(OUTBRAIN_MAVEN_URL)) {
      return config;
    }

    // Add maven repo in allprojects.repositories block
    const mavenBlock = `        maven {\n            url "${OUTBRAIN_MAVEN_URL}"\n        }`;

    // Try to find allprojects { repositories { ... } }
    if (contents.includes("allprojects")) {
      config.modResults.contents = contents.replace(
        /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
        `$1\n${mavenBlock}`
      );
    } else {
      // If no allprojects block, add one at the end
      config.modResults.contents =
        contents +
        `\n\nallprojects {\n    repositories {\n${mavenBlock}\n    }\n}\n`;
    }

    return config;
  });
}

/**
 * Add Outbrain SDK dependency to app-level build.gradle
 */
function withOutbrainDependency(config, { sdkVersion = OUTBRAIN_SDK_VERSION } = {}) {
  return withAppBuildGradle(config, (config) => {
    const contents = config.modResults.contents;
    const dep = `com.outbrain.mobile:obsdk:${sdkVersion}`;

    if (contents.includes(dep)) {
      return config;
    }

    config.modResults.contents = contents.replace(
      /(dependencies\s*\{)/,
      `$1\n    implementation "${dep}"`
    );

    return config;
  });
}

/**
 * Add network security config for Charles Proxy support (debug builds)
 */
function withNetworkSecurityConfig(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const resXmlDir = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "xml"
      );

      if (!fs.existsSync(resXmlDir)) {
        fs.mkdirSync(resXmlDir, { recursive: true });
      }

      const networkSecurityPath = path.join(
        resXmlDir,
        "network_security_config.xml"
      );

      // Only write if not already present
      if (!fs.existsSync(networkSecurityPath)) {
        const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
  <debug-overrides>
    <trust-anchors>
      <!-- Trust user added CAs while debuggable only -->
      <certificates src="user" />
    </trust-anchors>
  </debug-overrides>
</network-security-config>
`;
        fs.writeFileSync(networkSecurityPath, xmlContent);
      }

      return config;
    },
  ]);
}

/**
 * Add networkSecurityConfig to AndroidManifest.xml
 */
function withManifestNetworkSecurity(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = manifest.manifest.application?.[0];

    if (app) {
      app.$["android:networkSecurityConfig"] =
        "@xml/network_security_config";
    }

    return config;
  });
}

/**
 * Handle GMA APPLICATION_ID conflict
 */
function withGmaApplicationIdFix(config, { gmaAppId } = {}) {
  if (!gmaAppId) return config;

  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const app = manifest.manifest.application?.[0];

    if (app) {
      if (!app["meta-data"]) {
        app["meta-data"] = [];
      }

      // Check if already present
      const existing = app["meta-data"].find(
        (m) =>
          m.$["android:name"] ===
          "com.google.android.gms.ads.APPLICATION_ID"
      );

      if (existing) {
        existing.$["android:value"] = gmaAppId;
        existing.$["tools:replace"] = "android:value";
      } else {
        app["meta-data"].push({
          $: {
            "android:name": "com.google.android.gms.ads.APPLICATION_ID",
            "android:value": gmaAppId,
            "tools:replace": "android:value",
          },
        });
      }

      // Add tools namespace if not present
      if (!manifest.manifest.$["xmlns:tools"]) {
        manifest.manifest.$["xmlns:tools"] =
          "http://schemas.android.com/tools";
      }
    }

    return config;
  });
}

/**
 * Add OutbrainSDK pod to Podfile (iOS)
 */
function withOutbrainPod(config, { iosSdkVersion } = {}) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );

      if (fs.existsSync(podfilePath)) {
        let podfile = fs.readFileSync(podfilePath, "utf8");

        if (!podfile.includes("OutbrainSDK")) {
          const podLine = iosSdkVersion
            ? `  pod 'OutbrainSDK', '~> ${iosSdkVersion}'`
            : `  pod 'OutbrainSDK'`;

          // Insert after the first 'use_react_native' or as a target dependency
          podfile = podfile.replace(
            /(use_react_native!\([\s\S]*?\))/,
            `$1\n\n${podLine}`
          );

          fs.writeFileSync(podfilePath, podfile);
        }
      }

      return config;
    },
  ]);
}

/**
 * Main plugin entry point
 */
function withOutbrain(config, props = {}) {
  const {
    sdkVersion = OUTBRAIN_SDK_VERSION,
    gmaAppId,
    iosSdkVersion,
  } = props;

  config = withOutbrainMavenRepo(config);
  config = withOutbrainDependency(config, { sdkVersion });
  config = withNetworkSecurityConfig(config);
  config = withManifestNetworkSecurity(config);
  config = withOutbrainPod(config, { iosSdkVersion });

  if (gmaAppId) {
    config = withGmaApplicationIdFix(config, { gmaAppId });
  }

  return config;
}

module.exports = createRunOncePlugin(
  withOutbrain,
  "expo-outbrain-widget",
  "1.0.0"
);
