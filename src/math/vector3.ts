
import { lerp, EPSILON } from "./math.js";
import { Matrix4x4 } from "./matrix4x4.js";
import { Quaternion } from "./quaterion.js";

export class Vector3 {
  static ZERO: Vector3 = new Vector3(0, 0, 0);
  static UP: Vector3 = new Vector3(0, 1, 0);
  x: number;
  y: number;
  z: number;
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.set(x, y, z);
  }
  set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(from: Vector3): Vector3 {
    this.set(from.x, from.y, from.z);
    return this;
  }
  clone(): Vector3 {
    return new Vector3().copy(this);
  }
  toArray(destination: Array<number> | undefined = undefined): Array<number> {
    if (destination === undefined) destination = new Array();
    destination.push(this.x, this.y, this.z);
    return destination;
  }
  magnitude(abs: boolean = true): number {
    let result = Math.hypot(this.x, this.y, this.z);
    if (abs) result = Math.abs(result);
    return result;
  }
  magnitudeSquared(): number {
    return (
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2) +
      Math.pow(this.z, 2)
    );
  }
  add(other: Vector3): Vector3 {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }
  sub(other: Vector3): Vector3 {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }
  mul(other: Vector3): Vector3 {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }
  mulScalar(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }
  div(other: Vector3): Vector3 {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }
  divScalar(scalar: number): Vector3 {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }
  ceil(ceilTo: Vector3): Vector3 {
    this.x = Math.ceil(ceilTo.x);
    this.y = Math.ceil(ceilTo.y);
    this.z = Math.ceil(ceilTo.z);
    return this;
  }
  floor(floorTo: Vector3): Vector3 {
    this.x = Math.floor(floorTo.x);
    this.y = Math.floor(floorTo.y);
    this.z = Math.floor(floorTo.z);
    return this;
  }
  min(minTo: Vector3): Vector3 {
    this.x = Math.min(this.x, minTo.x);
    this.y = Math.min(this.y, minTo.y);
    this.z = Math.min(this.z, minTo.z);
    return this;
  }
  max(maxTo: Vector3): Vector3 {
    this.x = Math.max(this.x, maxTo.x);
    this.y = Math.max(this.y, maxTo.y);
    this.z = Math.max(this.z, maxTo.z);
    return this;
  }
  round(roundTo: Vector3): Vector3 {
    this.y = Math.round(roundTo.y);
    this.x = Math.round(roundTo.x);
    this.z = Math.round(roundTo.z);
    return this;
  }
  dist(other: Vector3): number {
    return Math.hypot(
      other.x - this.x,
      other.y - this.y,
      other.z - this.z
    );
  }
  distSquared(other: Vector3): number {
    return (
      Math.pow(other.x - this.x, 2) +
      Math.pow(other.y - this.y, 2) +
      Math.pow(other.z - this.z, 2)
    );
  }
  negate(): Vector3 {
    this.set(
      -this.x,
      -this.y,
      -this.z
    );
    return this;
  }
  inverse(): Vector3 {
    this.x = 1 / this.x;
    this.y = 1 / this.y;
    this.z = 1 / this.z;
    return this;
  }
  normalize(): Vector3 {
    this.divScalar(this.magnitude());
    return this;
  }
  dot(other: Vector3): number {
    return (
      this.x * other.x +
      this.y * other.y +
      this.z * other.z
    );
  }
  cross(a: Vector3, b: Vector3): Vector3 {
    this.set(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
    return this;
  }
  lerp(to: Vector3, by: number): Vector3 {
    this.x = lerp(this.x, to.x, by);
    this.y = lerp(this.y, to.y, by);
    this.z = lerp(this.z, to.z, by);
    return this;
  }
  angle(other: Vector3): number {
    let mag = this.magnitude() * other.magnitude()
    let cosine = mag && this.dot(other) / mag;

    return Math.acos(
      Math.min(
        Math.max(
          cosine,
          -1
        ),
        1
      )
    );
  }
  rotate(around: Vector3 = Vector3.ZERO, byRadianAngles: Vector3): Vector3 {
    let offsetX = this.x - around.x;
    let offsetY = this.y - around.y;
    let offsetZ = this.z - around.z;
    throw "Not implemented yet";
    return this;
  }
  copyFromMatrix4x4Pos(from: Matrix4x4): Vector3 {
    this.x = from.data[12];
    this.y = from.data[13];
    this.z = from.data[14];
    return this;
  }
  copyFromMatrix4x4Scale(from: Matrix4x4): Vector3 {
    this.set(
      Math.hypot(
        from.data[0], 
        from.data[1], 
        from.data[2]
      ),
      Math.hypot(
        from.data[4], 
        from.data[5], 
        from.data[6]
      ),
      Math.hypot(
        from.data[8], 
        from.data[9], 
        from.data[10]
      )
    );
    return this;
  }
  copyFromQuaternionAxisAngle (from: Quaternion): Vector3 {
    let rad = Math.acos(from.w) * 2;
    let s = Math.sin(rad / 2);
  
    if (s > EPSILON) {
      this.x = from.x / s;
      this.y = from.y / s;
      this.z = from.z / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      this.x = 1;
      this.y = 0;
      this.z = 0;
    }
    return this;
  }
}
