---
id: application-and-item-props
title: Using Application and Item Properties
sidebar_label: Using Application and Item Properties
---

Xjs 3.x introduces a new approach for handling and manipulating application and item properties, with the goal of allowing the developer to make use of the underlying core property even if Xjs does not have a *method* that abstracts the said property. In contrast, Xjs 2.x has everything abstracted.

To further understand why we ended up with this approach, let's first look at the issue that we tried to solve.

## Why does extensibility matter

To access a specific XSplit property in Xjs 2.x, the developer has to use a class method made for that specific property. This method could have some logic abstracted in it to transform the raw data of the specific property and return it in a way that is easy to consume for the implementing code. This was great, as it made creating plugins for XSplit a lot easier by tucking away all the logic, which sometimes could be considered as boilerplate, inside the method, allowing the developer to just focus on what matters.

However, issues started popping up once we started to release new versions of XSplit that has new methods exposed to the JS layer. Developers had to wait for a new version of Xjs to be able to make use of the new property, which shouldn't be an issue if Xjs supported the new property just a few days after XSplit Broadcaster exposed it to the JS layer. But alas, this wasn't as easy as we would've wanted it. Updating Xjs to support the new property and properly abstracting it takes time, as there's a set process of how we release new versions of Xjs. This resulted to weeks, even months, of delay before developers are able to take advantage of the new property.

We wanted to correct that, but we cannot sacrifice the quality of our framework just to rush the new methods, thus we came up with a way to allow developers to directly use the underlying core properties, that XSplit Broadcaster has exposed to JS, even if Xjs does not release a new version.

## The Solution

We dumbed it down a little. Rather than exposing each individual properties through their own methods, we simply exposed a couple of methods that you can use to get or set pretty much every application or item property.

### Application Properties

For application properties, the App class has an instance method called `getProperty` and `setProperty` which is used for pretty much all of the properties in the application-level. This includes properties related to the presentation itself, scenes, devices, and more. Properties that isn't directly tied up to a specific item in the stage is most likely an application property.

But rather than having you, the developer, guess what the underlying key is used by the core for a specific property that you have in mind, we provided a JavaScript object that contains most properties ready for your consumption. If you want to take a peek on what we have currently, you can check out the [source code in GitHub](https://github.com/dcefram/xjs/blob/master/src/props/app-props.ts). In the future, we'll have it documented in an API Reference, but since that's still underworks, [you can check out the source code for now](https://github.com/dcefram/xjs/blob/master/src/props/app-props.ts) (PS. We tried to make the names of each property self explanatory).

Here's a snippet that demonstrates the app props usage.

```javascript
import Xjs from 'xjs-framework/core/xjs';
import App from 'xjs-framework/core/app';
import appProps from 'xjs-framework/props/app-props';

const xjs = new Xjs();
const app = new App(xjs);

// Wrapped it inside a async function for the sake of showing off async-await.
async function main() {
  const audioDevices = await app.getProperty(appProps.audioDevices);
  console.log(audioDevices);
  
  await app.setProperty(
    appProps.sceneName, 
    { 
      scene: 0, 
      value: 'Custom Scene Name'
    }
  );
}

main();
```

You should notice here that we did not have to use a separate class that is specific to audio devices, and a separate class for scenes. We were able to access those properties by simply using the `getProperty` and `setProperty` instance methods of the App class.

**[Again, here's the link to the application properties included in Xjs.](https://github.com/dcefram/xjs/blob/master/src/props/app-props.ts)**

### Item Properties

Similar to the App class, the Item class also has a `getProperty` and `setProperty` instance method. We also a list of item properties that you can use out of the box, and [you can check it out in Github if you're looking for a specific property](https://github.com/dcefram/xjs/blob/master/src/props/item-props.ts).

This is what you need to use if you're trying to get or set a property related to a specific item in a scene. With that in mind, you are required to always pass in the ID of the item that you're trying to use.

```javascript
import Xjs from 'xjs-framework/core/xjs';
import Item from 'xjs-framework/core/item';
import itemProps from 'xjs-framework/props/item-props';

const xjs = new Xjs();
const item = new Item(xjs);

// Wrapped it inside a async function for the sake of showing off async-await.
async function main() {
  // `item.getCurrentItem` only works if you run Xjs in a source plugin
  const { id, srcId } = await item.getCurrentItem();

  const itemCustomName = await item.getProperty(itemProps.customName, { id, srcId });
  console.log(itemCustomName);

  await item.setProperty(
    appProps.position, 
    { 
      id,
      srcId,
      left: 0,
      top: 0,
      right: 300,
      bottom: 200
    }
  );
}

main();
```

Aside from the item ID, we should also always pass in the srcId. This is used in case the target item was deleted from the scene but has a duplicate linked item somewhere in the presentation. Xjs would automatically use the linked item in this case.

## Creating your own property

@TODO

```javascript
import Xjs from 'xjs-framework/core/xjs';
import App from 'xjs-framework/core/app';
import appProps from 'xjs-framework/props/app-props';

const xjs = new Xjs();
const app = new App(xjs);

// Wrapped it inside a async function for the sake of showing off async-await.
async function main() {
  // get presentation XML
  const presentationXml = await app.getProperty({ key: 'sceneconfig'});
  console.log(presentationXml);
  
  // switch active scene to scene 2
  app.setProperty(
    { key: 'scene:${view}' }, 
    { view: 0, value: 1 }
  );
}

main();
```



### Validators

@TODO

### Transforms

@TODO