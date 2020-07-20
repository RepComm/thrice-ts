
import { Matrix4x4 } from "./matrix4x4.js";
import { Vector3 } from "./vector3.js";
import { EPSILON } from "./math.js";

export class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
  constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
    this.set(x, y, z, w);
  }
  set(x: number = 0, y: number = 0, z: number = 0, w: number = 1): Quaternion {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  copyFromMatrix4x4(from: Matrix4x4): Quaternion {
    let scale = new Vector3()
      .copyFromMatrix4x4Scale(from)
      .inverse();
    let fromScaled0 = from.data[0] * scale.x;
    let fromScaled1 = from.data[1] * scale.y;
    let fromScaled2 = from.data[2] * scale.z;
    let fromScaled3 = from.data[4] * scale.x;
    let fromScaled4 = from.data[5] * scale.y;
    let fromScaled5 = from.data[6] * scale.z;
    let fromScaled6 = from.data[8] * scale.x;
    let fromScaled7 = from.data[9] * scale.y;
    let fromScaled8 = from.data[10] * scale.z;
    let trace = fromScaled0 + fromScaled4 + fromScaled8;
    let S = 0;

    if (trace > 0) {
      S = Math.sqrt(trace + 1.0) * 2;
      this.set(
        (fromScaled5 - fromScaled7) / S,
        (fromScaled6 - fromScaled2) / S,
        (fromScaled1 - fromScaled3) / S,
        0.25 * S
      );
    } else if (fromScaled0 > fromScaled4 && fromScaled0 > fromScaled8) {
      S = Math.sqrt(1.0 + fromScaled0 - fromScaled4 - fromScaled8) * 2;
      this.set(
        0.25 * S,
        (fromScaled1 + fromScaled3) / S,
        (fromScaled6 + fromScaled2) / S,
        (fromScaled5 - fromScaled7) / S
      );
    } else if (fromScaled4 > fromScaled8) {
      S = Math.sqrt(1.0 + fromScaled4 - fromScaled0 - fromScaled8) * 2;
      this.set(
        (fromScaled1 + fromScaled3) / S,
        0.25 * S,
        (fromScaled5 + fromScaled7) / S,
        (fromScaled6 - fromScaled2) / S
      );
    } else {
      S = Math.sqrt(1.0 + fromScaled8 - fromScaled0 - fromScaled4) * 2;
      this.set(
        (fromScaled6 + fromScaled2) / S,
        (fromScaled5 + fromScaled7) / S,
        0.25 * S,
        (fromScaled1 - fromScaled3) / S
      )
    }

    return this;
  }
  setAxisAngle(axis: Vector3, angleRadians: number): Quaternion {
    angleRadians /= 2;
    let s = Math.sin(angleRadians);
    this.set(
      s * axis.x,
      s * axis.y,
      s * axis.z,
      Math.cos(angleRadians)
    );
    return this;
  }
  dot(other: Quaternion): number {
    return (
      this.x * other.x +
      this.y * other.y +
      this.z * other.z +
      this.w * other.w
    );
  }
  angle(other: Quaternion): number {
    return Math.acos(
      2 *
      Math.pow(this.dot(other), 2)
      - 1
    );
  }
  mul(other: Quaternion): Quaternion {
    this.x = this.x * other.w + this.w * other.x + this.y * other.z - this.z * other.y;
    this.y = this.y * other.w + this.w * other.y + this.z * other.x - this.x * other.z;
    this.z = this.z * other.w + this.w * other.z + this.x * other.y - this.y * other.x;
    this.w = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z;
    return this;
  }
  calculateW(): Quaternion {
    this.w = Math.sqrt(
      Math.abs(
        1.0 -
        Math.pow(this.x, 2) -
        Math.pow(this.y, 2) -
        Math.pow(this.z, 2)
      )
    );
    return this;
  }
  exp(): Quaternion {
    let r = Math.sqrt(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2) +
      Math.pow(this.z, 2)
    );
    let et = Math.exp(this.w);
    let s = r > 0 ? et * Math.sin(r) / r : 0;
    this.x = this.x * s;
    this.y = this.y * s;
    this.z = this.z * s;
    this.w = et * Math.cos(r);
    return this;
  }
  naturalLog(): Quaternion {
    let r = Math.sqrt(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2) +
      Math.pow(this.z, 2)
    );
    let t = r > 0 ? Math.atan2(r, this.w) / r : 0;
    this.x *= t;
    this.y *= t;
    this.z *= t;
    this.w = 0.5 * Math.log(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2) +
      Math.pow(this.z, 2) +
      Math.pow(this.w, 2)
    );
    return this;
  }
  mulScalar(scalar: number): Quaternion {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }
  pow(power: number): Quaternion {
    return this.naturalLog().mulScalar(power).exp();
  }
  copy(from: Quaternion): Quaternion {
    this.set(
      from.x,
      from.y,
      from.z,
      from.w
    );
    return this;
  }
  clone(): Quaternion {
    return new Quaternion().copy(this);
  }
  slerp(other: Quaternion, amount: number): Quaternion {
    let bx = other.x,
      by = other.y,
      bz = other.z,
      bw = other.w;
    let omega, omegaSin, scale0, scale1;

    let omegaCos = this.x * bx + this.y * by + this.z * bz + this.w * bw;

    if (omegaCos < 0.0) {
      omegaCos = -omegaCos;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }

    if (1.0 - omegaCos > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(omegaCos);
      omegaSin = Math.sin(omega);
      scale0 = Math.sin((1.0 - amount) * omega) / omegaSin;
      scale1 = Math.sin(amount * omega) / omegaSin;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - amount;
      scale1 = amount;
    } // calculate final values

    return this.set(
      scale0 * this.x + scale1 * bx,
      scale0 * this.y + scale1 * by,
      scale0 * this.z + scale1 * bz,
      scale0 * this.w + scale1 * bw
    );
  }
  invert(): Quaternion {
    let dot = this.dot(this);
    if (dot == 0) {
      return this.set(0, 0, 0, 0);
    }
    dot = 1 / dot;

    return this.set(
      -this.x * dot,
      -this.y * dot,
      -this.z * dot,
      this.w * dot
    );
  }
  conjugate(): Quaternion {
    this.set(
      -this.x,
      -this.y,
      -this.z,
      this.z
    );
    return this;
  }
  fromEuler(x: number, y: number, z: number): Quaternion {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;
    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);
    return this.set(
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz
    );
  }
  fromEulerVector (from: Vector3): Quaternion {
    return this.fromEuler(from.x, from.y, from.z);
  }

}
