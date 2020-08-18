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

First of all, we'll assume that you already built and linked xjs in your dev system (See step 3 of [Building XJS section](#building-xjs)). We'll follow through the UMD version in this sample plugin. Copy the xjs.umd.js to your plugin's folder, and we'll just add it up in our index.html file.

Here's how our index.html should look like:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Are We Live Yet</title>
  </head>
  <body>
    <style>
      div {
        background-color: black;
        color: white;
        text-align: center;
      }

      body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        padding: 0;
      }

      p {
        color: rgb(167, 167, 167);
      }

      .yes {
        color: rgb(0, 255, 0);
      }
    </style>

    <div>
      <h1>Are We Live Yet?</h1>
      <p id="output">No, not quite</p>
    </div>

    <script src="xjs.umd.js"></script>
    <script src="plugin.js"></script>
  </body>
</html>
```

The important part of the markup above is the `<p id="output">` tag, as that's where would would output the text to inform the user if they're already streaming or not. The other 2 important parts are the script tags, one is to include the built Xjs file, and the other is a JS file that we're going to write the logic of the whole plugin.

Here's the contents of our `plugin.js` file:

```javascript
const output = document.getElementById('output');
const xjs = new window.Xjs();
const events = new window.Xjs.Events(xjs);

events.on('StreamStart', () => {
  output.textContent = 'Yes we are!';
  output.classList.add('yes');
});

events.on('StreamEnd', () => {
  output.textContent = 'No, not quite';
  output.classList.remove('yes');
});
```

With the UMD version, the Xjs object is exposed to the window namespace.

We first have to initialize an Xjs instance. For now, it's enough to know that an Xjs instance is the _interface_ you need for you to talk with XSplit Broadcaster. If you want to dig deeper, best read its [documentation here]()(TODO).

Unlike the previous Xjs framework, where an xjs instance is a singleton, in 3.0, we would need to pass the xjs instance on each class that we want to make use of.

In this case, we want to make use of the Events class, for us to _listen_ to events thrown by XSplit Broadcaster. You'll notice this in line 3, where we passed the xjs instance when initializing the Events instance.

_Why?_ you might ask.

To put it short, it's because without it, the Events' instance would not know who to _talk_ to. If you read the detailed explanation of the Xjs instance linked earlier, you would notice that the Xjs instance does not necessarily mean the current local XSplit Broadcaster where your plugin is running on.

Anyways, that's not a topic for a _quick start_ document. Let's leave it for another page.

To recap, when initializing a class provided by the Xjs framework, we should always pass in an xjs instance:

```javascript
const xjs = new window.Xjs();
const events = new window.Xjs.Events(xjs);
```

With that done, you can now listen to events emitted by XSplit Broadcaster. We'll have an extensive list of possible events that XSplit Broadcaster could emit, but that is still under works. Just know that we tried to avoid too much abstraction in this end, with the objective of allowing you, the developer, on making use of all the events emitted by XSplit Broadcaster even if the Xjs team does not release a new Xjs version.

We listen to events using the `on` method:

```javascript
events.on('StreamStart', () => {
  output.textContent = 'Yes we are!';
  output.classList.add('yes');
});

events.on('StreamEnd', () => {
  output.textContent = 'No, not quite';
  output.classList.remove('yes');
});
```

Once you're done with this, you can simply drag-and-drop the index.html file to XSplit Broadcaster.
