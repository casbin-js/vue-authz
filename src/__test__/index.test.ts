import { Authorizer } from 'casbin.js';
import { defineComponent } from 'vue';
import { AUTHORIZER_KEY } from '../useAuthorizer';

describe('Enforcer plugin test', () => {
    let app;
    let authorizer;
    const App = defineComponent({
        inject: {
            authorizer: { from: AUTHORIZER_KEY }
        },
        render() {
            return this.authorizer
        }
    });
});