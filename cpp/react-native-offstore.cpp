#include "react-native-offstore.h"
#include "host-object.cpp"

using namespace::std;
using namespace::facebook::react;
using namespace::facebook::jsi;

namespace offstore {
	void setup(Runtime &jsRuntime, shared_ptr<CallInvoker> jsCallInvoker, string temporaryDirectory) {
    shared_ptr<NativeHostObject> hostObjectBinding = make_shared<NativeHostObject>(jsRuntime, temporaryDirectory);
    Object hostObjectJSI = Object::createFromHostObject(jsRuntime, hostObjectBinding);
    
    jsRuntime.global().setProperty(jsRuntime, "__OffstoreHostObject", hostObjectJSI);
		jsRuntime.global().setProperty(jsRuntime, "__OffstoreProxy", Value(true));
	}
}
