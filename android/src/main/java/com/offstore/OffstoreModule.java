package com.offstore;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = OffstoreModule.NAME)
public class OffstoreModule extends NativeOffstoreSpec {
  public static final String NAME = "Offstore";

  public OffstoreModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  static {
    System.loadLibrary("offstore");
  }

  private static native void nativeSetup(long jsiPtr);

  @Override
  public boolean setup() {
    nativeSetup(getReactApplicationContext().getJavaScriptContextHolder().get());
    return true;
  }
}
