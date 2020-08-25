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
