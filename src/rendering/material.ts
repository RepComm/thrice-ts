import { Shader } from "./shader.js";

export class Material {
  shader: Shader;
  constructor () {

  }
  setShader (shader: Shader): Material {
    this.shader = shader;
    return this;
  }
  compileShaders (ctx: WebGL2RenderingContext): Material {
    if (!this.shader.getReady()) this.shader.compile(ctx);
    return this;
  }
}
