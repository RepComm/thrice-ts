
import { Material } from "./material.js";
import { Object3D } from "./object3d.js";
import { Renderer } from "../ui/renderer.js";

export class BufferMesh extends Object3D {
  vertexData: Float32Array | undefined;
  vertexCount: number = 0;
  indexData: Uint16Array | undefined;
  colorData: Float32Array | undefined;
  glPosBuffer: WebGLBuffer | undefined;
  glIndBuffer: WebGLBuffer | undefined;
  glColBuffer: WebGLBuffer | undefined;
  ready: boolean = false;
  material: Material;
  useVerts: boolean = false;
  useFaces: boolean = false;
  useColors: boolean = false;
  useNormals: boolean = false;

  constructor() {
    super();
  }
  setVertexData(data: Float32Array): BufferMesh {
    this.vertexData = data;
    if (data) this.useVerts = true;
    return this;
  }
  setIndexData(data: Uint16Array): BufferMesh {
    this.indexData = data;
    if (data) this.useFaces = true;
    return this;
  }
  setColorData(data: Float32Array): BufferMesh {
    this.colorData = data;
    if (data) this.useColors = true;
    return this;
  }
  render(renderer: Renderer, ctx: WebGL2RenderingContext) {
    //Use our shader
    ctx.useProgram(this.material.shader.glProgram);

    if (this.hasVerts()) {
      //Bind our vertex data from js to GPU/opengl buffer
      ctx.bindBuffer(ctx.ARRAY_BUFFER, this.glPosBuffer);
      ctx.bufferData(ctx.ARRAY_BUFFER, this.vertexData, ctx.STATIC_DRAW);

      //Enable vertex attribute so we can use it
      ctx.enableVertexAttribArray( this.material.shader.glPosAttributePointer );

      //Bind our vertex data + instructions for use to it
      ctx.vertexAttribPointer(
        this.material.shader.glPosAttributePointer,
        3,                           //Number of components per vertex
        ctx.FLOAT,                   //components are float
        false,                       //normalized
        0, 0                         //stride, offset
      );
    }

    //Pass renderer.camera's projection to shader
    ctx.uniformMatrix4fv(
      this.material.shader.glProjectionAttributePointer,
      false,
      renderer.camera.projectionMatrix
    );

    //Pass model view matrix to shader
    ctx.uniformMatrix4fv(
      this.material.shader.glModelViewAttributePointer,
      false,
      this.modelViewMatrix
    );
    //Draw
    ctx.drawArrays(
      ctx.TRIANGLES,
      0,
      this.vertexCount
    );
  }
  update(ctx: WebGL2RenderingContext) {
    this.setReady(false);
    //Clear old buffer if it exists
    if (this.glPosBuffer) ctx.deleteBuffer(this.glPosBuffer);
    //Create a new one
    this.glPosBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.glPosBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.vertexData, ctx.STATIC_DRAW);

    if (this.glIndBuffer) ctx.deleteBuffer(this.glIndBuffer);
    this.glIndBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.glIndBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, this.indexData, ctx.STATIC_DRAW);

    if (this.glColBuffer) ctx.deleteBuffer(this.glColBuffer);
    this.glColBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.glColBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, this.colorData, ctx.STATIC_DRAW);

    this.setReady(true);
  }
  getReady(): boolean {
    return this.ready;
  }
  setReady(ready: boolean = true): BufferMesh {
    this.ready = ready;
    return this;
  }
  setMaterial(mat: Material): BufferMesh {
    this.material = mat;
    return this;
  }
  hasVerts() {
    return this.useVerts;
  }
  hasNormals() {
    return this.useNormals;
  }
  hasFaces() {
    return this.useFaces;
  }
  hasColors() {
    return this.useColors;
  }
}
