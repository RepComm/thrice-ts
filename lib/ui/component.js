import { on, off, make, rect } from "./aliases.js";
/**
 * @author Jonathan Crowder
 */

export default class Component {
  constructor() {}
  /**Mounts the component to a parent HTML element*/


  mount(parent) {
    if (parent instanceof HTMLElement) {
      parent.appendChild(this.element);
    } else if (parent instanceof Component) {
      parent.element.appendChild(this.element);
    } else {
      throw "Cannot append to parent because its not a Component or HTMLElement";
    }

    return this;
  }
  /**Mounts child component or html element to this*/


  mountChild(child) {
    if (child instanceof HTMLElement) {
      this.element.appendChild(child);
    } else if (child instanceof Component) {
      this.element.appendChild(child.element);
    } else {
      throw "Cannot append child because its not a Component or HTMLElement";
    }

    return this;
  }
  /**Listen to events on this componenet's element*/


  on(type, callback, options) {
    on(this.element, type, callback, options);
    return this;
  }
  /**Stop listening to an event on this componenet's element*/


  off(type, callback) {
    off(this.element, type, callback);
    return this;
  }
  /**Set the element id*/


  id(str) {
    this.element.id = str;
    return this;
  }
  /**Add CSS classes*/


  addClasses(...classnames) {
    this.element.classList.add(...classnames);
    return this;
  }
  /**Remove CSS classes*/


  removeClasses(...classnames) {
    this.element.classList.remove(...classnames);
    return this;
  }
  /**Make the element of this component a type of HTMLElement*/


  make(type) {
    this.element = make(type);
    return this;
  }
  /**Use a native element instead of creating one*/


  useNative(element) {
    this.element = element;
    return this;
  }
  /**Sets the textContent of this element*/


  textContent(str) {
    this.element.textContent = str;
    return this;
  }
  /**Adds the .hide class to the element*/


  hide() {
    this.addClasses("hide");
    return this;
  }
  /**Removes the .hide class from the element*/


  show() {
    this.removeClasses("hide");
    return this;
  }
  /**Sets the style.left prop*/


  set left(x) {
    this.element.style.left = x;
  }
  /**Sets the style.top prop*/


  set top(y) {
    this.element.style.top = y;
  }
  /**Alias of getBoundingClientRect */


  get rect() {
    return rect(this.element);
  }
  /**@param {string} type of input.type*/


  inputType(t) {
    if (this.element instanceof HTMLInputElement) throw "type is meant to be set when the element is an HTMLInputElement";
    this.element.type = t;
    return this;
  }
  /**Removes children components*/


  removeChildren() {
    while (this.element.lastChild) {
      this.element.lastChild.remove();
    }

    return this;
  }
  /**Sets the background image*/


  backgroundImage(url) {
    this.element.style["background-image"] = `url(${url})`;
    return this;
  }

  click() {
    this.element.click();
  }

}