import { App } from 'vue';
import { Authorizer } from 'casbin.js';
import { AUTHORIZER_KEY } from './useAuthorizer';

export interface CasbinPluginOptions {
    useGlobalProperties?: boolean;
    customProperties?: Array<string>;
}

const install = function (app: App, authorizer: Authorizer, options?: CasbinPluginOptions) {
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
            app.config.globalProperties.$authorizer = authorizer;

            if (options.customProperties) {
                const targetProperties = availableProperties.filter((property: string) => {
                    return (options.customProperties as Array<string>).indexOf(property) !== -1;
                });

                targetProperties.forEach((propertyStr: string) => {
                    const property = Object.getOwnPropertyDescriptor(authorizer, `${propertyStr}`);
                    if (property) {
                        app.config.globalProperties[`$${propertyStr}`] = property.value;
                    } else {
                        throw new Error('Unexpected Error.');
                    }
                });
            } else {
                app.config.globalProperties.$can = authorizer.can;
            }
        }
    }
};

export { install };
