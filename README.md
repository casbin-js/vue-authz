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
import { Authorizer } from 'casbin.js';

const permission = {
    "read": ['data1', 'data2'],
    "write": ['data1']
}

// Run casbin.js in manual mode, which requires you to set the permission manually.
const authorizer = new casbinjs.Authorizer("manual");

authorizer.setPermission(permission);

createApp()
    .use(CasbinPlugin, authorizer, {
        useGlobalProperties: true
    }).mount('#app');
```

After that, you can use `$authorizer` and `$can` in every component.

```vue

<template>
    <p
        v-if='$can("read","post")'
    >
        Post content.
    </p>
</template>
```

`useGlobalProperties` will mount `$can` and `$authorizer` on every component. Sometimes, you may want to use some other
function as `$can`. In this condition, you can
use [provide/inject API](https://v3.vuejs.org/guide/component-provide-inject.html) in Vue 3 to get the `$authorizer`.

```typescript
createApp()
    .use(CasbinPlugin, authorizer)
    .mount('#app');
```

And inject it with `AUTHORIZER_KEY`

```vue

<template>
    <p v-if="$whatyouwant.can('read', 'Post')">
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

You can also use `useAuthorizer` function.

```vue

<template>
    <p v-if="whatyouwant.can('read', 'Post')">
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
