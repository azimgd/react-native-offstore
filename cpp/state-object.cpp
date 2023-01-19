#include <jsi/jsi.h>
#include "json.hpp"

using namespace::std;
using namespace::facebook::jsi;
using namespace::nlohmann;

namespace offstore {
  class NativeStateObject {

  public:
    explicit NativeStateObject() {}
    virtual ~NativeStateObject() {}

  protected:
    json state;
    
  public:
    Value get(Runtime &runtime) {
      if (state.is_null()) {
        return Value::null();
      }

      return String::createFromUtf8(runtime, state.dump().c_str());
    }

    void set(Runtime& runtime, const Value& value) {
      if (!value.isString()) {
        JSError(runtime, "[react-native-offstore] only string value supported for assignment, consider wrapping your payload with JSON.stringify beforehand.");
        return;
      }

      state = json::parse(value.getString(runtime).utf8(runtime));
    }
  };
}
