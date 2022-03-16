import { inject, provide, InjectionKey } from 'vue';
import { Enforcer } from 'casbin';

const ENFORCER_KEY: InjectionKey<Enforcer> = Symbol('casbin_enforcer');

const useEnforcer = function <T extends Enforcer = Enforcer>(): T {
    const enforcer = inject<T>(ENFORCER_KEY);

    if (!enforcer) {
        throw new Error("Cannot inject Enforcer instance because it didn't exist");
    }

    return enforcer;
};

const provideEnforcer = function (enforcer: Enforcer): void {
    provide(ENFORCER_KEY, enforcer);
};

export { provideEnforcer, useEnforcer, ENFORCER_KEY };
