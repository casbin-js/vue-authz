import { App } from 'vue';
import { Authorizer } from 'casbin.js';
export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}
declare const install: (app: App, authorizer: Authorizer, options?: CasbinPluginOptions) => void;
export { install };
