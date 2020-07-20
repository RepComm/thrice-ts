
export class Shader {
  vertexProgram: string;
  fragmentProgram: string;
  glVertShaderInstance: WebGLShader;
  glFragShaderInstance: WebGLShader;
  glProgram: WebGLProgram;
  ready: boolean;
  glShaderPosAttrName: string = "aVertexPosition";
  glPosAttributePointer: number = -1;
  glShaderProjectionAttrName: string = "uProjectionMatrix";
  glProjectionAttributePointer: WebGLUniformLocation = null;
  glShaderModelViewAttrName: string = "uModelViewMatrix";
  glModelViewAttributePointer: WebGLUniformLocation = null;
  constructor () {
    this.setReady(false);
  }
  setVertexProgram (v: string): Shader {
    this.setReady(false);
    this.vertexProgram = v;
    return this;
  }
  setFragmentProgram (f: string): Shader {
    this.setReady(false);
    this.fragmentProgram = f;
    return this;
  }
  setReady (ready: boolean = true): Shader {
    this.ready = ready;
    return this;
  }
  getReady (): boolean {
    return this.ready;
  }
  compile (ctx: WebGL2RenderingContext) {
    this.glVertShaderInstance = ctx.createShader(ctx.VERTEX_SHADER);
    ctx.shaderSource(this.glVertShaderInstance, this.vertexProgram);
    ctx.compileShader(this.glVertShaderInstance);

    if (!ctx.getShaderParameter(this.glVertShaderInstance, ctx.COMPILE_STATUS)) {
      ctx.deleteShader(this.glVertShaderInstance);
      throw "Vertex shader did not compile, gl error is as follows:" + ctx.getShaderInfoLog(this.glVertShaderInstance);
    }

    this.glFragShaderInstance = ctx.createShader(ctx.FRAGMENT_SHADER);
    ctx.shaderSource(this.glFragShaderInstance, this.fragmentProgram);
    ctx.compileShader(this.glFragShaderInstance);

    if (!ctx.getShaderParameter(this.glFragShaderInstance, ctx.COMPILE_STATUS)) {
      ctx.deleteShader(this.glFragShaderInstance);
      throw `Fragment shader did not compile, gl error is as follows: ${ctx.getShaderInfoLog(this.glVertShaderInstance)}`;
    }

    this.glProgram = ctx.createProgram();
    ctx.attachShader(this.glProgram, this.glVertShaderInstance);
    ctx.attachShader(this.glProgram, this.glFragShaderInstance);
    ctx.linkProgram(this.glProgram);

    if (!ctx.getProgramParameter(this.glProgram, ctx.LINK_STATUS)) {
      throw `Shader program couldn't init, gl error is as follows:" + ${ctx.getProgramInfoLog(this.glProgram)}`;
    }

    //Set up attribute pointers
    //Get a pointer to shader's position data
    if (this.glPosAttributePointer === -1) {
      this.glPosAttributePointer = ctx.getAttribLocation(
        this.glProgram,
        this.glShaderPosAttrName
      );
    }

    //Get pointer to shader's projection
    if (this.glProjectionAttributePointer === null) {
      this.glProjectionAttributePointer = ctx.getUniformLocation(
        this.glProgram, this.glShaderProjectionAttrName
      );
    }

    //Get pointer to shader's model view
    if (this.glModelViewAttributePointer === null) {
      this.glModelViewAttributePointer = ctx.getUniformLocation(
        this.glProgram, this.glShaderModelViewAttrName
      );
    }

    this.setReady(true);
  }
  /**What the name of the varying vert position attribute found in vertex shader
   * Name must match or shaders will be used incorrectly
   * @param name aVertexPosition
   */
  setVertexPositionName (name: string) {
    this.setReady(false);
    this.glShaderPosAttrName = name;
  }
  setProjectionName (name: string) {
    this.setReady(false);
    this.glShaderProjectionAttrName = name;
  }
  setModelViewName (name: string) {
    this.setReady(false);
    this.glShaderModelViewAttrName = name;
  }
}
