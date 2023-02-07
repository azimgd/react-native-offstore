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
    explicit NativeStateObject(Runtime &jsRuntime) {}
    virtual ~NativeStateObject() {}

  protected:
    cJSON *parsedState;
    
  public:
    Value get(Runtime &runtime) {
      return String::createFromUtf8(runtime, cJSON_Print(parsedState));
    }

    Value pointer(Runtime &runtime, string path) {
      auto response = cJSON_Print(cJSONUtils_GetPointer(parsedState, path.c_str()));

      return String::createFromUtf8(runtime, response);
    }

    void set(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        throw JSError(runtime, "Could not set state, payload must be a string");
      }

      try {
        cJSON *parsedPayload = cJSON_Parse(payload.getString(runtime).utf8(runtime).c_str());

        parsedState = parsedPayload;
      } catch (json::exception &error) {
        throw JSError(runtime, "Could not set state, payload must be a valid json");
      }
    }

    void patch(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        throw JSError(runtime, "Could not patch state, payload must be a string");
      }

      try {
        cJSON *parsedPayload = cJSON_Parse(payload.getString(runtime).utf8(runtime).c_str());
        
        cJSONUtils_MergePatch(parsedState, parsedPayload);
      } catch (json::exception &error) {
        throw JSError(runtime, "Could not patch state, payload must be a valid json");
      }
    }
  };
}
