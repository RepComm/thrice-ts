
import { Material } from "../material.js";

import { DemoShader } from "../shaders/demoshader.js";

export class DemoMaterial extends Material {
  static singleton: DemoMaterial = undefined;
  constructor() {
    super();
    this.setShader(DemoShader.get());
  }
  static get(): DemoMaterial {
    if (!DemoMaterial.singleton) DemoMaterial.singleton = new DemoMaterial();
    return DemoMaterial.singleton;
  }
}
