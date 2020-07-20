

import Component from "./ui/component.js";
import { get, on } from "./ui/aliases.js";

import { Renderer } from "./ui/renderer.js";
import { PerspectiveCamera } from "./rendering/camera.js";
import { Scene } from "./rendering/scene.js";
import { BufferMesh } from "./rendering/buffermesh.js";
import { MeshBuilder } from "./utils/meshbuilder.js";
import { DemoMaterial } from "./rendering/materials/demomaterial.js";

import { GameInput } from "./utils/gameinput.js";

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
  builder.addVert(0, 0, 0),
  builder.addVert(1, 0, 0),
  builder.addVert(1, 1, 0)
).build(mesh);
// builder.addQuad(
//   builder.addVert(0, 0, 0),
//   builder.addVert(1, 0, 0),
//   builder.addVert(1, 1, 0),
//   builder.addVert(0, 1, 0)
// ).build(mesh);

//Make sure mesh buffers are updated
mesh.update(renderer.ctx);
mesh.translateByCoords(0, 0, -5);

//Add mesh to scene
scene.add(mesh);

//Camera and scene
renderer.setCamera(camera);
renderer.setScene(scene);
renderer.setSize(renderer.rect.width, renderer.rect.height, true);

let timeNow = 0;
let timeLast = 0;
let timeDelta = 0;

on(window, "resize", ()=>{
  renderer.setSize(renderer.rect.width, renderer.rect.height, true);
});

let sensitivity = 250;

let input: GameInput = GameInput.get();

let onAnim = ()=>{

  timeLast = timeNow;
  timeNow = Date.now();
  timeDelta = timeNow - timeLast;

  mesh.translateByCoords(
    0,// input.raw.consumeMovementX() / sensitivity, 
    0,//-input.raw.consumeMovementY() / sensitivity,
    input.raw.consumeMovementY() / sensitivity
  );

  //camera.translateByCoords(-mx/250, my/250, 0);
  //camera.update();

  renderer.render();
  window.requestAnimationFrame(onAnim);  
}

window.requestAnimationFrame(onAnim);
