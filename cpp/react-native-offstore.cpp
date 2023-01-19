#include "react-native-offstore.h"

namespace offstore {
	void setup(facebook::jsi::Runtime& jsiRuntime) {
		jsiRuntime.global().setProperty(jsiRuntime, "__OffstoreProxy", facebook::jsi::Value(true));
	}
}
