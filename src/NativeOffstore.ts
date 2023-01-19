import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setup(): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('Offstore');
