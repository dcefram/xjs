---
id: your-first-extension-plugin
title: Creating your First Extension Plugin
sidebar_label: Creating your First Extension Plugin
---

For our first extension plugin, we'll aim to use some methods in XJS that only work for Extension plugins. With that said, we'll be making yet another barely useful, if not completely useless, plugin: An extension that lists all your scenes and simply allows you to change scenes.

## Project setup

For this project, we'll be using [Parcel](https://parceljs.org/) as our project bundler, since it's the easiest bundler to use (it's literally a plug-and-play bundler :D). Ok, so let's get on with the steps:

1. Create a folder for your project. We'll name it as `scene-switch`.

2. Open up the folder in command line. I'll be using powershell, but you're free to use any command line you want.

   ```powershell
   cd ~/path/to/scene-switch
   ```

3. Initialize an npm project, and install our dependencies

   ```powershell
   npm init
   npm i parcel-bundler xjs-framework@3.0.0-alpha.5
   ```

4. Update `package.json` and add some Parcel JS scripts that we'll use when bundling our plugin.

   ```javascript
   // Under "scripts", add the following:
   "dev": "parcel index.html",
   "build": "parcel build index.html"
   
   // It should look like this:
   "scripts": {
     "dev": "parcel index.html",
     "build": "parcel build index.html"
   }
   ```

5. Lastly, create an `index.html` file and an `plugin.js` file... this would contain the source code of your plugin.

Parcel allows use to just focus on our plugin without worrying a lot on how to bundle our JS files and its dependencies together.

## Completing the plugin

Ok, with the initial tooling out of the way, we can now focus on building our extension plugin. First, we'll layout our markup. We want our UI to look something like this:

![Sample Source Plugin](/img/xjs-test-app-2.gif)

Basically, it'll be a bunch of buttons for each scene we have in XSplit Broadcaster. Clicking on each button should cause XSplit Broadcaster to switch to the scene that the user clicked on. With that in mind, here's the initial markup of our `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <meta http-equiv='X-UA-Compatible' content='IE=edge'>
  <title>Scene Switch</title>
  <meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body>
  <div id="workspace"></div>
  <script src='plugin.js'></script>
</body>
</html>
```

Our HTML file just needs to add in our `plugin.js` file into the page, and also provide an element that we will use to render our buttons dynamically.

### Initializing Xjs

With the markup out of the way, let us focus on our JS file. First of all, we would need to import `xjs-framework`, and initialize Xjs.

```javascript
import Xjs from 'xjs-framework/core/xjs';

const xjs = new Xjs();
```

An Xjs instance holds the necessary information on which XSplit app it would communicate with and use. When you create a new Xjs instance without passing any configuration, Xjs framework will use the XSplit app where the plugin is loaded on.

### Listing Scenes

Next, we need to get the scenes that is loaded in XSplit Broadcaster. There is two ways to go about this, but we'll use the easy route first and then we'll talk briefly on the alternative, more generic way, of getting and setting application-level properties.

The easy, straightforward way is by utilising the `Scene` class. You'll need to import the Scene class first and then we have to somehow tell the `Scene` class as to which XSplit Broadcaster to talk to. We do this by passing the xjs instance we created to the `Scene` class.

```javascript {2, 5}
import Xjs from 'xjs-framework/core/xjs';
import Scene from 'xjs-framework/core/scene';

const xjs = new Xjs();
const scene = new Scene(xjs);
```

The scene class has an instance method called `listAll`, a self-explanatory method that simply returns a promise that resolves a list of JSON objects that contains the scene's information.

```javascript
scene.listAll().then((scenes) => console.log(scenes));
```

Each object that `listAll` resolves contains the `id`, `index`, and `name` of the scene.

In order to change that data into something that we can see in our Extension plugin, we'll need to create a button for each scene. Here's a *simple* way of creating a button and then attaching it to our "workspace" (The `<div id="workspace">` node we had in our HTML file):

```javascript
const workspace = document.getElementById('workspace');
const button = document.createElement('button');

// sceneInfo is the object from the array that was resolved from `scene.listAll`
button.textContent = sceneInfo.name;
button.setAttribute('data-id', sceneInfo);
button.addEventListener('click', (event) => {
  const sceneId = event.target.dataset.id;
  console.log(sceneId);
});

workspace.appendChild(button)

```

Putting it together with the `listAll` method, we should have something like this:

```javascript
scene.listAll().then((scenes) => {
  scenes.forEach((sceneInfo) => {
    const button = document.createElement('button');

    button.textContent = sceneInfo.name;
    button.setAttribute('data-id', sceneInfo.id);
    button.addEventListener('click', (event) => {
      const sceneId = event.target.dataset.id;
      console.log(sceneId);
    });

    workspace.appendChild(button);
  });
});
```

### Testing our plugin in XSplit Broadcaster

Try running our project by executing `npm run dev`, and open it up in XSplit Broadcaster.

@TODO: Add GIF to demonstrate adding an extension plugin using the URL

### Setting active scene

So we were able to display a couple of buttons in our extension plugin, but clicking on it does nothing. Let's add some functionality that should allow us to change the active scene based on what the user clicked on.

Again, just like with listing scenes, there's two ways to do this. Just like before, we'll first talk about the easy route and later at the bottom of this page, we'll just have a small footnote about the alternative way.

```javascript
scene.setActive(sceneId);
```

It is as simple as that one liner. Let's replace the contents of our `click` event handler with this:

```javascript
button.addEventListener('click', (event) => {
  const sceneId = event.target.dataset.id;
  scene.setActive(sceneId);
});
```

### Putting it together

So the final code of our `plugin.js` should look something like this:

```javascript
import Xjs from 'xjs-framework/core/xjs';
import Scene from 'xjs-framework/core/scene';

const xjs = new Xjs();
const scene = new Scene(xjs);
const workspace = document.getElementById('workspace');

scene.listAll().then((scenes) => {
  scenes.forEach((sceneInfo) => {
    const button = document.createElement('button');

    button.textContent = sceneInfo.name;
    button.setAttribute('data-id', sceneInfo.id);
    button.addEventListener('click', (event) => {
      const sceneId = event.target.dataset.id;
      scene.setActive(sceneId);
    });

    workspace.appendChild(button);
  });
});

```

You should test it out in XSplit Broadcaster. Try clicking on the buttons, and your active scene should change in XSplit Broadcaster.

Congratulations! We were able to put together a simple external plugin with a few lines of code. You should be able to execute `npm run build` and that should create a `dist` folder. Inside the `dist` folder, you should see an `index.html` file which you can directly add to XSplit Broadcaster. This way, you do not have to have a NodeJS server running just to open up your plugin.

@TODO: Show GIF here

### All about application properties

In this tutorial, we used the `Scene` class that has methods specific to getting scene related info and manipulating scene-related functionality. There's an alternate way to do this, and it is by directly setting application properties. `Scenes` is an app-level property, and thus, you can access it through the `App` class. The only reason why it's worth noting it here is because it is possible that the Scene class might have some missing methods that is related to the scenes feature, especially if it is a new XSplit Broadcaster feature. If in case there's a method missing, you can always fallback to the `App` class to access it.

Read more about application properties here. @TODO.

