#ifdef __cplusplus
#import "react-native-offstore.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNOffstoreSpec.h"

@interface Offstore : NSObject <NativeOffstoreSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Offstore : NSObject <RCTBridgeModule>
#endif

@end
