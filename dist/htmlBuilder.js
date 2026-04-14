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
export function buildWidgetHtml(props) {
    const { widgetId, widgetIndex = 0, articleUrl, partnerKey, darkMode = false, testMode = false, testLocation, extId, extSecondaryId, pubImpId, consentV1, consentV2, ccpaString, userId, usePortalUrl = false, useBundleUrl = false, useContentUrl = false, lang, psub, } = props;
    // Build OBR configuration parameters
    const configParams = {};
    if (extId)
        configParams["extId"] = extId;
    if (extSecondaryId)
        configParams["extSecondaryId"] = extSecondaryId;
    if (pubImpId)
        configParams["pubImpId"] = pubImpId;
    if (consentV1)
        configParams["consentV1"] = consentV1;
    if (consentV2)
        configParams["consentV2"] = consentV2;
    if (ccpaString)
        configParams["ccpaString"] = ccpaString;
    if (userId)
        configParams["userId"] = userId;
    if (lang)
        configParams["lang"] = lang;
    if (psub)
        configParams["psub"] = psub;
    // Determine URL type for Platforms API
    let urlType = "articleUrl";
    if (usePortalUrl)
        urlType = "portalUrl";
    else if (useBundleUrl)
        urlType = "bundleUrl";
    else if (useContentUrl)
        urlType = "contentUrl";
    const configParamsJson = JSON.stringify(configParams);
    const darkModeStr = darkMode ? "true" : "false";
    const testModeStr = testMode ? "true" : "false";
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      overflow-x: hidden;
      background-color: ${darkMode ? "#1a1a1a" : "#ffffff"};
      -webkit-text-size-adjust: 100%;
    }
    #outbrain-widget {
      width: 100%;
    }
    .ob-widget {
      width: 100% !important;
    }
  </style>
