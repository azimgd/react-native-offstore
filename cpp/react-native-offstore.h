#ifndef OFFSTORE_H
#define OFFSTORE_H

#include <jsi/jsi.h>
using namespace::facebook::jsi;
using namespace::std;

namespace offstore {
  void setup(Runtime& runtime, string temporaryDirectory);
}

#endif /* OFFSTORE_H */
