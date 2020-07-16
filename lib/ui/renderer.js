import Component from "./component.js";
import { BufferMesh } from "../rendering/BufferMesh.js";
export class Renderer extends Component {
  //Override component's element member
  constructor(opts = undefined) {
    super();

    if (opts) {
      if (opts.premadeCanvas) this.useNative(opts.premadeCanvas);else this.make("canvas");
    } else {
      this.make("canvas");
    }

    this.initWebGL();
  }

  initWebGL() {
    this.ctx = this.element.getContext("webgl2");
    if (!this.ctx) throw "Your browser might not support webgl2, Aborting!";
  }

  setClearColor(r, g, b, a) {
    this.ctx.clearColor(r, g, b, a);
    return this;
  }

  setScene(scene) {
    this.scene = scene;
    return this;
  }

  setCamera(camera) {
    this.camera = camera;
    return this;
  }

  setSize(width, height, updateCameraAspect = false) {
    if (updateCameraAspect) {
      if (!this.camera) throw "Cannot update camera aspect as requested if no camera for renderer";
      this.camera.setAspect(width / height);
      this.camera.update();
    }

    this.element.width = Math.floor(width);
    this.element.height = Math.floor(height);
  }

  render() {
    this.ctx.clearColor(0, 0, 0, 1);
    this.ctx.clearDepth(1.0);
    this.ctx.enable(this.ctx.DEPTH_TEST);
    this.ctx.depthFunc(this.ctx.LEQUAL);
    this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);
    if (!this.scene) throw "No scene to render!";
    let attributeLocation;
    let uniformLocation;
    let shader;
    this.scene.traverse(child => {
      if (child instanceof BufferMesh) {
        shader = child.material.shader;
        this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, child.glPosBuffer); //Get a pointer to shader's position data

        attributeLocation = this.ctx.getAttribLocation(shader.glProgram, shader.glShaderPosAttrName); //Pass instructions to it

        this.ctx.vertexAttribPointer(attributeLocation, 3, //Number of components per vertex
        this.ctx.FLOAT, //components are float
        false, //normalized
        0, 0 //stride, offset
        ); //Enable it

        this.ctx.enableVertexAttribArray(attributeLocation); //Use shader

        this.ctx.useProgram(shader.glProgram); //Get pointer to shader's projection

        uniformLocation = this.ctx.getUniformLocation(shader.glProgram, shader.glShaderProjectionAttrName); //Pass camera's projection to shader

        this.ctx.uniformMatrix4fv(uniformLocation, false, this.camera.projectionMatrix); //Get pointer to shader's model view

        uniformLocation = this.ctx.getUniformLocation(shader.glProgram, shader.glShaderModelViewAttrName); //Pass model view matrix to shader

        this.ctx.uniformMatrix4fv(uniformLocation, false, child.modelViewMatrix); //Draw it

        this.ctx.drawArrays(this.ctx.TRIANGLES, 0, child.vertexCount);
      }
    });
  }

}