</head>
<body>
  <div id="outbrain-widget"></div>

  <script>
    // Bridge: communicate with React Native
    var OBBridge = {
      sendMessage: function(type, data) {
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: type,
            data: data
          }));
        } catch(e) {
          console.error('OBBridge sendMessage error:', e);
        }
      },

      reportHeight: function() {
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(
          body.scrollHeight, body.offsetHeight,
          html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        OBBridge.sendMessage('heightChange', { height: height });
      }
    };

    // Height observer - report height changes
    var _lastHeight = 0;
    var _heightObserver = new MutationObserver(function() {
      requestAnimationFrame(function() {
        OBBridge.reportHeight();
      });
    });
    _heightObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });

    // Also report height on resize
    window.addEventListener('resize', function() {
      OBBridge.reportHeight();
    });

    // Periodic height check as fallback
    setInterval(function() {
      OBBridge.reportHeight();
    }, 500);

    // Outbrain widget configuration
    var OB_WIDGET_ID = ${JSON.stringify(widgetId)};
    var OB_WIDGET_INDEX = ${widgetIndex};
    var OB_ARTICLE_URL = ${JSON.stringify(articleUrl)};
    var OB_PARTNER_KEY = ${JSON.stringify(partnerKey)};
    var OB_DARK_MODE = ${darkModeStr};
    var OB_TEST_MODE = ${testModeStr};
    var OB_TEST_LOCATION = ${testLocation ? JSON.stringify(testLocation) : "null"};
    var OB_URL_TYPE = ${JSON.stringify(urlType)};
    var OB_CONFIG_PARAMS = ${configParamsJson};

    // Custom click handler - intercept all recommendation clicks
    function OB_initWidget() {
      var container = document.getElementById('outbrain-widget');

      // Create the Outbrain widget element
      var obDiv = document.createElement('div');
      obDiv.className = 'OUTBRAIN';
      obDiv.setAttribute('data-widget-id', OB_WIDGET_ID);
      obDiv.setAttribute('data-widget-index', String(OB_WIDGET_INDEX));
      obDiv.setAttribute('data-ob-installation-key', OB_PARTNER_KEY);
      obDiv.setAttribute('data-ob-mark', 'true');

      // Set URL based on type
      switch(OB_URL_TYPE) {
        case 'portalUrl':
          obDiv.setAttribute('data-ob-portalurl', OB_ARTICLE_URL);
          break;
        case 'bundleUrl':
          obDiv.setAttribute('data-ob-bundleurl', OB_ARTICLE_URL);
          break;
        case 'contentUrl':
          obDiv.setAttribute('data-ob-contenturl', OB_ARTICLE_URL);
          break;
        default:
          obDiv.setAttribute('data-src', OB_ARTICLE_URL);
      }

      // Dark mode
      if (OB_DARK_MODE) {
        obDiv.setAttribute('data-dark-mode', 'true');
      }

      // Test mode
      if (OB_TEST_MODE) {
        obDiv.setAttribute('data-ob-test', 'true');
      }
      if (OB_TEST_LOCATION) {
        obDiv.setAttribute('data-ob-test-location', OB_TEST_LOCATION);
      }

      // Optional params
      if (OB_CONFIG_PARAMS.extId) {
        obDiv.setAttribute('data-ob-extid', OB_CONFIG_PARAMS.extId);
      }
      if (OB_CONFIG_PARAMS.extSecondaryId) {
        obDiv.setAttribute('data-ob-ext-secondary-id', OB_CONFIG_PARAMS.extSecondaryId);
      }
      if (OB_CONFIG_PARAMS.pubImpId) {
        obDiv.setAttribute('data-ob-pubimpid', OB_CONFIG_PARAMS.pubImpId);
      }
      if (OB_CONFIG_PARAMS.userId) {
        obDiv.setAttribute('data-ob-userid', OB_CONFIG_PARAMS.userId);
      }
      if (OB_CONFIG_PARAMS.consentV2) {
        obDiv.setAttribute('data-ob-consent-string', OB_CONFIG_PARAMS.consentV2);
      }
      if (OB_CONFIG_PARAMS.ccpaString) {
        obDiv.setAttribute('data-ob-ccpa', OB_CONFIG_PARAMS.ccpaString);
      }
      if (OB_CONFIG_PARAMS.lang) {
        obDiv.setAttribute('data-ob-lang', OB_CONFIG_PARAMS.lang);
      }
      if (OB_CONFIG_PARAMS.psub) {
        obDiv.setAttribute('data-ob-psub', OB_CONFIG_PARAMS.psub);
      }

      // Custom click handler settings
      obDiv.setAttribute('data-ob-settings', JSON.stringify({
        "982": true,      // Custom Clicks Handler = enabled
        "1000": "0 0 0 0", // feedMargin
        "1681": "document-offset-height" // Bridge Height Calculation Type
      }));

      container.appendChild(obDiv);

      // Load Outbrain JS
      var script = document.createElement('script');
      script.src = 'https://widgets.outbrain.com/outbrain.js';
      script.async = true;
      script.onload = function() {
        OBBridge.sendMessage('widgetEvent', {
          eventName: 'scriptLoaded',
          data: {}
        });
      };
      script.onerror = function() {
        OBBridge.sendMessage('widgetEvent', {
          eventName: 'scriptError',
          data: { error: 'Failed to load Outbrain script' }
        });
      };
      document.head.appendChild(script);
    }

    // Intercept Outbrain click events
    // The Outbrain widget with setting 982=true sends click events
    // that we can intercept
    window.addEventListener('message', function(event) {
      try {
        var msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg && msg.type === 'obClick') {
          var isOrganic = msg.isOrganic || false;
          var url = msg.url || '';

          if (isOrganic) {
            OBBridge.sendMessage('organicClick', { url: url });
          } else {
            OBBridge.sendMessage('recClick', { url: url });
          }
        }
        if (msg && msg.type === 'obWidgetRendered') {
          OBBridge.sendMessage('widgetEvent', {
            eventName: 'widgetRendered',
            data: {
              widgetId: OB_WIDGET_ID,
              widgetIndex: OB_WIDGET_INDEX
            }
          });
          // Report initial height after render
          setTimeout(function() { OBBridge.reportHeight(); }, 200);
        }
      } catch(e) {
        // Not a JSON message, ignore
      }
    });

    // Intercept all link clicks as a fallback
    document.addEventListener('click', function(e) {
      var target = e.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      if (target && target.href) {
        e.preventDefault();
        e.stopPropagation();

        var url = target.href;
        var isOrganic = !url.includes('paid.outbrain.com') && !url.includes('/network/redir');

        if (isOrganic) {
          OBBridge.sendMessage('organicClick', { url: url });
        } else {
          OBBridge.sendMessage('recClick', { url: url });
        }
        return false;
      }
    }, true);

    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', OB_initWidget);
    } else {
      OB_initWidget();
    }
  </script>
</body>
</html>
`.trim();
}
