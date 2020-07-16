
import { Material } from "./material.js";
import { Object3D } from "./object3d.js";

export class BufferMesh extends Object3D {
  vertexData:Float32Array|undefined;
  vertexCount: number = 0;
  indexData:Uint32Array|undefined;
  glPosBuffer: WebGLBuffer|undefined;
  ready: boolean = false;
  material: Material;
  constructor () {
    super();
  }
  setVertexData (data: Float32Array): BufferMesh {
    this.vertexData = data;
    return this;
  }
  setIndexData (data: Uint32Array): BufferMesh {
    this.indexData = data;
    return this;
  }
  update (ctx: WebGL2RenderingContext) {
    this.setReady(false);
    //Clear old buffer if it exists
    if (this.glPosBuffer) ctx.deleteBuffer(this.glPosBuffer);
    //Create a new one
    this.glPosBuffer = ctx.createBuffer();

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.glPosBuffer);

    ctx.bufferData(ctx.ARRAY_BUFFER, this.vertexData, ctx.STATIC_DRAW);

    this.setReady(true);
  }
  getReady (): boolean {
    return this.ready;
  }
  setReady (ready: boolean = true): BufferMesh {
    this.ready = ready;
    return this;
  }
  setMaterial (mat: Material): BufferMesh {
    this.material = mat;
    return this;
  }
}
