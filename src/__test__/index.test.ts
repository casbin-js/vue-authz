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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        inject: {
            authorizer: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => createApp().use(plugin)).toThrowError('Please provide an authorizer instance to plugin.');
    });

    it('Throw Error when fake authorizer is provided.', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

    describe('when use customProperties option', () => {
        function addCustomApp(apiInNeed: string[]) {
            app = createApp(App).use(plugin, authorizer, {
                useGlobalProperties: true,
                customProperties: apiInNeed,
            });
            vm = app.mount(appRoot);
        }

        it("should have 'can' and 'cannot'", function () {
            addCustomApp(['can', 'cannot']);

            expect(vm.$can).toBeDefined();
            expect(vm.$cannot).toBeDefined();
            expect(vm.$authorizer).toBeDefined();
        });

        it("should have 'can', 'cannot', 'canAll' and 'canAny'", function () {
            addCustomApp(['can', 'cannot', 'canAll', 'canAny']);

            expect(vm.$can).toBeDefined();
            expect(vm.$cannot).toBeDefined();
            expect(vm.$canAll).toBeDefined();
            expect(vm.$canAny).toBeDefined();
            expect(vm.$authorizer).toBeDefined();
        });
    });
});
