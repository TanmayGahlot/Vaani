package com.vaani.modules

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.AlarmClock
import android.provider.Settings
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.vaani.accessibility.VaaniAccessibilityService
import java.util.Locale

class VaaniNativeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var speechRecognizer: SpeechRecognizer? = null
    private var textToSpeech: TextToSpeech? = null
    private var isTtsInitialized = false
    private val mainHandler = Handler(Looper.getMainLooper())

    override fun getName(): String = "VaaniNativeModule"

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (_: Exception) {
            // Context might be inactive or tearing down
        }
    }

    // Required for React Native NativeEventEmitter
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}

    // -------------------------------------------------------------------------
    // Real Microphone Speech-to-Text Recognition
    // -------------------------------------------------------------------------
    @ReactMethod
    fun startSpeechRecognition(languageCode: String, promise: Promise) {
        mainHandler.post {
            try {
                if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                    promise.reject("UNAVAILABLE", "Speech recognition service is not available on this device")
                    return@post
                }

                speechRecognizer?.cancel()
                speechRecognizer?.destroy()
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext).apply {
                    setRecognitionListener(object : RecognitionListener {
                        override fun onReadyForSpeech(params: Bundle?) {
                            sendEvent("onSpeechReady", Arguments.createMap())
                        }

                        override fun onBeginningOfSpeech() {
                            sendEvent("onSpeechStart", Arguments.createMap())
                        }

                        override fun onRmsChanged(rmsdB: Float) {
                            val map = Arguments.createMap().apply {
                                putDouble("rms", rmsdB.toDouble())
                            }
                            sendEvent("onSpeechVolume", map)
                        }

                        override fun onBufferReceived(buffer: ByteArray?) {}

                        override fun onEndOfSpeech() {
                            sendEvent("onSpeechEnd", Arguments.createMap())
                        }

                        override fun onError(error: Int) {
                            val errorMsg = when (error) {
                                SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                                SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                                SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                                SpeechRecognizer.ERROR_NETWORK -> "Network error"
                                SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                                SpeechRecognizer.ERROR_NO_MATCH -> "No speech recognized"
                                SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Recognition service busy"
                                SpeechRecognizer.ERROR_SERVER -> "Server error"
                                SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Speech timeout"
                                else -> "Speech recognition error code: $error"
                            }
                            val map = Arguments.createMap().apply {
                                putInt("code", error)
                                putString("message", errorMsg)
                            }
                            sendEvent("onSpeechError", map)
                        }

                        override fun onResults(results: Bundle?) {
                            val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            val map = Arguments.createMap()
                            if (!matches.isNullOrEmpty()) {
                                map.putString("text", matches[0])
                                val matchesArray = Arguments.createArray()
                                for (m in matches) {
                                    matchesArray.pushString(m)
                                }
                                map.putArray("matches", matchesArray)
                            } else {
                                map.putString("text", "")
                            }
                            sendEvent("onSpeechResults", map)
                        }

                        override fun onPartialResults(partialResults: Bundle?) {
                            val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                            if (!matches.isNullOrEmpty()) {
                                val map = Arguments.createMap().apply {
                                    putString("text", matches[0])
                                }
                                sendEvent("onSpeechPartialResults", map)
                            }
                        }

                        override fun onEvent(eventType: Int, params: Bundle?) {}
                    })
                }

                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                    putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                    putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
                    putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, reactContext.packageName)
                    putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 3000L)
                    putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 4000L)
                    putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 3000L)

                    val locale = when (languageCode.lowercase()) {
                        "hi" -> "hi-IN"
                        "ta" -> "ta-IN"
                        "te" -> "te-IN"
                        "mr" -> "mr-IN"
                        "bn" -> "bn-IN"
                        "gu" -> "gu-IN"
                        "kn" -> "kn-IN"
                        "ml" -> "ml-IN"
                        "pa" -> "pa-IN"
                        "en" -> "en-US"
                        else -> "en-US"
                    }
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE, locale)
                    putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, locale)
                }

                speechRecognizer?.startListening(intent)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("START_ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun stopSpeechRecognition(promise: Promise) {
        mainHandler.post {
            try {
                speechRecognizer?.stopListening()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("STOP_ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun cancelSpeechRecognition(promise: Promise) {
        mainHandler.post {
            try {
                speechRecognizer?.cancel()
                speechRecognizer?.destroy()
                speechRecognizer = null
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("CANCEL_ERROR", e.message)
            }
        }
    }

    // -------------------------------------------------------------------------
    // Real Text-To-Speech Audio Voice Output
    // -------------------------------------------------------------------------
    @ReactMethod
    fun speakText(text: String, languageCode: String, promise: Promise) {
        mainHandler.post {
            try {
                if (textToSpeech == null) {
                    textToSpeech = TextToSpeech(reactContext) { status ->
                        if (status == TextToSpeech.SUCCESS) {
                            isTtsInitialized = true
                            performSpeak(text, languageCode, promise)
                        } else {
                            promise.reject("TTS_INIT_ERROR", "Failed to initialize TTS engine")
                        }
                    }
                } else if (isTtsInitialized) {
                    performSpeak(text, languageCode, promise)
                } else {
                    promise.reject("TTS_NOT_READY", "TTS engine initializing")
                }
            } catch (e: Exception) {
                promise.reject("TTS_ERROR", e.message)
            }
        }
    }

    private fun performSpeak(text: String, languageCode: String, promise: Promise) {
        val locale = when (languageCode.lowercase()) {
            "hi" -> Locale("hi", "IN")
            "ta" -> Locale("ta", "IN")
            "te" -> Locale("te", "IN")
            "mr" -> Locale("mr", "IN")
            "bn" -> Locale("bn", "IN")
            "gu" -> Locale("gu", "IN")
            "kn" -> Locale("kn", "IN")
            "ml" -> Locale("ml", "IN")
            "pa" -> Locale("pa", "IN")
            else -> Locale.ENGLISH
        }
        textToSpeech?.language = locale
        val utteranceId = System.currentTimeMillis().toString()
        textToSpeech?.speak(text, TextToSpeech.QUEUE_FLUSH, null, utteranceId)
        promise.resolve(true)
    }

    @ReactMethod
    fun stopSpeaking(promise: Promise) {
        mainHandler.post {
            try {
                textToSpeech?.stop()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("STOP_TTS_ERROR", e.message)
            }
        }
    }

    // -------------------------------------------------------------------------
    // System Actions (Accessibility, Launch App, Place Call, Set Alarm)
    // -------------------------------------------------------------------------
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
            val uri = Uri.parse("https://api.whatsapp.com/send?text=${Uri.encode(message)}")
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            reactContext.startActivity(intent)

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
