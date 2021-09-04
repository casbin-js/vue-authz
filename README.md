# vue-authz

This package allows you to integrate [Casbin.js](https://github.com/casbin/casbin.js) (An authorization library) with
your Vue 3 application.

## Installation

```bash
npm install vue-authz
# or
yarn add vue-authz
# or
pnpm add vue-authz
```

## Getting started

This package provides a Vue plugin, several hooks for
new [Vue Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)

### The plugin

```typescript
import { createApp } from 'vue';
import CasbinPlugin from 'vue-authz';
import { newEnforcer, MemoryAdapter } from 'casbin.js';

const a = new MemoryAdapter("p, alice, data1, read\n" +
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
    "m = r.sub == p.sub && r.obj == p.obj && r.act == p.act");

const enforce = new casbinjs.enforcer.enforce("alice", "data1", "read");

createApp()
    .use(CasbinPlugin, enforce, {
        useGlobalProperties: true
    }).mount('#app');
```

After that, you can use `$enforce` in every component.

```vue

<template>
    <p v-if="$whatyouwant.enforce('alice', 'data2', 'write')">
        Post content.
    </p>
</template>
```

`useGlobalProperties` will mount `$enforce` on every component

```typescript
createApp()
    .use(CasbinPlugin, enforce)
    .mount('#app');
```

And inject it with `AUTHORIZER_KEY`

```vue

<template>
    <p v-if="$whatyouwant.enforce('alice', 'data2', 'write')">
        Post content.
    </p>
</template>

<script>
import { AUTHORIZER_KEY } from 'vue-authz';

export default {
    inject: {
        $whatyouwant: { from: AUTHORIZER_KEY }
    }
}
</script>
```

You can also use `enforce` function.

```vue

<template>
    <p v-if="whatyouwant.enforce('alice', 'data2', 'write')">
        Post content.
    </p>
</template>

<script>
import { useAuthorizer } from 'vue-authz';

export default {
    setup() {
        const { whatyouwant } = useAuthorizer();
        return {
            whatyouwant
        };
    }
}
</script>
```

## License

This project is licensed under the [Apache 2.0 license](LICENSE).

## Contact

If you have any issues or feature requests, please contact us. PR is welcomed.

- https://github.com/casbin.js/vue-authz/issues
- hsluoyz@gmail.com
- Tencent QQ group: [546057381](//shang.qq.com/wpa/qunwpa?idkey=8ac8b91fc97ace3d383d0035f7aa06f7d670fd8e8d4837347354a31c18fac885)