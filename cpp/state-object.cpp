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

    bool set(Runtime &runtime, const Value &value) {
      if (!value.isString()) {
        JSError(runtime, "[react-native-offstore] only string value supported for set, consider wrapping your payload with JSON.stringify beforehand.");
        return false;
      }

      try {
        string temp = state.dump().c_str();
        state = json::parse(value.getString(runtime).utf8(runtime));
        string stateStringified = state.dump();
        bool stateHasChanged = stateStringified != temp;

        return stateHasChanged;
      } catch (json::exception &error) {
        return false;
      }
    }
    
    bool patch(Runtime &runtime, const Value &value) {
      if (!value.isString()) {
        JSError(runtime, "[react-native-offstore] only string value supported for patch, consider wrapping your payload with JSON.stringify beforehand.");
        return false;
      }

      try {
        string temp = state.dump().c_str();
        state.merge_patch(json::parse(value.getString(runtime).utf8(runtime)));
        string stateStringified = state.dump();
        bool stateHasChanged = stateStringified != temp;

        return stateHasChanged;
      } catch (json::exception &error) {
        return false;
      }
    }
  };
}
