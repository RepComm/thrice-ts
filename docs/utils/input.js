import { on, off } from "../ui/aliases.js";
export class Input {
  constructor() {
    this.pointer = {
      x: 0,
      y: 0,
      lx: 0,
      ly: 0,
      leftDown: false,
      rightDown: false,
      locked: false,
      mx: 0,
      my: 0
    };
    this.keyboard = new Map();

    this.onMouseMove = evt => {
      if (evt.buttons > 0) {
        if (evt.button === 0) {
          this.pointer.leftDown = true;
        } else if (evt.button === 2) {
          this.pointer.rightDown = true;
        }
      }

      this.setPointerXY(evt.clientX, evt.clientY);
      this.setMovementXY(evt.movementX, evt.movementY);
      this.onEvent("pointer-move");
    };

    this.onTouchMove = evt => {
      let item = evt.changedTouches.item(0);
      this.pointer.leftDown = true;
      this.setPointerXY(item.clientX, item.clientY);
      this.onEvent("pointer-move");
    };

    this.onMouseDown = evt => {
      evt.preventDefault();
      this.setPointerXY(evt.clientX, evt.clientY);

      if (evt.button === 0) {
        this.pointer.leftDown = true;
      } else if (evt.button === 2) {
        this.pointer.rightDown = true;
      }

      this.onEvent("pointer-down");
    };

    this.onTouchStart = evt => {
      this.pointer.leftDown = true;
      let item = evt.changedTouches.item(0);
      this.setPointerXY(item.clientX, item.clientY);
      this.onEvent("pointer-down");
    };

    this.onMouseUp = evt => {
      this.setPointerXY(evt.clientX, evt.clientY);

      if (evt.button === 0) {
        this.pointer.leftDown = false;
      } else if (evt.button === 2) {
        this.pointer.rightDown = false;
      }

      this.onEvent("pointer-up");
    };

    this.onTouchEnd = evt => {
      this.pointer.leftDown = false;
      let item = evt.changedTouches.item(0);
      this.setPointerXY(item.clientX, item.clientY);
      this.onEvent("pointer-up");
    };

    this.onTouchCancel = evt => {
      this.pointer.leftDown = false;
      let item = evt.changedTouches.item(0);
      this.setPointerXY(item.clientX, item.clientY);
      this.onEvent("pointer-up");
    };
    /**@param {KeyboardEvent} evt*/


    this.onKeyDown = evt => {
      this.keyboard.set(evt.key, true);
      this.onEvent("key-down");
    };

    this.onKeyUp = evt => {
      this.keyboard.set(evt.key, false);
      this.onEvent("key-up");
    };

    this.onContextMenu = evt => {
      evt.preventDefault();
    };

    this.listeners = new Set();

    this.pointerLockChange = e => {
      this.pointer.locked = document.pointerLockElement !== null;
    };
  }

  setMovementXY(x, y) {
    this.pointer.mx = x;
    this.pointer.my = y;
  }

  consumeMovementX() {
    let result = this.pointer.mx;
    this.pointer.mx = 0;
    return result;
  }

  consumeMovementY() {
    let result = this.pointer.my;
    this.pointer.my = 0;
    return result;
  }

  setPointerXY(x, y) {
    this.pointer.lx = this.pointer.x;
    this.pointer.ly = this.pointer.y;
    this.pointer.x = x;
    this.pointer.y = y;
  }

  listen(cb) {
    if (!cb) throw "Callback cannot be " + cb;
    if (this.listeners.has(cb)) throw "Cannot add same listener twice";
    this.listeners.add(cb);
  }

  deafen(cb) {
    if (!this.listeners.has(cb)) return false;
    this.listeners.delete(cb);
    return true;
  }

  unregisterEvents() {
    off(window, "mousemove", this.onMouseMove);
    off(window, "touchmove", this.onTouchMove);
    off(window, "mousedown", this.onMouseDown);
    off(window, "touchstart", this.onTouchStart);
    off(window, "mouseup", this.onMouseUp);
    off(window, "touchend", this.onTouchEnd);
    off(window, "touchcancel", this.onTouchCancel);
    off(window, "keyup", this.onKeyUp);
    off(window, "keydown", this.onKeyDown);
    off(window, "contextmenu", this.onContextMenu);
  }

  registerEvents() {
    on(window, "mousemove", this.onMouseMove);
    on(window, "touchmove", this.onTouchMove);
    on(window, "mousedown", this.onMouseDown);
    on(window, "touchstart", this.onTouchStart);
    on(window, "mouseup", this.onMouseUp);
    on(window, "touchend", this.onTouchEnd);
    on(window, "touchcancel", this.onTouchCancel);
    on(window, "keyup", this.onKeyUp);
    on(window, "keydown", this.onKeyDown);
    on(window, "contextmenu", this.onContextMenu);
  }

  onEvent(type) {
    for (let l of this.listeners) {
      l(type);
    }
  }

  tryLock(canvas) {
    this.pointerLockElement = canvas;
    document.addEventListener("pointerlockchange", e => this.pointerLockChange(e));
    this.pointerLockElement.requestPointerLock();
  }

  unlock() {
    document.exitPointerLock();
  }

}