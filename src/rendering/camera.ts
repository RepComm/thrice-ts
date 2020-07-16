
import { mat4 } from "gl-matrix";
import { Object3D } from "./object3d.js";

export class Camera extends Object3D {
  projectionMatrix: mat4;
  aspect: number = 1;
  near: number = 0.1;
  far: number = 100;
  constructor () {
    super();
    this.projectionMatrix = mat4.create();
  }
}

export class PerspectiveCamera extends Camera {
  fieldOfView: number = Math.PI/4;
  constructor () {
    super();
    this.update();
  }
  setFieldOfView (fov: number): Camera {
    this.fieldOfView = fov;
    return this;
  }
  setAspect (aspect: number) {
    this.aspect = aspect;
  }
  setNear (near: number) {
    this.near = near;
  }
  setFar (far: number) {
    this.far = far;
  }
  update () {
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      this.aspect,
      this.near,
      this.far
    );
    // mat4.multiply(this.projectionMatrix, this.projectionMatrix, this.modelViewMatrix);
  }
}
