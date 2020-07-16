

import Component from "./ui/component.js";
import { get, on } from "./ui/aliases.js";

import { Renderer } from "./ui/renderer.js";
import { PerspectiveCamera } from "./rendering/camera.js";
import { Scene } from "./rendering/scene.js";
import { BufferMesh } from "./rendering/BufferMesh.js";
import { MeshBuilder } from "./utils/meshbuilder.js";
import { DemoMaterial } from "./rendering/materials/demomaterial.js";

//Container of our app on the page
const cont: Component = new Component()
  .useNative(get("container"));

const renderer: Renderer = new Renderer()
  .mount(cont).id("canvas") as Renderer;

const camera = new PerspectiveCamera();
camera.update();

const scene = new Scene();

//Get our demo material, make sure its compiled
let material = DemoMaterial.get().compileShaders(renderer.ctx);

//Use a mesh builder
let builder = new MeshBuilder();
//Make an output
let mesh = new BufferMesh().setMaterial(material);

//Add a triangle
builder.addTri(
  builder.addVert(-1, -1, 0),
  builder.addVert(1, -1, 0),
  builder.addVert(1, 1, -0)
);

//Output the mesh
builder.build(mesh);
//Make sure mesh buffers are updated
mesh.update(renderer.ctx);
mesh.translateByCoords(0, 0, -5);

//Add mesh to scene
scene.add(mesh);

//Camera and scene
renderer.setCamera(camera);
renderer.setScene(scene);
renderer.setSize(renderer.rect.width, renderer.rect.height, true);

let direction = false;
let timeNow = 0;
let timeLast = 0;
let timeDelta = 0;
let timeEnlapsed = 0;
let timeMax = 200;

on(window, "resize", ()=>{
  renderer.setSize(renderer.rect.width, renderer.rect.height, true);
});

let onAnim = ()=>{
  renderer.render();

  timeLast = timeNow;
  timeNow = Date.now();
  timeDelta = timeNow - timeLast;
  timeEnlapsed += timeDelta;
  if (timeEnlapsed > timeMax) {
    direction = !direction;
    timeEnlapsed = 0;
  }

  if (direction) {
    camera.translateByCoords(0, 0, 0.1);
  } else {
    camera.translateByCoords(0, 0, -0.1);
  }
  camera.update();

  window.requestAnimationFrame(onAnim);  
}

window.requestAnimationFrame(onAnim);
