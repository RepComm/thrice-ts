import { Input } from "./input.js";
import { on, off } from "../ui/aliases.js";
export class InputBinding {
  constructor() {
    this.keys = new Set();
    this.rects = new Set();
    this.gpBtns = new Set();
    this.padAxes = new Set();
  }

  setKeys(...keys) {
    if (keys.length < 1) throw "Use at least one key";
    this.keys.clear();
    this.addKeys(...keys);
    return this;
  }

  addKeys(...keys) {
    for (let k of keys) {
      this.addKey(k);
    }

    return this;
  }

  addKey(key) {
    if (typeof key !== "string") throw `Key must be type of string, got ${typeof key}`;
    if (this.keys.has(key)) throw `Cannot add keyboard key ${key} twice!`;
    this.keys.add(key);
    return this;
  }

  addRect(r) {
    if (r instanceof TouchRect) throw `${r} not an instance of TouchRect`;
    if (this.rects.has(r)) throw "Cannot add TouchRect twice!";
    this.rects.add(r);
    return this;
  }

  addPadButton(btn) {
    if (typeof btn !== "number") throw `${btn} not a number: is ${typeof btn}`;
    if (this.gpBtns.has(btn)) throw `Cannot add gamepad button ${btn} twice!`;
    this.gpBtns.add(btn);
    return this;
  }

  addPadButtons(...btns) {
    for (let btn of btns) {
      this.addPadButton(btn);
    }

    return this;
  }

  addPadAxisRule(rule) {
    if (rule instanceof AxisRule) throw `${rule} not instanceof AxisRule`;
    if (this.padAxes.has(rule)) throw "Cannot add axis rule twice";
    this.padAxes.add(rule);
    return this;
  }

  createPadAxisRule(axisId, rule, compareValue) {
    let result = new AxisRule().setAxisId(axisId).setCompareRule(rule).setCompareValue(compareValue);
    this.addPadAxisRule(result);
    return result;
  }

  test(input) {
    //Test keyboard (quick when no keys have been pressed)
    for (let k of this.keys) {
      if (input.raw.keyboard.get(k)) return true;
    } //console.log("Gamepad found");
    //Test all the gamepad buttons assigned


    for (let gpBtn of this.gpBtns) {
      if (input.getGamePadManager().getPrimaryButton(gpBtn)) {
        return true;
      }
    }

    if (input.getGamePadManager().ensure()) {
      //Test all the gamepad axis rules
      for (let rule of this.padAxes) {
        let gp = input.getGamePadManager().getPrimary();

        if (rule.test(gp)) {
          // if (gp.vibrationActuator) {
          //   gp.vibrationActuator.playEffect("dual-rumble", {
          //     startDelay: 0,
          //     duration: parseInt(30 * Math.random()),
          //     weakMagnitude: Math.random(),
          //     strongMagnitude: Math.random()
          //   })
          // }
          return true;
        }
      }
    } else {//console.log("No gamepad found");
    } //Check touch rectangles


    if (!input.pointerPrimary) return false;

    for (let r of this.rects) {
      if (r.pointInside(input.pointerNormalizedX, input.pointerNormalizedY)) return true;
    }

    return false;
  }

}
export class GamePadManager {
  static SINGLETON = undefined;

  constructor() {
    if (!GamePadManager.SINGLETON) {
      GamePadManager.SINGLETON = this;
    } else {
      throw "GamePadManager should not be instantiated more than once";
    }

    this.primary = undefined;
    this.allGamePadsFix = new Array();

    this.onGamePadConnected = evt => {
      if (evt.gamepad !== null) {
        this.allGamePadsFix.push(evt.gamepad);
        console.log("Added gamepad", evt.gamepad);
      } else {
        console.log("Couldn't add null gamepad");
      }
    };

    this.onGamePadDisconnected = evt => {
      let ind = this.allGamePadsFix.indexOf(evt.gamepad);

      if (ind === -1) {
        console.warn("Cannot remove disconnected controller that was never added");
        return;
      }

      this.allGamePadsFix.splice(ind, 1);
    };

    this.registerEvents();
  }

  static get() {
    if (!GamePadManager.SINGLETON) {
      new GamePadManager();
    }

    return GamePadManager.SINGLETON;
  }

  registerEvents() {
    on(window, "gamepadconnected", this.onGamePadConnected);
    on(window, "gamepaddisconnected", this.onGamePadDisconnected);
  }

  unregisterEvents() {
    off(window, "gamepadconnected", this.onGamePadConnected);
    off(window, "gamepaddisconnected", this.onGamePadDisconnected);
  }

  nativeGetAllGamepads() {
    return navigator.getGamepads();
  }

  findGamepad() {
    let gps = this.nativeGetAllGamepads();

    for (let gp of gps) {
      if (gp && gp.connected) {
        return gp;
      }
    }

    return undefined;
  }
  /**Tries to populate the primary controller
   * Returns success or not
   */


  ensure() {
    if (!this.primary || !this.primary.connected) {
      this.primary = this.findGamepad();

      if (this.primary === undefined) {
        //console.warn("Couldn't find any valid game pads in navigator..");
        return false;
      }

      return true;
    }

    return true;
  }

