# expo-outbrain-widget

Outbrain SmartFeed Widget pour **Expo SDK 55+** et React Native **New Architecture**.

## Pourquoi ce plugin ?

Le package officiel `outbrain-react-native` (v1.0.1) a été conçu avant la migration obligatoire vers la New Architecture (Fabric/TurboModules) imposée par Expo SDK 55 / React Native 0.83. Ce plugin :

- ✅ Compatible New Architecture (pas de bridge legacy)
- ✅ Utilise `react-native-webview` (Fabric-compatible) au lieu d'un native module custom
- ✅ Expo Config Plugin intégré (auto-configure maven, pods, manifest)
- ✅ Fonctionne avec `expo-dev-client` et `npx expo prebuild`
- ✅ TypeScript natif
- ✅ Toutes les features : dark mode, GDPR/CCPA, Platforms API, events, multi-widget

## Installation

### 1. Installer les dépendances

```bash
npx expo install react-native-webview
```

### 2. Ajouter le plugin (local)

Copier le dossier `expo-outbrain-widget` dans votre projet (par exemple dans `./plugins/`), puis dans votre `package.json` :

```json
{
  "dependencies": {
    "expo-outbrain-widget": "file:./plugins/expo-outbrain-widget"
  }
}
```

### 3. Configurer le Config Plugin

Dans `app.json` ou `app.config.js` :

```json
{
  "expo": {
    "plugins": [
      [
        "expo-outbrain-widget",
        {
          "sdkVersion": "5.1.7",
          "gmaAppId": "ca-app-pub-XXXXX~YYYYY"
        }
      ]
    ]
  }
}
```

#### Options du Config Plugin

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sdkVersion` | string | `"5.1.7"` | Version du SDK Android Outbrain |
| `gmaAppId` | string | — | Google Mobile Ads Application ID (pour résoudre le conflit `APPLICATION_ID`) |
| `iosSdkVersion` | string | — | Version du SDK iOS Outbrain (CocoaPods) |

### 4. Rebuild

```bash
npx expo prebuild --clean
npx expo run:android  # ou run:ios
```

## Utilisation

### Basique

```tsx
import { ScrollView } from 'react-native';
import { OutbrainWidget } from 'expo-outbrain-widget';

export default function ArticleScreen() {
  return (
    <ScrollView>
      {/* ... votre contenu article ... */}

      <OutbrainWidget
        widgetId="MB_1"
        widgetIndex={0}
        articleUrl="https://mon-site.com/article/123"
        partnerKey="MON_PARTNER_KEY"
      />
    </ScrollView>
  );
}
```

### Avec event handlers

```tsx
import { OutbrainWidget } from 'expo-outbrain-widget';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

export default function ArticleScreen() {
  const router = useRouter();

  return (
    <OutbrainWidget
      widgetId="MB_1"
      widgetIndex={0}
      articleUrl="https://mon-site.com/article/123"
      partnerKey="MON_PARTNER_KEY"
      darkMode={true}
      handler={{
        onRecClick: (url) => {
          // Ouvrir les pubs dans un in-app browser
          WebBrowser.openBrowserAsync(url);
        },
        onOrganicClick: (url) => {
          // Navigation in-app pour le contenu organique
          router.push({ pathname: '/article', params: { url } });
        },
        onHeightChange: (height) => {
          console.log('Widget height:', height);
        },
        onWidgetEvent: (eventName, data) => {
          console.log('Widget event:', eventName, data);
        },
      }}
    />
  );
}
```

### Multi-widgets

```tsx
<ScrollView>
  <OutbrainWidget
    widgetId="MB_1"
    widgetIndex={0}
    articleUrl="https://mon-site.com/article"
    partnerKey="MON_PARTNER_KEY"
  />

  {/* ... contenu intermédiaire ... */}

  <OutbrainWidget
    widgetId="MB_2"
    widgetIndex={1}
    articleUrl="https://mon-site.com/article"
    partnerKey="MON_PARTNER_KEY"
  />
</ScrollView>
```

### Mode test

```tsx
import { OutbrainWidget, setTestMode } from 'expo-outbrain-widget';

// En développement
if (__DEV__) {
  setTestMode(true);
}

