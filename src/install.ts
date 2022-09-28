import { Authorizer } from 'casbin.js';
import { AUTHORIZER_KEY } from './useAuthorizer';
import { isVue3 } from 'vue-demi';

export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}

const install = function (app, authorizer: Authorizer, options?: CasbinPluginOptions) {
    const availableProperties = [
        'getPermission',
        'setPermission',
        'initEnforcer',
        'getEnforcerDataFromSvr',
        'setUser',
        'can',
        'cannot',
        'canAll',
        'canAny',
    ];

    app.provide(AUTHORIZER_KEY, authorizer);

    if (!authorizer || !(authorizer instanceof Authorizer)) {
        throw new Error('Please provide an authorizer instance to plugin.');
    }

    if (options) {
        // I cannot implement this because of the limitation of Vue.
        // If you have any idea, plz tell me.
        //
        // TODO: add autoload option when Authorizer in 'auto' mode is given.
        //
        // if (options.autoload) {
        //   if (authorizer.mode!=='auto'){
        //     throw new Error('autoload will only work on auto mode Authorizer. You don\'t need this.')
        //   }
        //
        //   if (!(options.autoload instanceof String)) {
        //     throw new Error('autoload option should have argument username:string')
        //   }
        //
        //   authorizer.setUser(options.autoload)
        // }

        if (options.useGlobalProperties) {
            const vueProperty = isVue3 ? app.config.globalProperties : app.prototype;
            vueProperty.$authorizer = authorizer;

            if (options.customProperties) {
                const targetProperties = availableProperties.filter((property: string) => {
                    return (options.customProperties as string[]).indexOf(property) !== -1;
                });

                targetProperties.forEach((propertyStr: string) => {

                    const property = Object.getPrototypeOf(authorizer)[propertyStr]
                    if (property) {
                        const propertyKey = `$${propertyStr}`
                        // app.config.globalProperties[propertyKey] = property;
                        Object.defineProperty(vueProperty, propertyKey, {
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
                vueProperty.$can = authorizer.can;
            }
        }
    }
};

export { install };
