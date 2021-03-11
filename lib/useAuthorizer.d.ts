import { InjectionKey } from 'vue';
import { Authorizer } from 'casbin.js';
declare const AUTHORIZER_KEY: InjectionKey<Authorizer>;
declare const useAuthorizer: <T extends Authorizer = Authorizer>() => T;
declare const provideAuthorizer: (authorizer: Authorizer) => void;
export { provideAuthorizer, useAuthorizer, AUTHORIZER_KEY };
