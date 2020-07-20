
import { Matrix4x4 } from "../math/matrix4x4.js";
import { Vector3 } from "src/math/vector3.js";

interface Object3DTraverseCallback { (child: Object3D): void }

export class Object3D {
  parent: Object3D;
  modelViewMatrix: Matrix4x4;
  children: Set<Object3D>;

  constructor () {
    this.children = new Set<Object3D>();
    this.modelViewMatrix = new Matrix4x4();
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
  translate (by: Vector3): Object3D {
    this.modelViewMatrix.translate(by);
    return this;
  }
  translateByValues (x: number, y:number, z: number): Object3D {
    this.modelViewMatrix.translateByValues(
      x, y, z
    );
    return this;
  }
}
