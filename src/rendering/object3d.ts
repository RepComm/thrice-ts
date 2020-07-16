
// import { mat4, vec3 } from "gl-matrix";
import { mat4, vec3 } from "../libs/glMatrix/index.js";

interface Object3DTraverseCallback { (child: Object3D): void }

export class Object3D {
  parent: Object3D;
  modelViewMatrix: mat4;
  children: Set<Object3D>;

  constructor () {
    this.children = new Set<Object3D>();
    this.modelViewMatrix = mat4.create();
  }
  traverse (traverseCallback: Object3DTraverseCallback) {
    for (let child of this.children) {
      traverseCallback(child);
      child.traverse(traverseCallback);
    }
  }
  removeSelf (notityParent: boolean = false): boolean {
    if (!this.parent || !this.parent.has(this)) return false;
    if (notityParent) this.parent.remove(this);
    this.parent = undefined;
    return true;
  }
  remove (obj: Object3D) {
    this.children.delete(obj);
  }
  has (obj: Object3D) {
    return this.children.has(obj);
  }
  add (child: Object3D) {
    child.removeSelf(true);
    this.children.add(child);
  }
  translateByVec (by: vec3): Object3D {
    mat4.translate(
      this.modelViewMatrix, this.modelViewMatrix, by
    );
    return this;
  }
  translateByCoords (x: number, y:number, z: number): Object3D {
    mat4.translate(
      this.modelViewMatrix, this.modelViewMatrix, [x, y, z]
    );
    return this;
  }
}