<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article"
  partnerKey="MON_PARTNER_KEY"
  testMode={__DEV__}
  testLocation="us"  // Simuler la localisation US
/>
```

### GDPR / CCPA

```tsx
<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article"
  partnerKey="MON_PARTNER_KEY"
  consentV2="CPxxxxxxxxxxxxxx"  // TCF consent string
  ccpaString="1YNN"
/>
```

### Platforms API

```tsx
// Portal URL
<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://portal.example.com"
  partnerKey="MON_PARTNER_KEY"
  usePortalUrl={true}
  lang="fr"
  psub="section-a"
/>

// Bundle URL
<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://play.google.com/store/apps/details?id=com.myapp"
  partnerKey="MON_PARTNER_KEY"
  useBundleUrl={true}
  lang="en"
/>
```

## Architecture

```
┌─────────────────────────────────────────────┐
│  React Native (New Architecture / Fabric)   │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  <OutbrainWidget />                   │  │
│  │  ├─ Props → HTML builder             │  │
│  │  ├─ WebView (react-native-webview)   │  │
│  │  └─ postMessage bridge ←→ handlers   │  │
│  └───────────────────────────────────────┘  │
│               │                             │
│               ▼                             │
│  ┌───────────────────────────────────────┐  │
│  │  WebView Content                      │  │
│  │  ├─ Outbrain JS (widgets.outbrain.com)│  │
│  │  ├─ SmartFeed / SmartLogic rendering  │  │
│  │  ├─ MutationObserver → height reports │  │
│  │  └─ Click interceptor → postMessage   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

L'approche est identique à celle des SDK natifs officiels d'Outbrain (`SFWebViewWidget` sur Android, `SFWidget` sur iOS) : ils utilisent tous une WebView en interne. La différence est que nous la pilotons directement depuis React Native via `react-native-webview` (compatible Fabric), au lieu de passer par un native module intermédiaire écrit en Java/Kotlin ou ObjC/Swift.

## Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `widgetId` | `string` | ✅ | Widget ID fourni par Outbrain |
| `articleUrl` | `string` | ✅ | URL de l'article/contenu |
| `partnerKey` | `string` | ✅ | Clé partenaire/installation |
| `widgetIndex` | `number` | — | Index (0-based) pour multi-widgets |
| `darkMode` | `boolean` | — | Mode sombre |
| `testMode` | `boolean` | — | Mode test (désactive le billing) |
| `testLocation` | `string` | — | Code pays simulé (2 lettres) |
| `extId` | `string` | — | ID externe pour reporting |
| `extSecondaryId` | `string` | — | ID externe secondaire |
| `pubImpId` | `string` | — | Publisher impression ID |
| `consentV1` | `string` | — | GDPR consent v1 |
| `consentV2` | `string` | — | GDPR consent v2 (TCF) |
| `ccpaString` | `string` | — | CCPA consent string |
| `userId` | `string` | — | User ID (IDFA si consenti) |
| `usePortalUrl` | `boolean` | — | Platforms API: portal URL |
| `useBundleUrl` | `boolean` | — | Platforms API: bundle URL |
| `useContentUrl` | `boolean` | — | Platforms API: content URL |
| `lang` | `string` | — | Code langue (ISO 639-1) |
| `psub` | `string` | — | Publisher sub-ID |
| `handler` | `OutbrainWidgetHandler` | — | Callbacks d'événements |
| `style` | `ViewStyle` | — | Style du conteneur |

## Troubleshooting

### APPLICATION_ID conflict

Si vous avez aussi `react-native-google-mobile-ads`, ajoutez `gmaAppId` dans le config plugin :

```json
["expo-outbrain-widget", { "gmaAppId": "ca-app-pub-XXXXX~YYYYY" }]
```

### Widget ne s'affiche pas

1. Vérifiez que vous avez fait `npx expo prebuild --clean` après l'ajout du plugin
2. Vérifiez que le `partnerKey` et `widgetId` sont corrects
3. En mode dev, activez `testMode={true}`
4. Vérifiez la console pour les erreurs via `onWidgetEvent`

### Height incorrecte

Le widget utilise un `MutationObserver` + intervalle de 500ms pour détecter les changements de hauteur. Si le contenu se charge lentement, la hauteur s'ajustera automatiquement.

## Licence

MIT
