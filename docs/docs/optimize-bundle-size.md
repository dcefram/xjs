---
id: optimize-bundle-size
title: Optimizing Bundle Size
sidebar_title: Optimizing Bundle Size
---

There are times that you would want to minimize the size of your plugin, specially when you plan to serve it over the network. You can trim down the XJS part of your scripts by utilizing the ESM build, and directly importing individual modules.

When XJS 3.0 gets published to NPM, installing the ESM version of XJS should be as easy as doing an `npm i` or `yarn add`, but as of now, you'll have to build it yourself. Follow the [Building XJS](quick-start.md#building-xjs)

