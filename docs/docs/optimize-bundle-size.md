---
id: optimize-bundle-size
title: Optimizing Bundle Size
sidebar_label: Optimizing Bundle Size
---

There are times that you would want to minimize the size of your plugin, specially when you plan to serve it over the network. You can trim down the XJS part of your scripts by utilizing the ESM build, and directly importing individual modules.

When XJS 3.0 gets published to NPM, installing the ESM version of XJS should be as easy as doing an `npm i` or `yarn add`, but as of now, you'll have to build it yourself. Follow the [Building XJS tutorial](quick-start.md#building-xjs).

## The unoptimized, easy way

If you do not want to bother about bundle sizes, and just want to use XJS the straightforward way, but isn't a fan of UMD for whatever reason, like if you dislike polluting the window object/namespace, you can do this:

```javascript
import Xjs, { XjsTypes, Scene } from '@xsplit/xjs';

const xjs = new Xjs({ type: XjsTypes.Local });
const scene = new Scene(xjs);

scene.getByIndex(0).then(({ id }) => {
  console.log(id);
});

```

Almost all exported classes and objects are exposed through this entry file, so it should be easy to import what you need through `@xsplit/xjs`. 

However, you should take note that your bundler would most likley have a hard time tree shaking unused classes, as everything is imported once you import `@xsplit/xjs`.

## Importing individual modules

If the final bundle size of your plugin is important to you, then you'll have to import each module individually. Similar to the example above, the optimized way would be:

```javascript
import Xjs from '@xsplit/xjs/core/xjs';
import XjsTypes from '@xsplit/xjs/core/xjs/types';
import Scene from '@xsplit/xjs/core/xjs/scene';

const xjs = new Xjs({ type: XjsTypes.Local });
const scene = new Scene(xjs);

scene.getByIndex(0).then(({ id }) => {
  console.log(id);
});
```

That increases the number of lines, and the number of keys that you have to press, but this results to importing only what you need and use, thus helping your bundler to ignore the part of the framework that you are not using when bundling your plugin.
