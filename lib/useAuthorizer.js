"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHORIZER_KEY = exports.useAuthorizer = exports.provideAuthorizer = void 0;
var vue_1 = require("vue");
var AUTHORIZER_KEY = Symbol('casbinjs_authorizer');
exports.AUTHORIZER_KEY = AUTHORIZER_KEY;
var useAuthorizer = function () {
    var authorizer = vue_1.inject(AUTHORIZER_KEY);
    if (!authorizer) {
        throw new Error("Cannot inject Authorizer instance because it didn't exist");
    }
    return authorizer;
};
exports.useAuthorizer = useAuthorizer;
var provideAuthorizer = function (authorizer) {
    vue_1.provide(AUTHORIZER_KEY, authorizer);
};
exports.provideAuthorizer = provideAuthorizer;
