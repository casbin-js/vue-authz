/**
 * @jest-environment jsdom
 */

import { defineComponent, createApp } from 'vue';
import { ENFORCER_KEY } from '../useEnforcer';
import plugin from '../index';
import { getEnforcer } from './util';

describe('Enforcer plugin test', () => {
    let vm;
    let app;
    let appRoot;
    let enforcer;

    const App = defineComponent({
        inject: {
            enforcer: {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                from: ENFORCER_KEY,
            },
        },
        render() {
            return null;
        },
    });

    beforeAll(async () => {
        enforcer = await getEnforcer();
    });

    beforeEach(() => {
        appRoot = document.createElement('div');
    });

    describe('error init', () => {
        it('Throw Error when enforcer is not provided.', () => {
            expect(() => createApp({}).use(plugin)).toThrowError('Please provide an enforcer instance to plugin.');
        });

        it('Throw Error when invalid enforcer is provided.', () => {
            expect(() => createApp({}).use(plugin, {})).toThrowError('Please provide an enforcer instance to plugin.');
        });
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
            expect(vm.$enforcer).toBeDefined();
            expect(vm.$enforce).toBeDefined();
        });

        it('should have authorizer', function () {
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

        it("should have 'enforceEx' and 'enforceSync'", function () {
            addCustomApp(['enforceEx', 'enforceSync']);

            expect(vm.$enforcer).toBeDefined();
            expect(vm.$enforce).toBeUndefined();
            expect(vm.$enforceEx).toBeDefined();
            expect(vm.$enforceSync).toBeDefined();
        });

        it('should throw error when met invalid property', function () {
            expect(() => {
                addCustomApp(['invalid']);
            }).toThrowError('Invalid property: invalid');
        });
    });
});
