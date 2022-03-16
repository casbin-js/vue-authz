"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
var casbin_1 = require("casbin");
var useEnforcer_1 = require("./useEnforcer");
var install = function (app, enforcer, options) {
    app.provide(useEnforcer_1.ENFORCER_KEY, enforcer);
    if (!enforcer || !(enforcer instanceof casbin_1.Enforcer)) {
        throw new Error('Please provide an enforcer instance to plugin.');
    }
    if (options) {
        if (options.useGlobalProperties) {
            app.config.globalProperties.$enforcer = enforcer;
            if (options.customProperties != null) {
                options.customProperties.forEach(function (propertyStr) {
                    var property = Object.getPrototypeOf(enforcer)[propertyStr];
                    if (property) {
                        var propertyKey = "$".concat(propertyStr);
                        Object.defineProperty(app.config.globalProperties, propertyKey, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: property,
                        });
                    }
                    else {
                        throw new Error("Invalid property: ".concat(propertyStr));
                    }
                });
            }
            else {
                app.config.globalProperties.$enforce = enforcer.enforceSync;
            }
        }
    }
};
exports.install = install;
