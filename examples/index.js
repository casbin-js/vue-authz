import { createApp } from 'vue';
import App from './App.vue';
import   useAuthorizer  from "../src/index"
import { MemoryAdapter, newEnforcer } from 'casbin.js';

const a = new MemoryAdapter("p, alice, data1, read\n" +
    "p, alice, data2, read\n" +
    "p, alice, data2, write\n" +
    "p, bob, data2, write")
const enforcer = new newEnforcer("[request_definition]\n" +
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
App.use(useAuthorizer,enforcer)

createApp(App).mount('#app');