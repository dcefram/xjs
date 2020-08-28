---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

> **NOTE:** This version of XJS is a pre-alpha version and is under heavy development. If you wish to use a stable version, please use [XJS 2.0](https://xjsframework.github.io/).

## Installing Xjs

XJS Framework is published in NPM, so installing it to your project should be as easy as:

```bash
# using npm
npm i xjs-framework@alpha

# using yarn
yarn add xjs-framework@alpha
```

This assumes that you are going to use Xjs by importing it to your project as a module.

```javascript
import Xjs from 'xjs-framework';
```

We also provide a UMD version hosted via a CDN that you can directly include by adding it on a script tag (@TODO: Replace with actual URL)

```html
<script src="https://cdn.to.xjs"></script>
```

There are a few differences between the UMD build versus the build that you would get through NPM which is [detailed in this page](esm-vs-umd.md).