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

We dumbed it down a little. Rather than exposing each individual properties through their own methods, we simply exposed a couple of methods that you can use to get or set pretty much every application or item property. This way, it would be easy to create an object that Xjs could understand and pass it to XSplit Broadcaster.

This way, if in case there's a new method or a missing method, and the team was able to provide the property key to the developer through our discord channel or community forums, you, the developer, would be able to make use of it immediately even without waiting for a new Xjs release... As long as your XSplit Broadcaster supports the property.

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
      value: {
        left: 0,
        top: 0,
  	    right: 300,
        bottom: 200,
      },
    }
  );
}

main();
```

Aside from the item ID, we should also always pass in the srcId. This is used in case the target item was deleted from the scene but has a duplicate linked item somewhere in the presentation. Xjs would automatically use the linked item in this case.

## Creating your own property

The Xjs team would try their best to have all known properties included in Xjs out of the box, but if in case there's a property that does not exist in the property objects (`app-props.ts` and `item-props.ts`), you can create your own property object that you could pass into the `getProperty` or `setProperty` methods.

At minimum, the object should just contain a `key` property, wherein the value of that `key` is the underlying property identifier that XSplit Broadcaster could understand. Here's a simple example:

```javascript
import Xjs from 'xjs-framework/core/xjs';
import App from 'xjs-framework/core/app';

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

You'll notice in the `app.setProperty` example, we were passing in an object with 2 properties. The `value` property is required, and is the data that would be passed to XSplit Broadcaster, while the `view` property is based on the string parameter of the key.

To ellaborate, if your `key` have string parameters (values surrounded by the `${}` sign), that value would be substituted by the property with the same name passed to the second parameter of `setProperty`:

```javascript
// If we have ${hello}, the object passed to the second parameter should have a `hello` property
app.getProperty(
  { key: 'preview:${hello}' },
  { hello: '0' },
);

// If we have a key that has multiple string params, the object passed to the second parameter should
// also have keys with the same name
app.getProperty(
  { key: 'foo:${bar}:${baz}' },
  { bar: '1', baz: '0' },
);

// Don't forget that the `value` property is required if we're using `setProperty`.
app.setProperty(
  { key: 'foo:${bar}:${baz}' },
  { bar: '1', baz: '0', value: 'hi!' },
);
```

Ok, that should do most of the time...

If you checked the source code of the `app-props.ts` and `item-props.ts` (linked above),  you might be curious about what's with the `setValidator`, `getValidator`, `setTransformer`, and `getTransformer`. We'll talk about those in detail next.

### Validators

Chances are that you wouldn't need to define a `setValidator` or `getValidator` unless you plan to share your custom property object with others. To simply put it, this is where you would place your *guards*, that would be used to avoid passing the value passed in the second parameter to XSplit Broadcaster.

A usecase for validators is if you are aware that a particular property is a Read-only property (example: `scenethumbnail` property). We would want to add a `setValidator` that would always throw an error.

```javascript
const sceneThumbnailProps = {
  key: 'scenethumbnail:${scene}',
  setValidator: () => throw new Error('Property is Read-Only'),
}
```

Passing this object to `app.setProperty` would trigger the `setValidator` function, and throw an error.

Another usecase for validators is to prevent executing a property if the plugin is loaded in an unsupported environment.

### Transformers

Transformers are pretty useful to transform the value passed to a `setProperty` from a easy-to-read format into the format that XSplit Broadcaster could understand. And the same is with the other way around, wherein it can be used to transform the data received from XSplit Broadcaster into a format that you think would make more sense in your context.

To better grasp the usefulness of transformers, let's take for example the property used to position an item in a scene: `prop:pos`. When we do a `item.getProperty` with `prop:pos`, XSplit Broadcaster would return a comma delimited string.

```javascript
// This will return a string with the following format: left,top,right,bottom. Ex: 0,0,0.25,0.4
await item.getProperty({ key: 'prop:pos' }, { id, srcId });
```

Now, you can simply process that string to something easy to read after fetching the data:

```javascript
const posString = await item.getProperty({ key: 'prop:pos' }, { id, srcId });
const [left, top, right, bottom] = posString.split(',').map(Number);
```

It's simple enough right? But what if you're doing this in multiple places? Wouldn't it be better if you would just pass in a variable to the first parameter of `item.getProperty` that would also handle the transformation?

```javascript
const itemPosition = {
  key: 'prop:pos',
  getTransformer: (value) => value.split(',').map(Number),
};

// Somewhere in your code
const [left, top, right, bottom] = await item.getProperty(itemPosition, { id, srcId });

// And in other parts of your code...
const [left, top, right, bottom] = await item.getProperty(itemPosition, { id, srcId });
```

In our example, we did a simple transform which just saved us a couple of keystrokes, but you should get the idea on how valuable this is if you plan to have do more complex processing on the data received from XSplit Broadcaster.

The same goes with the other way around, you can define a `setTransformer` function that should take in your data structure and convert it into the data that XSplit Broadcaster would understand. Let's continue with the `prop:pos` example:

```javascript
const itemPosition = {
  key: 'prop:pos',
  getTransformer: (value) => value.split(',').map(Number),
  setTransformer: ({ left, top, right, bottom }) => `${left},${top},${right},${bottom}`,
};

// Get property
const [left, top, right, bottom] = await item.getProperty(itemPosition, { id, srcId });

// Set Property
item.setProperty(
  itemPosition, 
  {
    id,
    srcId,
    value: {
      left: 0,
      right: 0.2,
      bottom: 1,
      top: 0,
    },
  }
);
```

I'd say this allows us to have a much more readable code for the majority of our codebase, while having the transformations tucked away in a file that should be easy to reason about.