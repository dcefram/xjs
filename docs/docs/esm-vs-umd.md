---
id: esm-vs-umd
title: ESM vs UMD
sidebar_label: ESM vs UMD
---

To start things off, we'd like to mention that we recommend people use the ESM version which is published in NPM. With that said, there are some valid use-cases for the UMD version, which is why we provide that option too. Here are a couple of differences between the two:

|                      | ESM                                                          | UMD                                                          |
| -------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| Installing XJS       | Add XJS to your project through `npm` or `yarn`              | Add XJS to your site by simply adding a script tag that points to the UMD build |
| Using XJS            | Import individual XJS modules depending on what you need     | The whole XJS Framework is added to the browser's `window` object |
| Building the Project | You'll need a bundler to bundle your code along with the modules that you imported | None                                                         |

## Why you might not want to use the UMD version

Now, the main drawback of the UMD build is that it would cause your plugin to load the whole XJS Framework on page load. Although this might not be a big issue, it would be a lot better if you only load up the parts of XJS Framework that your plugin actually use, and trim down the size of your plugin's total size.

This could be a big deal if your plugin is hosted over the network. Minimizing the assets that you load over network could mean faster page loading time.

The UMD version also adds the XJS Framework to the browser's `window` object, which is something that not everyone would welcome with open arms to the point that they have a negative term for it: global namespace pollution.

## Why you might want to use the UMD version

If you want to spin up a quick plugin, the UMD version is the most frictionless solution. You can take any existing site, and add a script tag that adds in XJS Framework. This becomes easier once we host the umd version on a CDN. Heck, you could even create a plugin through codepen with this.

So I guess you got an idea where the UMD version makes sense: when you're trying to quickly put together a prototype of your plugin.



## Conclusion

Moving forward, this documentation would only contain the ESM version for the code samples. In general, if you're trying to figure out the UMD version of the code sample, you can simply ignore the `import` statements, and just prefix the modules with the `window.Xjs` object. Example:

```javascript
// ESM
import Xjs from 'xjs-framework/core/xjs';
import App from 'xjs-framework/core/app';
import appProps from 'xjs-framework/props/app-props';

const xjs = new Xjs();
const app = new App(xjs);
app.getProperty(appProps.audioDevices).then(devices => console.log(devices));

// UMD
const xjs = new window.Xjs();
const app = new window.Xjs.App(xjs);
app.getProperty(window.Xjs.AppProps.audioDevices).then(devices => console.log(devices));
```

General rule is that you should just substitute the module's filename with `Xjs.<CamelCase>` format, wherein the kebab-case filenames like `app-props` and `item-props` would be exposed as `AppProps` in the UMD version.