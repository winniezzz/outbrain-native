import ExpoModulesCore
import OutbrainSDK

public class ExpoOutbrainModule: Module {

  public func definition() -> ModuleDefinition {
    Name("ExpoOutbrain")

    /// Register the app with Outbrain SDK.
    /// Must be called once before any widget is displayed.
    ///
    /// - Parameter partnerKey: The installation/partner key from Outbrain
    AsyncFunction("register") { (partnerKey: String) -> Bool in
      Outbrain.initializeOutbrain(withPartnerKey: partnerKey)
      return true
    }

    /// Enable/disable test mode.
    /// In test mode, Outbrain won't report clicks for billing.
    Function("setTestMode") { (enabled: Bool) in
      Outbrain.setTestMode(enabled)
    }

    /// Simulate a location for test mode.
    /// - Parameter location: 2-letter country code (e.g. "us", "gb", "fr")
    Function("testLocation") { (location: String) in
      Outbrain.testLocation(location)
    }

    /// Enable Display Ads test mode (SDK 5.0.0+).
    Function("setDisplayTest") { (enabled: Bool) in
      Outbrain.setDisplayTest(enabled)
    }
  }
}
