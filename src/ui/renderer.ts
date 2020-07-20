
import Component from "./component.js";

import { Scene } from "../rendering/scene.js";
import { Camera } from "../rendering/camera.js";
import { BufferMesh } from "../rendering/buffermesh.js";

interface RendererConstructorOptions {
  premadeCanvas: HTMLCanvasElement
}

export class Renderer extends Component {
  element: HTMLCanvasElement; //Override component's element member
  ctx: WebGL2RenderingContext;
  scene: Scene;
  camera: Camera;
  autoClearColor: boolean = true;
  autoClearDepth: boolean = true;
  zoom: number = 1;
  constructor(opts: RendererConstructorOptions | undefined = undefined) {
    super();
    if (opts) {
      if (opts.premadeCanvas) this.useNative(opts.premadeCanvas);
      else this.make("canvas");
    } else {
      this.make("canvas");
    }
    this.initWebGL();
  }
  initWebGL() {
    this.ctx = this.element.getContext("webgl2");
    if (!this.ctx) throw "Your browser might not support webgl2, Aborting!";
  }
  setClearColor(r: number, g: number, b: number, a: number): Renderer {
    this.ctx.clearColor(r, g, b, a);
    return this;
  }
  setScene(scene: Scene): Renderer {
    this.scene = scene;
    return this;
  }
  setCamera(camera: Camera): Renderer {
    this.camera = camera;
    return this;
  }
  setSize (width: number, height:number, updateCameraAspect: boolean = false) {
    if (updateCameraAspect) {
      if (!this.camera) throw "Cannot update camera aspect as requested if no camera for renderer";
      this.camera.setAspect(width/height);
      this.camera.update();
    }
    this.element.width = Math.floor(width);
    this.element.height = Math.floor(height);
    this.ctx.viewport(0, 0, this.element.width, this.element.height);
  }
  setAutoClear (color: boolean = true, depth: boolean = true): Renderer {
    this.autoClearColor = color;
    this.autoClearDepth = depth;
    return this;
  }
  render() {
    this.ctx.clearColor(0, 0, 0, 1);
    this.ctx.clearDepth(1.0);
    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.ctx.depthFunc(this.ctx.LEQUAL);

    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

    if (!this.scene) throw "No scene to render!";

    this.scene.traverse((child) => {
      if (child instanceof BufferMesh) {
        child.render(this, this.ctx);

        // Draw using verts and tri indicies (order of verts)
        // this.ctx.drawElements(
        //   this.ctx.TRIANGLES,
        //   child.vertexCount,
        //   this.ctx.UNSIGNED_SHORT,
        //   0
        // );
      }
    });
    
  }
}
