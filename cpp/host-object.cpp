#include <jsi/jsi.h>

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeHostObject : public HostObject {

  public:
    explicit NativeHostObject() {}
    virtual ~NativeHostObject() {}

  protected:
    std::shared_ptr<NativeState> nativeState;
    
  public:
    Value get(Runtime &runtime, const PropNameID &name) override {
      auto prop = name.utf8(runtime);
      
      if (prop == "state") {
        return Value::null();
      }
      
      return Value::undefined();
    }

    void set(Runtime& runtime, const PropNameID& name, const Value& value) override {
    }
  };
}
