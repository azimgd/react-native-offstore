#include "react-native-offstore.h"
#include "json.hpp"
#include "host-object.cpp"

using namespace::nlohmann;
using namespace::std;
using namespace::facebook::react;
using namespace::facebook::jsi;

namespace offstore {
	void setup(Runtime& runtime, shared_ptr<CallInvoker> jsCallInvoker, string temporaryDirectory) {
    shared_ptr<NativeHostObject> hostObjectBinding = make_shared<NativeHostObject>(runtime, temporaryDirectory);
    Object hostObjectJSI = Object::createFromHostObject(runtime, hostObjectBinding);
    
    runtime.global().setProperty(runtime, "__OffstoreHostObject", hostObjectJSI);
		runtime.global().setProperty(runtime, "__OffstoreProxy", Value(true));
	}
}
