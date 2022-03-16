"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENFORCER_KEY = exports.useEnforcer = exports.provideEnforcer = void 0;
var vue_1 = require("vue");
var ENFORCER_KEY = Symbol('casbin_enforcer');
exports.ENFORCER_KEY = ENFORCER_KEY;
var useEnforcer = function () {
    var enforcer = (0, vue_1.inject)(ENFORCER_KEY);
    if (!enforcer) {
        throw new Error("Cannot inject Enforcer instance because it didn't exist");
    }
    return enforcer;
};
exports.useEnforcer = useEnforcer;
var provideEnforcer = function (enforcer) {
    (0, vue_1.provide)(ENFORCER_KEY, enforcer);
};
exports.provideEnforcer = provideEnforcer;
