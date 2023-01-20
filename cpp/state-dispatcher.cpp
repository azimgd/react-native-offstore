#include <jsi/jsi.h>
#include "json.hpp"

using namespace::std;
using namespace::facebook::jsi;

namespace offstore {
  class NativeStateDispatcher {

  public:
    explicit NativeStateDispatcher() {}
    virtual ~NativeStateDispatcher() {}

  protected:
    map<string, shared_ptr<Function>> callbacks;
    
  public:
    void subscribe(Runtime& runtime, string callbackId, Function callbackFn) {
      callbacks[callbackId] = make_shared<Function>(move(callbackFn));
    }

    void dispatchAll(Runtime& runtime, Value payload) {
      map<string, shared_ptr<Function>>::iterator iterator;
      
      for (iterator = callbacks.begin(); iterator != callbacks.end(); iterator++) {
        iterator->second->call(runtime, payload);
      }
    }
  };
}
