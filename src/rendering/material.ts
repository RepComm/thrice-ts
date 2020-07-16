import { Shader } from "./shader.js";

export class Material {
  shader: Shader;
  constructor () {

  }
  setShader (shader: Shader): Material {
    this.shader = shader;
    return this;
  }
}
