import { BufferMesh } from "src/rendering/buffermesh";

export class MeshBuilder {
  indicies: Array<number>;
  vertices: Array<number>;
  colors: Array<number>;
  finalVertCount: number;
  constructor () {
    this.indicies = new Array();
    this.vertices = new Array();
    this.colors = new Array();
    this.finalVertCount = 0;
  }
  /**@returns index*/
  addVert (vx:number, vy:number, vz:number): number {
    this.finalVertCount++;
    let result = this.vertices.length;
    this.vertices.push(vx, vy, vz);
    return result;
  }
  addTri (ind0: number, ind1: number, ind2: number): MeshBuilder {
    this.indicies.push(ind0, ind1, ind2);
    return this;
  }
  addQuad (ind0: number, ind1: number, ind2: number, ind3: number): MeshBuilder {
    this.indicies.push(
      ind0, ind1, ind2,
      ind2, ind3, ind0 
    );
    return this;
  }
  addColor (r, g, b, a): MeshBuilder {
    this.colors.push(r, g, b, a);
    return this;
  }
  build (mesh: BufferMesh) {
    mesh.setVertexData(
      Float32Array.from(this.vertices)
    );
    mesh.setIndexData(
      Uint16Array.from(this.indicies)
    );
    mesh.setColorData(
      Float32Array.from(this.colors)
    );
    mesh.vertexCount = this.finalVertCount;
  }
  clear () {
    this.vertices.length = 0;
    this.indicies.length = 0;
    this.colors.length = 0;
    this.finalVertCount = 0;
  }
}
