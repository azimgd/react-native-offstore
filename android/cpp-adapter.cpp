#include <jni.h>
#include <jsi/jsi.h>
#include <ReactCommon/CallInvokerHolder.h>
#include "react-native-offstore.h"

extern "C"
JNIEXPORT void JNICALL
Java_com_offstore_OffstoreModule_nativeSetup(JNIEnv *env, jclass type, long jsiPtr, facebook::jni::alias_ref<facebook::react::CallInvokerHolder::javaobject> jsCallInvokerHolder, facebook::jni::alias_ref<facebook::jni::JString> temporaryDirectory) {
    auto runtime = reinterpret_cast<facebook::jsi::Runtime*>(jsiPtr);
    auto jsCallInvoker = jsCallInvokerHolder->cthis()->getCallInvoker();
    offstore::setup(*runtime, temporaryDirectory->toStdString());
}
