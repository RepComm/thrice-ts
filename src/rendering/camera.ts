
import { Matrix4x4 } from "../math/matrix4x4.js";
import { Object3D } from "./object3d.js";

export class Camera extends Object3D {
  projectionMatrix: Matrix4x4;
  aspect: number = 1;
  near: number = 0.1;
  far: number = 100;
  constructor() {
    super();
    this.projectionMatrix = new Matrix4x4();
  }
  setAspect(aspect: number) {
    this.aspect = aspect;
  }
  setNear(near: number) {
    this.near = near;
  }
  setFar(far: number) {
    this.far = far;
  }
  update() {
    this.projectionMatrix.mul(this.modelViewMatrix);
  }
}

export class OrthographicCamera extends Camera {
  orthographicWidth: 1;
  orthographicHeight: 1;
  constructor() {
    super();

  }
  update() {
    this.projectionMatrix.ortho(
      this.orthographicWidth / 2,
      this.orthographicWidth / 2,
      this.orthographicHeight / 2,
      this.orthographicHeight / 2,
      this.near,
      this.far);
    super.update();
  }
}

export class PerspectiveCamera extends Camera {
  fieldOfView: number = Math.PI / 4;
  constructor() {
    super();
    this.update();
  }
  setFieldOfView(fov: number): Camera {
    this.fieldOfView = fov;
    return this;
  }
  update() {
    this.projectionMatrix.perspective(
      this.fieldOfView,
      this.aspect,
      this.near,
      this.far
    );
    super.update();
  }
}
