#include <jsi/jsi.h>
#include "state-object.cpp"

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeHostObject : public HostObject {

  public:
    explicit NativeHostObject() {
      statePtr = make_shared<NativeStateObject>();
    }
    virtual ~NativeHostObject() {}

  protected:
    std::shared_ptr<NativeStateObject> statePtr;
    
  public:
    Value get(Runtime &runtime, const PropNameID &name) override {
      auto prop = name.utf8(runtime);
      
      if (prop == "state") {
        return statePtr->get(runtime);
      }
      
      return Value::undefined();
    }

    void set(Runtime& runtime, const PropNameID& name, const Value& value) override {
      auto prop = name.utf8(runtime);

      if (prop == "state") {
        statePtr->set(runtime, value);
      }
    }
  };
}
