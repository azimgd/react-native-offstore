#include <jsi/jsi.h>
#include "state-object.cpp"
#include "state-cache.cpp"

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeHostObject : public HostObject {

  public:
    explicit NativeHostObject(Runtime &jsRuntime, string temporaryDirectory) {
      cachePtr = make_shared<NativeStateCache>(temporaryDirectory);
      statePtr = make_shared<NativeStateObject>(jsRuntime);
      
      // Hydrate initial state from cache
      statePtr->set(jsRuntime, String::createFromUtf8(jsRuntime, cachePtr->read()));
    }
    virtual ~NativeHostObject() {}

  protected:
    shared_ptr<NativeStateCache> cachePtr;
    shared_ptr<NativeStateObject> statePtr;
    
    Value pointer(Runtime &jsRuntime) {
      return Function::createFromHostFunction(jsRuntime, PropNameID::forAscii(jsRuntime, "at"), 1,
        [this](
          Runtime &jsRuntime, const Value &thisValue, const Value *arguments, size_t count
        ) -> Value {
          return statePtr->pointer(jsRuntime, arguments[0].getString(jsRuntime).utf8(jsRuntime));
        });
    };
    
    Value patch(Runtime &jsRuntime) {
      return Function::createFromHostFunction(
        jsRuntime,
        PropNameID::forAscii(jsRuntime, "patch"),
        1,
        [this, cachePtr = cachePtr](
          Runtime &jsRuntime,
          const Value &thisValue,
          const Value *arguments,
          size_t count
        ) -> Value {
          statePtr->patch(jsRuntime, arguments[0]);

          // Persist state into phone's disk cache
          cachePtr->write((statePtr->get(jsRuntime)).getString(jsRuntime).utf8(jsRuntime));
          
          return Value();
        });
    };
    
  public:
    Value get(Runtime &jsRuntime, const PropNameID &name) override {
      auto prop = name.utf8(jsRuntime);
      
      if (prop == "state") {
        return statePtr->get(jsRuntime);
      }
      
      if (prop == "pointer") {
        return pointer(jsRuntime);
      }
      
      if (prop == "patch") {
        return patch(jsRuntime);
      }
      
      return Value::undefined();
    }

    void set(Runtime &jsRuntime, const PropNameID& name, const Value& value) override {
      auto prop = name.utf8(jsRuntime);

      if (prop == "state") {
        statePtr->set(jsRuntime, value);

        // Persist state into phone's disk cache
        cachePtr->write((statePtr->get(jsRuntime)).getString(jsRuntime).utf8(jsRuntime));
      }
    }
  };
}
