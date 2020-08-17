---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
---

> **NOTE:** This version of XJS is a pre-alpha version and is under heavy development. If you wish to use a stable version, please use [XJS 2.0](https://xjsframework.github.io/).

This version of XJS isn't yet published in NPM, and thus, you'll have to build and link it first if you're to use it on your project. Please follow through the build step, and then we'll work our way through using XJS for something remotely useful.

## Building XJS

You can build a UMD or ESM version of XJS easily as we already have scripts for just that. Just follow through this initial step before you begin experimenting with this pre-alpha release.

1. First off, clone this repo: https://github.com/dcefram/xjs.

   > _Unfortunately, that repository is hosted on my personal Github account. This is temporary and I look forward to moving that repository to the [xjsframework Github org](https://github.com/xjsframework)._

2. Install dependencies by executing `npm i` or `yarn` inside `xjs` folder.

3. There are 3 ways to build XJS:
   - If you prefer Yarn, execute `yarn build:link:yarn`
   - If you prefer Npm, execute `npm run build:link`
   - If you prefer UMD builds rather than ESM builds, execute `npm run build:umd`

So what's the difference between the 3 ways to build XJS?

Basically, if you rather _import_ XJS to your webpage using normal `<script>` tags, then you should build the UMD bundle (`npm run build:umd`). That would generate a single JS file that you can add to your webpage.

If you are fancy, and would prefer to use ESM builds because you plan to write your plugin with _modern_ tooling, then you should either execute `npm run build:link` or if you prefer `yarn`, just execute `yarn build:link:yarn`.

After doing so, execute `npm link @xsplit/xjs` or `yarn link @xsplit/xjs` in your project's root folder (Root folder = wherever your project's package.json is located).

### Difference between UMD and ESM builds

The difference is pretty straightforward. With the UMD build, an `Xjs` object would be attached to the `window` namespace which contains almost all classes in XJS Framework. While for ESM builds, you'll have to individually import each class that you are going to use.

## Creating your first Source Plugin

For a sample plugin, we'll aim to create a source plugin that would display if we're currently streaming/recording or not. Not really a useful source plugin, but that should do.

![Sample Source Plugin](/img/xjs-test-app-1.gif)

First of all, we'll assume that you already built and linked xjs in your dev system (See step 3 of [Building XJS section](#building-xjs)). We'll follow through the UMD version in this quickstart. Copy the xjs.umd.js to your plugin's folder, and we'll just add it up in our index.html file.
