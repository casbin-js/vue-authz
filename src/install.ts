import { App } from 'vue';
import { Enforcer } from 'casbin';
import { ENFORCER_KEY } from './useEnforcer';

export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}

const install = function (app: App, enforcer: Enforcer, options?: CasbinPluginOptions) {
    app.provide(ENFORCER_KEY, enforcer);

    if (!enforcer || !(enforcer instanceof Enforcer)) {
        throw new Error('Please provide an enforcer instance to plugin.');
    }

    if (options) {
        if (options.useGlobalProperties) {
            app.config.globalProperties.$enforcer = enforcer;

            if (options.customProperties != null) {
                options.customProperties.forEach((propertyStr: string) => {
                    const property = Object.getPrototypeOf(enforcer)[propertyStr];
                    if (property) {
                        const propertyKey = `$${propertyStr}`;
                        Object.defineProperty(app.config.globalProperties, propertyKey, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: property,
                        });
                    } else {
                        throw new Error(`Invalid property: ${propertyStr}`);
                    }
                });
            } else {
                app.config.globalProperties.$enforce = enforcer.enforceSync;
            }
        }
    }
};

export { install };
