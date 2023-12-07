package com.tanjong

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.os.Bundle
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {
    @Override
    protected fun onCreate(savedInstanceState: Bundle?) {
        RNBootSplash.init(this)
        super.onCreate(null)
    }

    @get:Override
    protected val mainComponentName: String
        /**
         * Returns the name of the main component registered from JavaScript. This is used to schedule
         * rendering of the component.
         */
        protected get() = "tanjong"

    /**
     * Returns the instance of the [ReactActivityDelegate]. Here we use a util class [ ] which allows you to easily enable Fabric and Concurrent React
     * (aka React 18) with two boolean flags.
     */
    @Override
    protected fun createReactActivityDelegate(): ReactActivityDelegate {
        return DefaultReactActivityDelegate(
            this,
            mainComponentName,  // If you opted-in for the New Architecture, we enable the Fabric Renderer.
			fabricEnabled
        )
    }
}