  getPrimary() {
    return this.primary;
  }

  getPrimaryButton(btn) {
    if (this.ensure()) {
      return this.getPrimary().buttons[btn].pressed;
    }

    return false;
  }

}
export class AxisRule {
  static GREATER_THAN = 0;
  static LESS_THAN = 1;
  axisId = 0;

  constructor() {
    this.axisId = 0;
    this.rule = AxisRule.GREATER_THAN;
    this.compareValue = 0.5;
  }

  setAxisId(id) {
    this.axisId = id;
    return this;
  }

  getAxisId() {
    return this.axisId;
  }

  setCompareValue(v) {
    this.compareValue = v;
    return this;
  }

  getCompareValue() {
    return this.compareValue;
  }

  setCompareRule(rule) {
    if (typeof rule !== "number") throw `Rule ${rule} not a number`;
    this.rule = rule;
    return this;
  }

  getCompareRule() {
    return this.rule;
  }

  test(gp) {
    let ax = gp.axes[this.axisId];

    if (this.rule === AxisRule.GREATER_THAN) {
      return ax > this.compareValue;
    } else if (this.rule === AxisRule.LESS_THAN) {
      return ax < this.compareValue;
    }
  }

}
export class TouchRect {
  constructor(left = 0, top = 0, width = 1, height = 1) {
    if (typeof top !== "number") throw "top must be a number";
    if (typeof left !== "number") throw "left must be a number";
    if (typeof width !== "number") throw "width must be a number";
    if (typeof height !== "number") throw "height must be a number";
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }

  setPosition(top, left) {
    this.top = top;
    this.left = left;
    return this;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }

  pointInside(nx, ny) {
    return nx > this.left && nx < this.left + this.width && ny > this.top && ny < this.top + this.height;
  }

}
export class GameInput {
  static SINGLETON = undefined;

  constructor() {
    if (!GameInput.SINGLETON) {
      GameInput.SINGLETON = this;
    } else {
      throw "GameInput should not be instantiated more than once";
    }

    this.raw = new Input();
    this.raw.registerEvents();
    this.inputBindings = new Map();
    this.renderer = undefined;
    this.gamePadManager = GamePadManager.get();
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  static get() {
    if (!GameInput.SINGLETON) {
      new GameInput();
    }

    return GameInput.SINGLETON;
  }

  addBinding(name, binding) {
    if (this.inputBindings.has(name)) throw `Cannot add ${name} as it is in use already`;
    this.inputBindings.set(name, binding);
  }

  createBinding(name) {
    let result = new InputBinding();
    this.addBinding(name, result);
    return result;
  }

  hasBinding(name) {
    return this.inputBindings.has(name);
  }

  getBinding(name) {
    if (!this.hasBinding(name)) throw `No binding found for ${name}`;
    return this.inputBindings.get(name);
  }

  getButton(name) {
    return this.getBinding(name).test(this);
  }

  static getButton(name) {
    return GameInput.SINGLETON.getButton(name);
  }

  get pointerScreenX() {
    return this.raw.pointer.x;
  }

  static get pointerScreenX() {
    return GameInput.SINGLETON.pointerScreenX;
  }

  get pointerScreenY() {
    return this.raw.pointer.y;
  }

  static get pointerScreenY() {
    return GameInput.SINGLETON.pointerScreenY;
  }

  get pointerWorldX() {
    return this.pointerScreenCenteredX - this.renderer.center.x;
  }

  static get pointerWorldX() {
    return GameInput.SINGLETON.pointerWorldX;
  }

  get pointerWorldY() {
    return this.pointerScreenCenteredY - this.renderer.center.y;
  }

  static get pointerWorldY() {
    return GameInput.SINGLETON.pointerWorldY;
  }

  get pointerScreenCenteredX() {
    return (this.pointerScreenX - this.renderer.rect.width / 2) / this.renderer.zoom;
  }

  static get pointerScreenCenteredX() {
    return GameInput.SINGLETON.pointerScreenCenteredX;
  }

  get pointerScreenCenteredY() {
    return (this.pointerScreenY - this.renderer.rect.height / 2) / this.renderer.zoom;
  }

  static get pointerScreenCenteredY() {
    return GameInput.SINGLETON.pointerScreenCenteredY;
  }

  get pointerPrimary() {
    return this.raw.pointer.leftDown;
  }

  static get pointerPrimary() {
    return GameInput.SINGLETON.pointerPrimary;
  }

  get pointerSecondary() {
    return this.raw.pointer.rightDown;
  }

  static get pointerSecondary() {
    return GameInput.SINGLETON.pointerSecondary;
  }

  get pointerNormalizedX() {
    return this.raw.pointer.x / this.renderer.rect.width;
  }

  static get pointerNormalizedX() {
    return GameInput.SINGLETON.pointerNormalizedX;
  }

  get pointerNormalizedY() {
    return this.raw.pointer.y / this.renderer.rect.height;
  }

  static get pointerNormalizedY() {
    return GameInput.SINGLETON.pointerNormalizedY;
  }

  getGamePadManager() {
    return this.gamePadManager;
  }

}