import { Object3D } from "./object3d.js";
export class BufferMesh extends Object3D {
  vertexCount = 0;
  ready = false;

  constructor() {
    super();
  }

  setVertexData(data) {
    this.vertexData = data;
    return this;
  }

  setIndexData(data) {
    this.indexData = data;
    return this;
  }

  update(ctx) {
    this.setReady(false); //Clear old buffer if it exists

    if (this.glPosBuffer) ctx.deleteBuffer(this.glPosBuffer); //Create a new one

    this.glPosBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.glPosBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.vertexData, ctx.STATIC_DRAW);
    this.setReady(true);
  }

  getReady() {
    return this.ready;
  }

  setReady(ready = true) {
    this.ready = ready;
    return this;
  }

  setMaterial(mat) {
    this.material = mat;
    return this;
  }

}