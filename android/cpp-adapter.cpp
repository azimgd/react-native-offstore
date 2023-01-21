#include <jni.h>
#include <jsi/jsi.h>
#include <ReactCommon/CallInvokerHolder.h>
#include "react-native-offstore.h"

extern "C"
JNIEXPORT void JNICALL
Java_com_offstore_OffstoreModule_nativeSetup(JNIEnv *env, jclass type, long jsiPtr, jstring temporaryDirectory) {
    auto runtime = reinterpret_cast<facebook::jsi::Runtime*>(jsiPtr);

    jboolean isCopy;
    const char *convertedValue = (env)->GetStringUTFChars(temporaryDirectory, &isCopy);

    offstore::setup(*runtime, convertedValue);
}
