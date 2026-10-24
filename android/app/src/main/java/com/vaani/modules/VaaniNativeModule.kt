package com.vaani.modules

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.provider.AlarmClock
import android.provider.Settings
import com.facebook.react.bridge.*
import com.vaani.accessibility.VaaniAccessibilityService

class VaaniNativeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "VaaniNativeModule"

    @ReactMethod
    fun isAccessibilityEnabled(promise: Promise) {
        val enabled = VaaniAccessibilityService.instance != null
        promise.resolve(enabled)
    }

    @ReactMethod
    fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        reactContext.startActivity(intent)
    }

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        val launchIntent = reactContext.packageManager.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(launchIntent)
            promise.resolve(true)
        } else {
            promise.reject("APP_NOT_FOUND", "Package $packageName is not installed")
        }
    }

    @ReactMethod
    fun placeCall(contactOrNumber: String, promise: Promise) {
        try {
            val callIntent = Intent(Intent.ACTION_CALL).apply {
                data = Uri.parse("tel:$contactOrNumber")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(callIntent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CALL_FAILED", e.message)
        }
    }

    @ReactMethod
    fun setAlarm(timeStr: String, label: String, promise: Promise) {
        try {
            val parts = timeStr.replace(" AM", "").replace(" PM", "").split(":")
            val hour = parts[0].trim().toIntOrNull() ?: 7
            val minute = if (parts.size > 1) parts[1].trim().toIntOrNull() ?: 0 else 0

            val intent = Intent(AlarmClock.ACTION_SET_ALARM).apply {
                putExtra(AlarmClock.EXTRA_HOUR, hour)
                putExtra(AlarmClock.EXTRA_MINUTES, minute)
                putExtra(AlarmClock.EXTRA_MESSAGE, label)
                putExtra(AlarmClock.EXTRA_SKIP_UI, true)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ALARM_FAILED", e.message)
        }
    }

    @ReactMethod
    fun sendAutomatedMessage(contact: String, message: String, app: String, promise: Promise) {
        try {
            // First open messaging intent
            val uri = Uri.parse("https://api.whatsapp.com/send?text=${Uri.encode(message)}")
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)

            // Automate clicking "Send" via AccessibilityService after UI renders
            Thread {
                Thread.sleep(1200)
                VaaniAccessibilityService.instance?.clickText("Send")
            }.start()

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("MESSAGE_FAILED", e.message)
        }
    }

    @ReactMethod
    fun performAccessibilityClick(targetText: String, promise: Promise) {
        val service = VaaniAccessibilityService.instance
        if (service != null) {
            val success = service.clickText(targetText)
            promise.resolve(success)
        } else {
            promise.reject("SERVICE_NOT_CONNECTED", "Accessibility service is disabled")
        }
    }

    @ReactMethod
    fun performAccessibilityScroll(direction: String, promise: Promise) {
        val service = VaaniAccessibilityService.instance
        if (service != null) {
            service.performScroll(direction)
            promise.resolve(true)
        } else {
            promise.reject("SERVICE_NOT_CONNECTED", "Accessibility service is disabled")
        }
    }
}
