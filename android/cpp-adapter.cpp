#include <jni.h>
#include <jsi/jsi.h>
#include <ReactCommon/CallInvokerHolder.h>
#include "react-native-offstore.h"

extern "C"
JNIEXPORT jint JNICALL
Java_com_offstore_OffstoreModule_nativeMultiply(JNIEnv *env, jclass type, jdouble a, jdouble b) {
    return offstore::multiply(a, b);
}
