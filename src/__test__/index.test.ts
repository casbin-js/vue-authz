import { newEnforcer } from 'casbin.js';
import { defineComponent, createApp } from 'vue';
import { AUTHORIZER_KEY, useAuthorizer } from '../useAuthorizer';
import { basicModelStr } from './util';
import plugin from '../index';
import { StringAdapter } from 'casbin';

const respData = JSON.stringify({
    m: basicModelStr,
    p: [
        ['p', 'alice', 'data1', 'read'],
        ['p', 'alice', 'data2', 'write'],
    ],
});

describe('Enforcer plugin test', () => {
    let enforcer;
    let vm;
    let app;
    let appRoot;

    const App = defineComponent({
        inject: {
            enforcer: {
                // @ts-ignore
                from: AUTHORIZER_KEY,
            },
        },
        render() {
            return this.enforcer.enforce("alice", "data1", "read");
        },
    });

    beforeEach(async () => {
        let a = new StringAdapter("p, alice, data1, read\n" +
            "p, alice, data2, read\n" +
            "p, alice, data2, write\n" +
            "p, bob, data2, write")
        enforcer = await newEnforcer("[request_definition]\n" +
            "r = sub, obj, act\n" +
            "\n" +
            "[policy_definition]\n" +
            "p = sub, obj, act\n" +
            "\n" +
            "[policy_effect]\n" +
            "e = some(where (p.eft == allow))\n" +
            "\n" +
            "[matchers]\n" +
            "m = r.sub == p.sub && r.obj == p.obj && r.act == p.act", a);
        appRoot = window.document.createElement('div');
    });

    it('Throw Error when authorizer is not provided.', () => {
        // @ts-ignore
        expect(() => createApp().use(plugin)).toThrowError('Please provide an enforcer instance to plugin.');
    });

    it('Throw Error when fake authorizer is provided.', () => {
        // @ts-ignore
        expect(() => createApp().use(plugin, {})).toThrowError('Please provide an enforcer instance to plugin.');
    });

    describe('by default', () => {
        beforeEach(() => {
            app = createApp(App).use(plugin, enforcer);
            vm = app.mount(appRoot);
        });

        it('should not have globalProperties', () => {
            expect(vm.$enforcer).toBeFalsy();
            expect(vm.$enforce).toBeFalsy();
        });

        it('should have enforcer', function () {
            expect(vm.enforcer).toEqual(enforcer);
        });
    });

    describe('when use useGlobalProperties option', () => {
        beforeEach(() => {
            app = createApp(App).use(plugin, enforcer, {
                useGlobalProperties: true,
            });
            vm = app.mount(appRoot);
        });

        it('should have globalProperties', () => {
            expect(vm.$enforce).toBeDefined();
        });

        it('should have enforcer', function () {
            expect(vm.enforcer).toEqual(enforcer);
        });
    });

    describe('when use customProperties option', () => {
        function addCustomApp(apiInNeed: string[]) {
            app = createApp(App).use(plugin, enforcer, {
                useGlobalProperties: true,
                customProperties: apiInNeed,
            });
            vm = app.mount(appRoot);
        }

        it("should have 'addPolicy' and 'removePolicy'", function() {
            addCustomApp(['addPolicy','removePolicy'])

            expect(vm.$addPolicy).toBeDefined()
            expect(vm.$removePolicy).toBeDefined()
            expect(vm.$enforcer).toBeDefined()
        });

        it("should have 'addPolicy', 'removePolicy' and 'enforceEx'", function() {
            addCustomApp(['addPolicy','removePolicy', 'enforceEx'])

            expect(vm.$addPolicy).toBeDefined()
            expect(vm.$removePolicy).toBeDefined()
            expect(vm.$enforceEx).toBeDefined()
            expect(vm.$enforcer).toBeDefined()
        });
    });
});
