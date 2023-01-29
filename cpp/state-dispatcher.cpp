#include <jsi/jsi.h>
#include "json.hpp"
#include <map>

using namespace::std;
using namespace::facebook::jsi;
using namespace::nlohmann;

namespace offstore {
  class NativeStateDispatcher {

  public:
    explicit NativeStateDispatcher() {}
    virtual ~NativeStateDispatcher() {}

  protected:
    map<string, shared_ptr<Function>> callbacks;
    
  public:
    void subscribe(Runtime &jsRuntime, string callbackPath, Function callbackFn) {
      callbacks[callbackPath] = make_shared<Function>(move(callbackFn));
    }

    void dispatchAll(Runtime &jsRuntime, Value payload, json diff) {
      map<string, shared_ptr<Function>>::iterator cbIterator;
      json::iterator jsIterator;

      for (jsIterator = diff.begin(); jsIterator != diff.end(); ++jsIterator) {
        for (cbIterator = callbacks.begin(); cbIterator != callbacks.end(); cbIterator++) {
          string diffPath = jsIterator.value().at("path");
          string cbPath = cbIterator->first;
          
          if (diffPath.find(cbPath) != std::string::npos) {
            cbIterator->second->call(jsRuntime, payload, jsIterator.value().dump());
          }
        }
      }
    }
  };
}
