
import { Shader } from "../shader.js";

export class DemoShader extends Shader {
  static singleton: DemoShader = undefined;
  constructor () {
    super();
    this.setVertexProgram(`
      attribute vec4 aVertexPosition;
      //Passed from materials
      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      //Program that gets executed per vertex
      void main() {
        //Multiply position data by vertex local position to get world position
        //Output it to gl_Position where it will be used for rasterizing pixels
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        // gl_Position = aVertexPosition * uModelViewMatrix;
      }
    `);
    this.setFragmentProgram(`
      void main(){
        gl_FragColor=vec4(1.0, 1.0, 1.0, 1.0);
      }
    `);
  }
  static get(): DemoShader {
    if (!DemoShader.singleton) DemoShader.singleton = new DemoShader();
    return DemoShader.singleton;
  }
}
