import { inject, provide, InjectionKey } from 'vue';
import { Enforcer } from 'casbin.js';

const AUTHORIZER_KEY: InjectionKey<Enforcer> = Symbol('casbinjs_authorizer');

const useAuthorizer = function <T extends Enforcer = Enforcer>(): T {
    const enforcer = inject<T>(AUTHORIZER_KEY);

    if (!enforcer) {
        throw new Error("Cannot inject Authorizer instance because it didn't exist");
    }

    return enforcer;
};

const provideAuthorizer = function (enforcer: Enforcer): void {
    provide(AUTHORIZER_KEY, enforcer);
};

export { provideAuthorizer, useAuthorizer, AUTHORIZER_KEY };
