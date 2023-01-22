#include <jsi/jsi.h>
#include "state-dispatcher.cpp"
#include "state-object.cpp"
#include "state-cache.cpp"
#include "JsiWorklet.h"

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeHostObject : public HostObject {

  public:
    explicit NativeHostObject(Runtime& runtime, string temporaryDirectory) {
      cachePtr = make_shared<NativeStateCache>(temporaryDirectory);
      statePtr = make_shared<NativeStateObject>();
      dispatcherPtr = make_shared<NativeStateDispatcher>();
      
      /**
        * Hydrate initial state from cache
       */
      statePtr->set(runtime, String::createFromUtf8(runtime, cachePtr->read()));
    }
    virtual ~NativeHostObject() {}

  protected:
    shared_ptr<NativeStateCache> cachePtr;
    shared_ptr<NativeStateObject> statePtr;
    shared_ptr<NativeStateDispatcher> dispatcherPtr;
    
    Value subscribe(Runtime &runtime) {
      return Function::createFromHostFunction(
        runtime,
        PropNameID::forAscii(runtime, "watch"),
        1,
        [this, dispatcherPtr = dispatcherPtr](
          Runtime &runtime,
          const Value &thisValue,
          const Value *arguments,
          size_t count
        ) -> Value {
          auto callbackId = arguments[0].asString(runtime).utf8(runtime);
          auto callbackFn = arguments[1].asObject(runtime).asFunction(runtime);

          dispatcherPtr->subscribe(runtime, callbackId, move(callbackFn));
          
          return Value();
        });
    };
    
  public:
    Value get(Runtime &runtime, const PropNameID &name) override {
      auto prop = name.utf8(runtime);
      
      if (prop == "state") {
        return statePtr->get(runtime);
      }
      
      if (prop == "subscribe") {
        return subscribe(runtime);
      }
      
      return Value::undefined();
    }

    void set(Runtime& runtime, const PropNameID& name, const Value& value) override {
      auto prop = name.utf8(runtime);

      if (prop == "state") {
        bool changed = statePtr->set(runtime, value);
        if (changed) {
          /**
            * Send updated state to all subscribed callbacks
           */
          dispatcherPtr->dispatchAll(runtime, statePtr->get(runtime));
          
          /**
            * Persist state into phone's disk cache
           */
          cachePtr->write((statePtr->get(runtime)).getString(runtime).utf8(runtime));
        }
      }
    }
  };
}
