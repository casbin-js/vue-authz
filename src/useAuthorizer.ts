import { inject, provide, InjectionKey } from 'vue';
import { Authorizer } from 'casbin.js';

const AUTHORIZER_KEY: InjectionKey<Authorizer> = Symbol('casbinjs_authorizer');

const useAuthorizer = function <T extends Authorizer = Authorizer>(): T {
    const authorizer = inject<T>(AUTHORIZER_KEY);

    if (!authorizer) {
        throw new Error("Cannot inject Authorizer instance because it didn't exist");
    }

    return authorizer;
};

const provideAuthorizer = function (authorizer: Authorizer): void {
    provide(AUTHORIZER_KEY, authorizer);
};

export { provideAuthorizer, useAuthorizer, AUTHORIZER_KEY };
