// import { mat4, vec3 } from "gl-matrix";
import { mat4 } from "../libs/glMatrix/index.js";
export class Object3D {
  constructor() {
    this.children = new Set();
    this.modelViewMatrix = mat4.create();
  }

  traverse(traverseCallback) {
    for (let child of this.children) {
      traverseCallback(child);
      child.traverse(traverseCallback);
    }
  }

  removeSelf(notityParent = false) {
    if (!this.parent || !this.parent.has(this)) return false;
    if (notityParent) this.parent.remove(this);
    this.parent = undefined;
    return true;
  }

  remove(obj) {
    this.children.delete(obj);
  }

  has(obj) {
    return this.children.has(obj);
  }

  add(child) {
    child.removeSelf(true);
    this.children.add(child);
  }

  translateByVec(by) {
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, by);
    return this;
  }

  translateByCoords(x, y, z) {
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [x, y, z]);
    return this;
  }

}