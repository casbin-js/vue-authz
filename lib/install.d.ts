import { App } from 'vue';
import { Enforcer } from 'casbin';
export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: string[];
}
declare const install: (app: App, enforcer: Enforcer, options?: CasbinPluginOptions) => void;
export { install };
