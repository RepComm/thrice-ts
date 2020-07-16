export class Material {
  constructor() {}

  setShader(shader) {
    this.shader = shader;
    return this;
  }

  compileShaders(ctx) {
    if (!this.shader.getReady()) this.shader.compile(ctx);
    return this;
  }

}