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
    Value state;
    
  public:
    Value get(Runtime &runtime) {
      return state.getString(runtime);
    }

    void set(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        return;
      }

      try {
        json parsedPayload = json::parse(payload.getString(runtime).utf8(runtime));
        state = String::createFromUtf8(runtime, parsedPayload.dump());
      } catch (json::exception &error) {}
    }

    void patch(Runtime &runtime, const Value &payload) {
      if (!payload.isString()) {
        return;
      }

      try {
        json parsedPayload = json::parse(payload.getString(runtime).utf8(runtime));
        json parsedState = json::parse(payload.getString(runtime).utf8(runtime));

        parsedState.merge_patch(parsedPayload);
        state = String::createFromUtf8(runtime, parsedState.dump());
      } catch (json::exception &error) {}
    }
  };
}
