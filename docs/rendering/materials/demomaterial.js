import { Material } from "../material.js";
import { DemoShader } from "../shaders/demoshader.js";
export class DemoMaterial extends Material {
  static singleton = undefined;

  constructor() {
    super();
    this.setShader(DemoShader.get());
  }

  static get() {
    if (!DemoMaterial.singleton) DemoMaterial.singleton = new DemoMaterial();
    return DemoMaterial.singleton;
  }

}