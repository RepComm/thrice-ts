import { mat4 } from "../../libs/glMatrix/index.js";
import { Object3D } from "./object3d.js";
export class Camera extends Object3D {
  aspect = 1;
  near = 0.1;
  far = 100;

  constructor() {
    super();
    this.projectionMatrix = mat4.create();
  }

  setAspect(aspect) {
    this.aspect = aspect;
  }

  setNear(near) {
    this.near = near;
  }

  setFar(far) {
    this.far = far;
  }

  update() {
    mat4.multiply(this.projectionMatrix, this.projectionMatrix, this.modelViewMatrix);
  }

}
export class OrthographicCamera extends Camera {
  constructor() {
    super();
  }

  update() {
    mat4.ortho(this.projectionMatrix, this.orthographicWidth / 2, this.orthographicWidth / 2, this.orthographicHeight / 2, this.orthographicHeight / 2, this.near, this.far);
    super.update();
  }

}
export class PerspectiveCamera extends Camera {
  fieldOfView = Math.PI / 4;

  constructor() {
    super();
    this.update();
  }

  setFieldOfView(fov) {
    this.fieldOfView = fov;
    return this;
  }

  update() {
    mat4.perspective(this.projectionMatrix, this.fieldOfView, this.aspect, this.near, this.far);
    super.update();
  }

}