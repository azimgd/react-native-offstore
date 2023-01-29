#include <jsi/jsi.h>
#include "state-dispatcher.cpp"
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
      dispatcherPtr = make_shared<NativeStateDispatcher>();
      
      // Hydrate initial state from cache
      statePtr->set(jsRuntime, String::createFromUtf8(jsRuntime, cachePtr->read()));
    }
    virtual ~NativeHostObject() {}

  protected:
    shared_ptr<NativeStateCache> cachePtr;
    shared_ptr<NativeStateObject> statePtr;
    shared_ptr<NativeStateDispatcher> dispatcherPtr;
    
    Value subscribe(Runtime &jsRuntime) {
      auto onSuccess = [dispatcherPtr = dispatcherPtr](Runtime &jsRuntime, string callbackPath, Function callbackFn) {
        dispatcherPtr->subscribe(jsRuntime, callbackPath, move(callbackFn));
      };

      return Function::createFromHostFunction(jsRuntime, PropNameID::forAscii(jsRuntime, "subscribe"), 2,
        [onSuccess](
          Runtime &jsRuntime, const Value &thisValue, const Value *arguments, size_t count
        ) -> Value {
          onSuccess(
            jsRuntime,
            arguments[0].asString(jsRuntime).utf8(jsRuntime),
            arguments[1].asObject(jsRuntime).asFunction(jsRuntime)
          );
          
          return Value();
        });
    };
    
    Value patch(Runtime &jsRuntime) {
      return Function::createFromHostFunction(
        jsRuntime,
        PropNameID::forAscii(jsRuntime, "patch"),
        1,
        [this, dispatcherPtr = dispatcherPtr, cachePtr = cachePtr](
          Runtime &jsRuntime,
          const Value &thisValue,
          const Value *arguments,
          size_t count
        ) -> Value {
          auto diff = statePtr->patch(jsRuntime, arguments[0]);

          // Send updated state to all subscribed callbacks
          dispatcherPtr->dispatchAll(jsRuntime, statePtr->get(jsRuntime), diff);

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
      
      if (prop == "subscribe") {
        return subscribe(jsRuntime);
      }
      
      if (prop == "patch") {
        return patch(jsRuntime);
      }
      
      return Value::undefined();
    }

    void set(Runtime &jsRuntime, const PropNameID& name, const Value& value) override {
      auto prop = name.utf8(jsRuntime);

      if (prop == "state") {
        auto diff = statePtr->set(jsRuntime, value);

        // Send updated state to all subscribed callbacks
        dispatcherPtr->dispatchAll(jsRuntime, statePtr->get(jsRuntime), diff);

        // Persist state into phone's disk cache
        cachePtr->write((statePtr->get(jsRuntime)).getString(jsRuntime).utf8(jsRuntime));
      }
    }
  };
}
