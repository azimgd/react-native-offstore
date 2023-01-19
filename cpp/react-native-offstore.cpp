#include "react-native-offstore.h"
#include "json.hpp"
#include "host-object.cpp"

using namespace::nlohmann;
using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
	void setup(Runtime& runtime) {
    NativeHostObject hostObject;
    shared_ptr<NativeHostObject> hostObjectBinding = make_shared<NativeHostObject>(move(hostObject));
    Object hostObjectJSI = Object::createFromHostObject(runtime, hostObjectBinding);
    
    runtime.global().setProperty(runtime, "__OffstoreHostObject", hostObjectJSI);
		runtime.global().setProperty(runtime, "__OffstoreProxy", Value(true));
	}
}
