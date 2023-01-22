#include <jni.h>
#include <jsi/jsi.h>
#include <fbjni/fbjni.h>
#include <ReactCommon/CallInvokerHolder.h>
#include <typeinfo>
#include "react-native-offstore.h"

extern "C"
JNIEXPORT void JNICALL
Java_com_offstore_OffstoreModule_nativeSetup(JNIEnv *env, jclass type, long jsiPtr, jobject jsCallInvokerHolder, jstring temporaryDirectory) {
    auto runtime = reinterpret_cast<facebook::jsi::Runtime*>(jsiPtr);
    auto localCallInvokerHolder = facebook::jni::make_local(jsCallInvokerHolder);
    auto callInvokerHolder = facebook::jni::dynamic_ref_cast<facebook::react::CallInvokerHolder::javaobject>(localCallInvokerHolder);
    jboolean isCopy;
    const char *convertedValue = (env)->GetStringUTFChars(temporaryDirectory, &isCopy);

    offstore::setup(
        *runtime,
        callInvokerHolder->cthis()->getCallInvoker(),
        convertedValue
    );
}
