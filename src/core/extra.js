/**
 *
 * Extra class for Grapper web component
 *
 * @module extra
 * @version 0.0.3
 * @author Pablo Almunia
 *
 */
import {
  Base,
  Simple,
  define as defineBase,
  RENDER,
  REFRESH,
  CHANGE,
  CONTEXT,
  FIRE_EVENT,
  ONCONNECT,
  ONDISCONNECT
} from './base.js';
import { isFunction } from "./helpers/types.js";

/**
 * Symbol used for defines the resize method into the class inherited from Base.
 * This method is called when the component is resized.
 * @type {symbol}
 */
const RESIZE    = Symbol();
/**
 * Symbol used for defines the map with CSS properties info.
 * @type {symbol}
 */
const CSS_PROPS = Symbol();

/**
 * Extra class for Grapper Web Component

 * @fires 'resize' - This event fires when the component size is changed
 */
class Extra extends Base {

  /**
   * @constructor
   * @param {boolean} [ready]
   */
  constructor (ready) {
    super(ready);
  }


  /**
   * Connected with the parent DOM
   *   - Resize observer
   * @private
   */
  connectedCallback () {
    let reference     = this.getBoundingClientRect();
    let flexDirection = getComputedStyle(this).flexDirection; // Specific for Icon class
    const resize      = () => {
      let {width : currentWidth, height : currentHeight} = this.getBoundingClientRect();
      let currentFlexDirection                           = getComputedStyle(this).flexDirection;
      if (currentWidth !== reference.width || currentHeight !== reference.height || currentFlexDirection !== flexDirection) {
        if (isFunction(this[RESIZE])) {
          this[RESIZE](
            currentWidth,
            currentHeight,
            currentWidth - reference.width,
            currentHeight - reference.height
          );
        }
        reference     = {width : currentWidth, height : currentHeight};
        flexDirection = currentFlexDirection;
        this[FIRE_EVENT]('resize', reference);
      }
      this [CONTEXT]._resizeObserver = window.requestAnimationFrame(resize);
    };
    resize();
    super.connectedCallback();
  }

  /**
   * Disconnected of parent DOM
   *   - Remove resize observer
   * @private
   */
  disconnectedCallback () {
    window.cancelAnimationFrame(this [CONTEXT]._resizeObserver);
    super.disconnectedCallback();
  }

}


/**
 *
 * Property descriptor used into defineProperty
 *
 * @typedef {Object} cssPropertyDescriptor
 * @property {string}  name              - custom property name
 * @property {string}  [syntax='']       - syntax of the custom property
 * @property {string}  [initialValue=''] - initial value
 * @property {string}  [value='']        - initial value (alias)
 * @property {boolean} [inherits=false]  - inherit
 */

/**
 *
 * Define a CSS property into the class
 *
 * @param {Function} Class            - class to extend
 * @param {cssPropertyDescriptor} def - options into a {@link cssPropertyDescriptor}
 */
function defineStyleProperty (Class, def) {
  const definition = {
    name         : def.name.startsWith('--') ?
      def.name :
      `--${ def.name }`,
    initialValue : def.initialValue ?? def.value ?? '',
    syntax       : def.syntax ?? '*',
    inherits     : def.inherits ?? true
  };
  if (!Class.prototype[CSS_PROPS]) {
    Class.prototype[CSS_PROPS] = {};
  }
  Class.prototype[CSS_PROPS][definition.name] = definition;
}

/**
 * Define a Base or
 * @param {Function} Class
 * @returns {object}
 */
function define (Class) {
  const def = defineBase(Class, {
    style : (...styles) => {
      styles.forEach(style => defineStyleProperty(Class, {...style}));
      return def;
    }
  });
  return def;
}

/**
 * Export
 */
export {
  Extra as default,
  Extra,
  Base,
  Simple,
  define,
  RENDER,
  REFRESH,
  CHANGE,
  CONTEXT,
  RESIZE,
  CSS_PROPS,
  FIRE_EVENT,
  ONCONNECT,
  ONDISCONNECT
};
