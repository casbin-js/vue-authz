import { InjectionKey } from 'vue';
import { Enforcer } from 'casbin';
declare const ENFORCER_KEY: InjectionKey<Enforcer>;
declare const useEnforcer: <T extends Enforcer = Enforcer>() => T;
declare const provideEnforcer: (enforcer: Enforcer) => void;
export { provideEnforcer, useEnforcer, ENFORCER_KEY };
