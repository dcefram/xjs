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
    
    > *Unfortunately, that repository is hosted on my personal Github account. This is temporary and I look forward to moving that repository to the [xjsframework Github org](https://github.com/xjsframework).*
  
2. Install dependencies by executing `npm i` or `yarn` inside `xjs` folder.

3. There are 3 ways to build XJS:
    - If you prefer Yarn, execute `yarn build:link:yarn`
    - If you prefer Npm, execute `npm run build:link`
    - If you prefer UMD builds rather than ESM builds, execute `npm run build:umd`

So what's the difference between the 3 ways to build XJS? 

Basically, if you rather *import* XJS to your webpage using normal `<script>` tags, then you should build the UMD bundle (`npm run build:umd`). That would generate a single JS file that you can add to your webpage.

If you are fancy, and would prefer to use ESM builds because you plan to write your plugin with *modern* tooling, then you should either execute `npm run build:link` or if you prefer `yarn`, just execute `yarn build:link:yarn`. 

After doing so, execute `npm link @xsplit/xjs` or `yarn link @xsplit/xjs` in your project's root folder (Root folder = wherever your project's package.json is located).

### Difference between UMD and ESM builds

The difference is pretty straightforward. With the UMD build, an `Xjs` object would be attached to the `window` namespace which contains almost all classes in XJS Framework. While for ESM builds, you'll have to individually import each class that you are going to use.

## Creating your first Plugin

Awesome, so with that aside, let us try to build something out of this. In this Quick Start, we'll not show any specific popular UI frameworks even though I'm tempted to. But chances are that you're going to use a framework with fancy tooling built-in for building and bundling your web app, so in this quick start, I'll be using [ParcelJS](https://parceljs.org/) for bundling, but you can safely ignore that if you're using a UI framework like Vue or React that already has all that shinazz setup.

Oh, if you're planning to use the UMD version, just follow along and we'll just have a small section later with some code samples to further explain the difference on using the ESM build versus UMD.

We'll also show how to quickly create a source plugin and an extension plugin. Oh, by the way, I expect that you have a copy of XSplit Broadcaster in your system to test the plugin out. If you're not sure what is XSplit Broadcaster, then I'm not sure why you're reading through this documentation.

### Let's create a source plugin!

> TODO: Insert GIF here about the plugin that we're planning to make... Probably just copy the same plugin used in 2.0's quick start, seems simple enough to me :)
