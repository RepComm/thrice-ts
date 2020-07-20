export class MeshBuilder {
  constructor() {
    this.indicies = new Array();
    this.vertices = new Array();
    this.colors = new Array();
    this.finalVertCount = 0;
  }
  /**@returns index*/


  addVert(vx, vy, vz) {
    this.finalVertCount++;
    let result = this.vertices.length;
    this.vertices.push(vx, vy, vz);
    return result;
  }

  addTri(ind0, ind1, ind2) {
    this.indicies.push(ind0, ind1, ind2);
    return this;
  }

  addQuad(ind0, ind1, ind2, ind3) {
    this.indicies.push(ind0, ind1, ind2, ind2, ind3, ind0);
    return this;
  }

  addColor(r, g, b, a) {
    this.colors.push(r, g, b, a);
    return this;
  }

  build(mesh) {
    mesh.setVertexData(Float32Array.from(this.vertices));
    mesh.setIndexData(Uint16Array.from(this.indicies));
    mesh.setColorData(Float32Array.from(this.colors));
    mesh.vertexCount = this.finalVertCount;
  }

  clear() {
    this.vertices.length = 0;
    this.indicies.length = 0;
    this.colors.length = 0;
    this.finalVertCount = 0;
  }

}