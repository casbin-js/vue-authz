import { App } from 'vue';
import { Enforcer, newEnforcer} from 'casbin.js';
import { AUTHORIZER_KEY } from './useAuthorizer';

export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}

const install = function (app: App, enforcer: Enforcer, options?: CasbinPluginOptions) {
    if (options == undefined){
        options = {
            useGlobalProperties: false,
        }
    }
    const availableProperties = [
        'addPolicy',
        'removePolicy',
        'enforceEx',
        'updatePolicy'
    ];

    app.provide(AUTHORIZER_KEY, enforcer);

    if (!Enforcer || !(enforcer instanceof Enforcer)) {
        throw new Error('Please provide an enforcer instance to plugin.');
    }

    if (options) {
        if (options.useGlobalProperties) {
            app.config.globalProperties.$enforcer = enforcer;

            if (options.customProperties) {
                const targetProperties = availableProperties.filter((property: string) => {
                    return (options.customProperties as string[]).indexOf(property) !== -1;
                });

                targetProperties.forEach((propertyStr: string) => {
                    const property = Object.getPrototypeOf(enforcer)[propertyStr]
                    if (property) {
                        const propertyKey = `$${propertyStr}`
                        // app.config.globalProperties[propertyKey] = property;
                        Object.defineProperty(app.config.globalProperties,propertyKey,{
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: property
                        })
                    } else {
                        throw new Error('Unexpected Error.');
                    }
                });
            } else {
                app.config.globalProperties.$enforce = enforcer.enforce;
                app.config.globalProperties.$enforce.add = async function (p){
                    if(typeof p[0] === 'string'){
                        return await enforcer.addPolicy(...p);
                    }
                    return await enforcer.addPolicies(p);
                }
                app.config.globalProperties.$enforce.remove = async function (p){
                    if(typeof p[0] === 'string'){
                        return await enforcer.removePolicy(...p);
                    }
                    return await enforcer.removePolicies(p);
                }
                app.config.globalProperties.$enforce.update = async function (oldp,newp){
                        return await enforcer.updatePolicy(oldp,newp);
                }
            }
        }
    }
};

export { install };
