#ifndef OFFSTORE_H
#define OFFSTORE_H

#include <jsi/jsilib.h>
#include <jsi/jsi.h>
#include <ReactCommon/CallInvoker.h>

using namespace::facebook::react;
using namespace::facebook::jsi;
using namespace::std;

namespace offstore {
  void setup(Runtime& runtime, shared_ptr<CallInvoker> jsCallInvoker, string temporaryDirectory);
}

#endif /* OFFSTORE_H */
