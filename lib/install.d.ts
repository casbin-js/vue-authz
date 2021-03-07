import { App } from 'vue';
import { Authorizer } from 'casbin.js';
export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<String>;
}
declare const install: (app: App, authorizer: Authorizer, options?: CasbinPluginOptions | undefined) => void;
export { install };
