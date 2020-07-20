
import { EPSILON } from "./math.js";
import { Vector3 } from "./vector3.js";
import { Quaternion } from "./quaterion.js";
/**4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.*/

interface Matrix4x4CreateOptions {
  data: Array<number> | Float32Array;
}

export class Matrix4x4 {
  data: Float32Array;
  constructor(opts: Matrix4x4CreateOptions | undefined = undefined) {
    if (opts && opts.data) {
      if (opts.data instanceof Array) {
        if (opts.data.length !== 16) throw `opts.data must be length 16, was ${opts.data.length}`;
        this.data = Float32Array.from(opts.data);
      } else {
        throw `Cannot instance Matrix4x4 with opts.data type as ${opts.data}`;
      }
    } else {
      this.data = Float32Array.from([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
    }
  }
  copy(to: Matrix4x4) {
    for (let i = 0; i < to.data.length; i++) {
      to.data[i] = this.data[i];
    }
  }
  clone(): Matrix4x4 {
    return new Matrix4x4({ data: this.data });
  }
  identity(): Matrix4x4 {
    this.data.set([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
    return this;
  }
  transpose(): Matrix4x4 {
    //We are transposing ourselves, so we can skip a few steps
    let data01 = this.data[1],
      data02 = this.data[2],
      data03 = this.data[3];
    let data12 = this.data[6],
      data13 = this.data[7];
    let data23 = this.data[11];
    this.data[1] = this.data[4];
    this.data[2] = this.data[8];
    this.data[3] = this.data[12];
    this.data[4] = data01;
    this.data[6] = this.data[9];
    this.data[7] = this.data[13];
    this.data[8] = data02;
    this.data[9] = data12;
    this.data[11] = this.data[14];
    this.data[12] = data03;
    this.data[13] = data13;
    this.data[14] = data23;
    return this;
  }
  invert(): Matrix4x4 {
    let data00 = this.data[0],
      data01 = this.data[1],
      data02 = this.data[2],
      data03 = this.data[3];
    let data10 = this.data[4],
      data11 = this.data[5],
      data12 = this.data[6],
      data13 = this.data[7];
    let data20 = this.data[8],
      data21 = this.data[9],
      data22 = this.data[10],
      data23 = this.data[11];
    let data30 = this.data[12],
      data31 = this.data[13],
      data32 = this.data[14],
      data33 = this.data[15];
    let b00 = data00 * data11 - data01 * data10;
    let b01 = data00 * data12 - data02 * data10;
    let b02 = data00 * data13 - data03 * data10;
    let b03 = data01 * data12 - data02 * data11;
    let b04 = data01 * data13 - data03 * data11;
    let b05 = data02 * data13 - data03 * data12;
    let b06 = data20 * data31 - data21 * data30;
    let b07 = data20 * data32 - data22 * data30;
    let b08 = data20 * data33 - data23 * data30;
    let b09 = data21 * data32 - data22 * data31;
    let b10 = data21 * data33 - data23 * data31;
    let b11 = data22 * data33 - data23 * data32; // Calculate the determinant

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    this.data[0] = (data11 * b11 - data12 * b10 + data13 * b09) * det;
    this.data[1] = (data02 * b10 - data01 * b11 - data03 * b09) * det;
    this.data[2] = (data31 * b05 - data32 * b04 + data33 * b03) * det;
    this.data[3] = (data22 * b04 - data21 * b05 - data23 * b03) * det;
    this.data[4] = (data12 * b08 - data10 * b11 - data13 * b07) * det;
    this.data[5] = (data00 * b11 - data02 * b08 + data03 * b07) * det;
    this.data[6] = (data32 * b02 - data30 * b05 - data33 * b01) * det;
    this.data[7] = (data20 * b05 - data22 * b02 + data23 * b01) * det;
    this.data[8] = (data10 * b10 - data11 * b08 + data13 * b06) * det;
    this.data[9] = (data01 * b08 - data00 * b10 - data03 * b06) * det;
    this.data[10] = (data30 * b04 - data31 * b02 + data33 * b00) * det;
    this.data[11] = (data21 * b02 - data20 * b04 - data23 * b00) * det;
    this.data[12] = (data11 * b07 - data10 * b09 - data12 * b06) * det;
    this.data[13] = (data00 * b09 - data01 * b07 + data02 * b06) * det;
    this.data[14] = (data31 * b01 - data30 * b03 - data32 * b00) * det;
    this.data[15] = (data20 * b03 - data21 * b01 + data22 * b00) * det;
    return this;
  }
  adjoint(): Matrix4x4 {
    let a00 = this.data[0],
      a01 = this.data[1],
      a02 = this.data[2],
      a03 = this.data[3];
    let a10 = this.data[4],
      a11 = this.data[5],
      a12 = this.data[6],
      a13 = this.data[7];
    let a20 = this.data[8],
      a21 = this.data[9],
      a22 = this.data[10],
      a23 = this.data[11];
    let a30 = this.data[12],
      a31 = this.data[13],
      a32 = this.data[14],
      a33 = this.data[15];
    this.data[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
    this.data[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    this.data[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
    this.data[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    this.data[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    this.data[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
    this.data[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    this.data[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
    this.data[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
    this.data[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    this.data[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
    this.data[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    this.data[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    this.data[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
    this.data[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    this.data[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
    return this;
  }
  determinant(): number {
    let a00 = this.data[0],
      a01 = this.data[1],
      a02 = this.data[2],
      a03 = this.data[3];
    let a10 = this.data[4],
      a11 = this.data[5],
      a12 = this.data[6],
      a13 = this.data[7];
    let a20 = this.data[8],
      a21 = this.data[9],
      a22 = this.data[10],
      a23 = this.data[11];
    let a30 = this.data[12],
      a31 = this.data[13],
      a32 = this.data[14],
      a33 = this.data[15];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  translate(by: Vector3): Matrix4x4 {
    return this.translateByValues(by.x, by.y, by.z);
  }
  translateByValues(x: number, y: number, z: number): Matrix4x4 {
    this.data[12] = this.data[0] * x + this.data[4] * y + this.data[8] * z + this.data[12];
    this.data[13] = this.data[1] * x + this.data[5] * y + this.data[9] * z + this.data[13];
    this.data[14] = this.data[2] * x + this.data[6] * y + this.data[10] * z + this.data[14];
    this.data[15] = this.data[3] * x + this.data[7] * y + this.data[11] * z + this.data[15];
    return this;
  }
  scale(by: Vector3): Matrix4x4 {
    this.data[0] *= by.x;
    this.data[1] *= by.x;
    this.data[2] *= by.x;
    this.data[3] *= by.x;
    this.data[4] *= by.y;
    this.data[5] *= by.y;
    this.data[6] *= by.y;
    this.data[7] *= by.y;
    this.data[8] *= by.z;
    this.data[9] *= by.z;
    this.data[10] *= by.z;
    this.data[11] *= by.z;
    return this;
  }
  rotate(byRadians: number, axis: Vector3): Matrix4x4 {
    let nAxis = axis.clone().normalize();
    //Don't bother if axis is nada
    if (nAxis.magnitude() < EPSILON) return this;

    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    let sine = Math.sin(byRadians);
    let cosine = Math.cos(byRadians);
    let theta = 1 - cosine;

    a00 = this.data[0];
    a01 = this.data[1];
    a02 = this.data[2];
    a03 = this.data[3];
    a10 = this.data[4];
    a11 = this.data[5];
    a12 = this.data[6];
    a13 = this.data[7];
    a20 = this.data[8];
    a21 = this.data[9];
    a22 = this.data[10];
    a23 = this.data[11]; // Construct the elements of the rotation matrix

    b00 = nAxis.x * nAxis.x * theta + cosine;
    b01 = nAxis.y * nAxis.x * theta + nAxis.z * sine;
    b02 = nAxis.z * nAxis.x * theta - nAxis.y * sine;
    b10 = nAxis.x * nAxis.y * theta - nAxis.z * sine;
    b11 = nAxis.y * nAxis.y * theta + cosine;
    b12 = nAxis.z * nAxis.y * theta + nAxis.x * sine;
    b20 = nAxis.x * nAxis.z * theta + nAxis.y * sine;
    b21 = nAxis.y * nAxis.z * theta - nAxis.x * sine;
    b22 = nAxis.z * nAxis.z * theta + cosine; // Perform rotation-specific matrix multiplication

    this.data[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this.data[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this.data[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this.data[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this.data[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this.data[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this.data[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this.data[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this.data[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this.data[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this.data[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this.data[11] = a03 * b20 + a13 * b21 + a23 * b22;

    return this;
  }
  setRotationFromQuaternion(from: Quaternion): Matrix4x4 {
    let x2 = from.x + from.x;
    let y2 = from.y + from.y;
    let z2 = from.z + from.z;
    let xx = from.x * x2;
    let yx = from.y * x2;
    let yy = from.y * y2;
    let zx = from.z * x2;
    let zy = from.z * y2;
    let zz = from.z * z2;
    let wx = from.w * x2;
    let wy = from.w * y2;
    let wz = from.w * z2;
    this.data[0] = 1 - yy - zz;
    this.data[1] = yx + wz;
    this.data[2] = zx - wy;
    this.data[4] = yx - wz;
    this.data[5] = 1 - xx - zz;
    this.data[6] = zy + wx;
    this.data[8] = zx + wy;
    this.data[9] = zy - wx;
    this.data[10] = 1 - xx - yy;
    return this;
  }
  frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
    let rl = 1 / (right - left);
    let tb = 1 / (top - bottom);
    let nf = 1 / (near - far);
    this.data[0] = near * 2 * rl;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    this.data[4] = 0;
    this.data[5] = near * 2 * tb;
    this.data[6] = 0;
    this.data[7] = 0;
    this.data[8] = (right + left) * rl;
    this.data[9] = (top + bottom) * tb;
    this.data[10] = (far + near) * nf;
    this.data[11] = -1;
    this.data[12] = 0;
    this.data[13] = 0;
    this.data[14] = far * near * 2 * nf;
    this.data[15] = 0;
    return this;
  }
  perspective(fov: number, aspect: number, near: number, far: number): Matrix4x4 {
    let f = 1.0 / Math.tan(fov / 2);
    let nf;
    this.data[0] = f / aspect;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    this.data[4] = 0;
    this.data[5] = f;
    this.data[6] = 0;
    this.data[7] = 0;
    this.data[8] = 0;
    this.data[9] = 0;
    this.data[11] = -1;
    this.data[12] = 0;
    this.data[13] = 0;
    this.data[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      this.data[10] = (far + near) * nf;
      this.data[14] = 2 * far * near * nf;
    } else {
      this.data[10] = -1;
      this.data[14] = -2 * near;
    }
    return this;
  }
  ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4x4 {
    let lr = 1 / (left - right);
    let bt = 1 / (bottom - top);
    let nf = 1 / (near - far);
    this.data[0] = -2 * lr;
    this.data[1] = 0;
    this.data[2] = 0;
    this.data[3] = 0;
    this.data[4] = 0;
    this.data[5] = -2 * bt;
    this.data[6] = 0;
    this.data[7] = 0;
    this.data[8] = 0;
    this.data[9] = 0;
    this.data[10] = 2 * nf;
    this.data[11] = 0;
    this.data[12] = (left + right) * lr;
    this.data[13] = (top + bottom) * bt;
    this.data[14] = (far + near) * nf;
    this.data[15] = 1;
    return this;
  }
  add(other: Matrix4x4): Matrix4x4 {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = this.data[i] + other[i];
    }
    return this;
  }
  sub(other: Matrix4x4): Matrix4x4 {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = this.data[i] - other[i];
    }
    return this;
  }
  mulScalar(by: number): Matrix4x4 {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = this.data[i] * by;
    }
    return this;
  }
  mul(other: Matrix4x4): Matrix4x4 {
    let b = other.data;
    let a00 = this.data[0],
      a01 = this.data[1],
      a02 = this.data[2],
      a03 = this.data[3];
    let a10 = this.data[4],
      a11 = this.data[5],
      a12 = this.data[6],
      a13 = this.data[7];
    let a20 = this.data[8],
      a21 = this.data[9],
      a22 = this.data[10],
      a23 = this.data[11];
    let a30 = this.data[12],
      a31 = this.data[13],
      a32 = this.data[14],
      a33 = this.data[15]; // Cache only the current line of the second matrix

    let b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    this.data[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.data[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.data[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.data[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    this.data[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.data[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.data[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.data[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    this.data[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.data[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.data[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.data[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    this.data[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    this.data[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    this.data[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    this.data[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return this;
  }
  equals(other: Matrix4x4, useStrictEquals: boolean = true): boolean {
    for (let i = 0; i < this.data.length; i++) {
      if (useStrictEquals) {
        if (this.data[i] !== other[i]) return false;
      } else {
        if (Math.abs(this.data[i] - other[i]) < EPSILON) return false;
      }
    }
    return true;
  }
}
