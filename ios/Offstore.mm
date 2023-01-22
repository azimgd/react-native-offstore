#import "Offstore.h"
#import <ReactCommon/RCTTurboModule.h>
#import <jsi/jsi.h>
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>

using namespace facebook;

@implementation Offstore

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_MODULE()

- (NSNumber *)setup {
  RCTBridge* bridge = [RCTBridge currentBridge];
  RCTCxxBridge* cxxBridge = (RCTCxxBridge*)bridge;
  
  if (cxxBridge == nullptr) {
    return @NO;
  }

  auto runtime = (jsi::Runtime*)cxxBridge.runtime;
  if (runtime == nullptr) {
    return @NO;
  }
  
  NSString *temporaryDirectory = NSTemporaryDirectory();
  offstore::setup(*runtime, bridge.jsCallInvoker, [temporaryDirectory UTF8String]);

  return @YES;
}

// Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeOffstoreSpecJSI>(params);
}
#endif

@end
