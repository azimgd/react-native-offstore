#include <jsi/jsi.h>
#include "state-object.cpp"
#include "state-dispatcher.cpp"

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeHostObject : public HostObject {

  public:
    explicit NativeHostObject() {
      statePtr = make_shared<NativeStateObject>();
      dispatcherPtr = make_shared<NativeStateDispatcher>();
    }
    virtual ~NativeHostObject() {}

  protected:
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
          dispatcherPtr->dispatchAll(runtime, statePtr->get(runtime));
        }
      }
    }
  };
}
