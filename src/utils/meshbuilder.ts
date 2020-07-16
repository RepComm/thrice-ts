import { BufferMesh } from "src/rendering/BufferMesh";

export class MeshBuilder {
  indicies: Array<number>;
  vertices: Array<number>;
  finalVertCount: number;
  constructor () {
    this.indicies = new Array();
    this.vertices = new Array();
    this.finalVertCount = 0;
  }
  /**@returns index*/
  addVert (vx:number, vy:number, vz:number): number {
    this.finalVertCount++;
    let result = this.vertices.length;
    this.vertices.push(vx, vy, vz);
    return result;
  }
  addTri (ind0, ind1, ind2) {
    this.indicies.push(ind0, ind1, ind2);
  }
  build (mesh: BufferMesh) {
    mesh.setVertexData(
      Float32Array.from(this.vertices)
    );
    mesh.setIndexData(
      Uint32Array.from(this.indicies)
    );
    mesh.vertexCount = this.finalVertCount;
  }
  clear () {
    this.vertices.length = 0;
    this.indicies.length = 0;
    this.finalVertCount = 0;
  }
}
