import { Authorizer } from 'casbin.js';
import { defineComponent, createApp } from 'vue';
import { AUTHORIZER_KEY, useAuthorizer } from '../useAuthorizer';
import { basicModelStr } from './util';
import plugin from '../index';

const respData = JSON.stringify({
    m: basicModelStr,
    p: [
        ['p', 'alice', 'data1', 'read'],
        ['p', 'alice', 'data2', 'write'],
    ],
});

describe('Enforcer plugin test', () => {
    let authorizer;
    let vm;
    let app;
    let appRoot;

    const App = defineComponent({
        inject: {
            authorizer: {
                // @ts-ignore
                from: AUTHORIZER_KEY,
            },
        },
        render() {
            return this.authorizer.can('write', 'data2');
        },
    });

    beforeEach(async () => {
        authorizer = new Authorizer('auto', { endpoint: 'something' });
        await authorizer.initEnforcer(respData);
        authorizer.user = 'alice';
        appRoot = window.document.createElement('div');
    });

    it('Throw Error when authorizer is not provided.', () => {
        // @ts-ignore
        expect(() => createApp().use(plugin)).toThrowError('Please provide an authorizer instance to plugin.');
    });

    it('Throw Error when fake authorizer is provided.', () => {
        // @ts-ignore
        expect(() => createApp().use(plugin, {})).toThrowError('Please provide an authorizer instance to plugin.');
    });

    describe('by default', () => {
        beforeEach(() => {
            app = createApp(App).use(plugin, authorizer);
            vm = app.mount(appRoot);
        });

        it('should not have globalProperties', () => {
            expect(vm.$authorizer).toBeFalsy();
            expect(vm.$can).toBeFalsy();
        });

        it('should have authorizer', function () {
            expect(vm.authorizer).toEqual(authorizer);
        });
    });

    describe('when use useGlobalProperties option', () => {
        beforeEach(() => {
            app = createApp(App).use(plugin, authorizer, {
                useGlobalProperties: true,
            });
            vm = app.mount(appRoot);
        });

        it('should have globalProperties', () => {
            expect(vm.$authorizer).toBeDefined();
            expect(vm.$can).toBeDefined();
        });

        it('should have authorizer', function () {
            expect(vm.authorizer).toEqual(authorizer);
        });
    });
});
