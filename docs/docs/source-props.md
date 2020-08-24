---
id: source-props
title: Custom Source Property Window
sidebar_label: Custom Source Property Window
---

The source properties window is where you expose different controls to configure your plugin. In other words, it's where you place your plugin settings. This article details how to use the framework to layout the window, and how the properties window communicates with the plugin.

## Setting it up

You'll need to use a custom HTML page if you want your plugin to have a custom source properties window. By default, your plugin would use the generic properties window for HTML sources. To override that, you'll have to declare the URL/Path to your custom properties page.

Your xjs instance in your plugin's JS file has a method called `setConfigWindow` that you can use to specify the URL/Path to your custom properties page.

```javascript
// ESM
import Xjs from 'xjs-framework/core/xjs';

const xjs = new Xjs();
xjs.setConfigWindow('./props.html');

// UMD
const xjs = new window.Xjs();
xjs.setConfigWindow('./props.html');
```

## Properties window layouts

The framework allows developers to use two different layout schemes for the properties window. The first is called *embedded mode*, which allows developers to leverage the existing tab system of XSplit Broadcaster. The other is called *full mode*, which gives the developer total control over the full space of the window (the title bar and the Keep Source in Memory checkbox is already supplied though. There is no way of removing that).

Xjs framework exposes an object with functions that allows the developer to configure the source property window. You'll have to import this object inside your source properties page's JS file.

```javascript
// ESM
import propsWindow from 'xjs-framework/core/source-property-window';

// In UMD, it is exposed under Xjs object
const propsWindow = window.Xjs.SourceProperty;
```

### Tabbed Mode

// TODO: Show image of tabbed mode here

Here's the snippet to do something similar to the screenshot above:

```javascript
propsWindow.configure({
  mode: 'embedded',
  customTabs: ['Custom1', 'Custom2'],
});
```

If you would want to add in some default/existing tabs, you'll just have to specify it in the `tabOrder` property:

```javascript
propsWindow.configure({
  mode: 'embedded',
  customTabs: ['Custom1', 'Custom2'],
  tabOrder: ['Custom1', 'Custom2', 'Color', 'Layout', 'Transition'],
});
```

A complete list of default tabs will be documented in another reference file (TODO).

Now, how multiple custom tabs work relies on emitting an event this whole tab system isn't really designed to have a 1 HTML page-per-tab approach. Just think of your source property page as a single page app. If you're familiar with how communicating between two windows work using `postMessage`, XSplit Broadcaster uses the same standard event to inform us that a tab has been selected.

XSplit Broadcaster would emit a `message` event, with the payload assigned under the `data` property:

```javascript
window.addEventListener('message', (event) => {
  const data = JSON.parse(event.data); // event.data should be a JSON string

  if (data.event === 'set-selected-tab') {
    const selectedTab = data.value; // This should contain the tab name 
  }
});
```

So what we could actually do is show/hide your custom tabs based on `data.value`

```javascript
// Your JS file
const customTabs = ['Custom1', 'Custom2'];
propsWindow.configure({
  mode: 'embedded',
  customTabs,
  tabOrder: [...customTabs, 'Color', 'Layout', 'Transition'],
});

window.addEventListener('message', (event) => {
  const data = JSON.parse(event.data); // event.data should be a JSON string

  if (data.event !== 'set-selected-tab') return;
  
  const selectedTab = data.value;
  
  customTabs.forEach((tab) => {
    const div = document.getElementById(tab);
    
    if (tab === selectedTab) {
      document.classList.add('show');
    } else {
      document.classList.remove('show');
    }
  });
});
```

The HTML of the sample above:

```html
<div class="container">
  <div id="Custom1">
    <!-- Some sort of form here -->
  </div>

  <div id="Custom2">
    <!-- Some sort of form here -->
  </div>
</div>

<style>
  .container div {
    display: none;
  }
  
  .container div.show {
    display: block;
  }
</style>
```

### Full Mode

As stated above, full mode allows the developer to consume the whole source property window real estate. It's simpler since you don't have to bother about handling the tabs selection, and allows you to implement your own UI without bothering to align your design with what XSplit has for other default tabs. I mean, sure, you are free to implement your own design language, but admit it, it wouldn't look great if the other tabs have a completely different style.

To configure your property window as full mode, just specify the mode as `full`:

```javascript
propsWindow.configure({
  mode: 'full',
});
```

Pretty straight forward isn't it.

## Handling data between source property window and the plugin

Chances are that you would want to send data from the source property window back to the plugin. You can do this by calling the `emit` method.

```javascript
propsWindow.emit('key', payload);
```

In the plugin JS file, you should add a listener:

```javascript
propsWindow.on('key', (payload) => {
  console.log(payload);
});
```

Now, the `key` can be anything. It's up to you. It's just an identifier which should just match between the two contexts/windows.

One common pattern is to have use a separate key for actually saving changes, and another to preview changes:

```javascript
// Source properties window
propsWindow.emit('save-config', { color: 'black' });
propsWindow.emit('preview-config', { color: 'blue' });

// Plugin window
propsWindow.on('save-config', (payload) => {
  elem.style.color = payload.color;
  item.setConfiguration(payload);
});

propsWindow.on('preview-config', (payload) => {
  elem.style.color = payload.color;
});

```

Unlike in XJS 2.0, where we had an opinionated way of handling the data between the source property window and the plugin, in 3.0 we're not enforcing strict rules related to this.

## Getting the plugin configuration

In order to restore the configuration that you saved to the plugin the next time you opened up the source property window (or when you restart XSplit Broadcaster), you'll just need to call `getConfiguration` method of the `Item` class.

A common approach here is whenever your plugin loads for the first time, you should call this method and apply the saved configuration, and also whenever your source property window loads, you should call this method and apply the needed UI changes to reflect whatever is the current configuration.

For example, on the imaginary plugin we had earlier, we set the color property (`propsWindow.emit('save-config', { color: 'black' });`), and we applied the visual changes in your plugin (`elem.style.color = payload.color;`). When you restart Broadcaster, chances are that your visual changes would be lost and reverted to the default state.

In order for you to restore your changes, you'll have to call `getConfiguration` and apply whatever configuration you saved.

```javascript
import Xjs from 'xjs-framework/core/xjs';
import Item from 'xjs-framework/core/item';
import propsWindow from 'xjs-framework/core/source-property-window';

const xjs = new Xjs();      // In UMD: window.Xjs
const item = new Item(xjs); // In UMD: window.Xjs.Item

// On load of this script, we'd want to apply all the saved configuration
item.getConfiguration().then(applyVisualChanges);

propsWindow.on('save-config', (payload) => {
  item.saveConfiguration(payload);
  applyVisualChanges(payload);
});

function applyVisualChanges(config) {
  const elem = document.getElementById('something')
  elem.style.color = config.color;
}
```

The same goes with your source property window. Call `item.getConfiguration` on load of the window, and change your UI controls based on the saved values.

### But wait, how about sending a message from plugin to source property window?

Unfortuntely, we do not yet have an *official* way that is reliable to do this. However, you can make use of local storage events to send data from the plugin to the source property window given that both your plugin page and the source property page are served with the same origin and protocol.

Learn more about local storage events here (TODO, external link to MDN).

## Other source property window settings

Other methods that are exposed in the source property window object are:

- `resize(width, height)` - Change the source property window's dimensions
- `setVisible(boolean)` - If false, it'll show the built-in source property loading screen. This could be useful if you want to hide your UI while you're initializing your data, especially if your data is over the network.