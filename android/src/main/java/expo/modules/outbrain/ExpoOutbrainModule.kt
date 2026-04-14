package expo.modules.outbrain

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.outbrain.OBSDK.Outbrain
import com.outbrain.OBSDK.OutbrainException

class ExpoOutbrainModule : Module() {

  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React context is not available")

  override fun definition() = ModuleDefinition {
    Name("ExpoOutbrain")

    /**
     * Register the app with Outbrain SDK.
     * Must be called once before any widget is displayed.
     *
     * @param partnerKey - The installation/partner key from Outbrain
     */
    AsyncFunction("register") { partnerKey: String ->
      try {
        Outbrain.register(context.applicationContext, partnerKey)
        return@AsyncFunction true
      } catch (e: OutbrainException) {
        throw Exception("Outbrain register failed: ${e.message}")
      }
    }

    /**
     * Enable/disable test mode.
     * In test mode, Outbrain won't report clicks for billing.
     */
    Function("setTestMode") { enabled: Boolean ->
      Outbrain.setTestMode(enabled)
    }

    /**
     * Simulate a location for test mode.
     * @param location - 2-letter country code (e.g. "us", "gb", "fr")
     */
    Function("testLocation") { location: String ->
      Outbrain.testLocation(location)
    }

    /**
     * Enable Display Ads test mode (SDK 5.0.0+).
     * Adds test card on top of the feed with action buttons.
     */
    Function("setDisplayTest") { enabled: Boolean ->
      Outbrain.setDisplayTest(enabled)
    }
  }
}
