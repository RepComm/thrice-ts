

import Component from "./ui/component.js";
import { get } from "./ui/aliases.js";

import { Renderer } from "./ui/renderer.js";
import { PerspectiveCamera } from "./rendering/camera.js";
import { Scene } from "./rendering/scene.js";
import { BufferMesh } from "./rendering/BufferMesh.js";
import { Material } from "./rendering/material.js";
import { Shader } from "./rendering/shader.js";

//Container of our app on the page
const cont: Component = new Component()
  .useNative(get("container"));

const renderer: Renderer = new Renderer()
  .mount(cont) as Renderer;

const camera = new PerspectiveCamera();
camera.update();

const scene = new Scene();

let shader = new Shader();
shader.setVertexProgram(`
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`);
shader.setFragmentProgram(`
void main(){
  gl_FragColor=vec4(1.0, 1.0, 1.0, 1.0);
}
`);
shader.compile(renderer.ctx);

let material = new Material();
material.setShader(shader);

let mesh = new BufferMesh();
mesh.material = material;

let vdata = Float32Array.from([
  0,0,0, //top left 
  1,0,0, //top right
  1,1,0, //bottom right

  0,0,0, //top left
  0,1,0, //bottom left
  1,1,0 //bottom right
]);
mesh.setVertexData(vdata);
mesh.update(renderer.ctx);

renderer.setCamera(camera);
renderer.setScene(scene);

let onAnim = ()=>{
  mesh.translateByCoords(Math.random(), Math.random(), Math.random());
  renderer.render();

  window.requestAnimationFrame(onAnim);  
}

window.requestAnimationFrame(onAnim);
