import { App } from 'vue';
import { Authorizer } from 'casbin.js';
declare const install: (app: App, authorizer: Authorizer, options?: any) => void;
export { install };
