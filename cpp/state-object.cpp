#include <jsi/jsi.h>
#include "json.hpp"
#include "cjson.h"
#include "cjson-utils.h"

using namespace::std;
using namespace::facebook::jsi;
using namespace::nlohmann;

namespace offstore {
  class NativeStateObject {

  public:
    explicit NativeStateObject(Runtime &jsRuntime) :
      state(String::createFromUtf8(jsRuntime, "{}")) {}
    virtual ~NativeStateObject() {}

  protected:
    Value state;
    
  public:
    Value get(Runtime &runtime) {
      return state.getString(runtime);
    }

    Value pointer(Runtime &runtime, string path) {
      json parsedState = json::parse(state.getString(runtime).utf8(runtime));
      json parsedPath = parsedState[operator""_json_pointer(path.c_str(), path.length())];

      return String::createFromUtf8(runtime, parsedPath.dump());
    }

    json set(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        throw JSError(runtime, "Could not set state, payload must be a string");
      }

      try {
        json parsedState = json::parse(state.getString(runtime).utf8(runtime));
        json parsedPayload = json::parse(payload.getString(runtime).utf8(runtime));
        json parsedDiff = json::diff(parsedPayload, parsedState);

        state = String::createFromUtf8(runtime, parsedPayload.dump());
        return parsedDiff;
      } catch (json::exception &error) {
        throw JSError(runtime, "Could not set state, payload must be a valid json");
      }
    }

    json patch(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        throw JSError(runtime, "Could not patch state, payload must be a string");
      }

      try {
        auto monitor = state.getString(runtime).utf8(runtime).c_str();
        auto result = cJSON_Print(cJSONUtils_GetPointer(cJSON_Parse(monitor), "/statuses/0/metadata"));
        
        printf("debug: %s", result);

        return json::diff(json::object(), json::object());
      } catch (json::exception &error) {
        throw JSError(runtime, "Could not patch state, payload must be a valid json");
      }
    }
  };
}
