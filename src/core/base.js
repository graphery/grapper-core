/**
 *
 * Base class for Grapper web component
 *
 * @module base
 * @version 0.0.3
 * @author Pablo Almunia
 *
 */
import {
  Simple,
  define as defineSimple,
  CHANGE,
  CONTEXT,
  FIRE_EVENT
} from './simple.js';
import {
  isUndefined, isFunction
} from './helpers/types.js';
import {
  debounceMethodAsync, posExecution, preCondition
} from './helpers/functions.js';

// Constants
const DELAY = 1;

// Public symbols


/**
 * Represents a unique symbol used as an identifier or key for connections.
 * Mainly used to mark or handle events related to a connection being
 * established. This symbol ensures there is no conflict with other
 * property keys.
 * @type {symbol}
 */
const ONCONNECT = Symbol();

/**
 * A unique symbol used to represent the event of a disconnect action.
 * Can be utilized as a key or identifier for managing or listening to disconnect
 * events in an application context.
 * @type {symbol}
 */
const ONDISCONNECT = Symbol();

/**
 * Symbol used for defines the refresh method into the class inherited from Base.
 * This method is called when the component is rendered and when some property
 * is changed and REFRESH is defined as pos update action.
 * @type {symbol}
 */
const REFRESH = Symbol();
/**
 * Symbol used for defines the render method into the class inherited from Base
 * This method is called when the component is created and when some property
 * is changed and RENDER is define as pos update action.
 * @type {symbol}
 */
const RENDER  = Symbol();

/**
 * Executes an array of callback functions associated with a given key on an element.
 *
 * @param {Object} el - The element object containing the callback array.
 * @param {string} id - The key identifying the array of callbacks in the element object.
 */
const runCallbacks = (el, id) => el[id]?.forEach(fn => isFunction(fn) && fn.apply(el));

/**
 * Base class for Grapper Web Component
 *
 * @fires 'ready'                 - This event fires when the component is ready and its methods and properties are available
 * @fires 'render'                - This event fires when the component is rendered and its visible content is displayed
 * @fires 'refresh'               - This event fires when the component is refreshed, and its visible content is updated
 * @fires 'resize'                - This event fires when the component size is changed
 * @property {boolean} [ready]    - It's true if the component is ready, or false is starting or busy.
 * @property {boolean} [rendered] - It's true if the component is rendered, and its visible content is displayed.
 */
class Base extends Simple {

  /**
   * @constructor
   * @param {boolean} [ready]
   */
  constructor (ready) {
    super();

    this.attachShadow({mode : 'open'});
    this[CONTEXT].ready    = ready || false;
    this[CONTEXT].rendered = false;

    if (isUndefined(ready)) {
      this.ready = true;
    }

  }

  /**
   * ready state
   * @type {boolean}
   */
  get ready () {
    return this[CONTEXT].ready;
  }

  set ready (value) {
    const ctx = this[CONTEXT];
    const pre = ctx.ready;
    ctx.ready = !!value;
    if (pre === false && ctx.ready === true) {
      this[FIRE_EVENT]('ready', {ready : true});
      if (isFunction(this[RENDER])) {
        this[RENDER]();
      }
    }
  }

  /**
   * rendered state
   * @returns {boolean}
   */
  get rendered () {
    return this[CONTEXT].rendered;
  }

  set rendered (value) {
    const ctx    = this[CONTEXT];
    const pre    = ctx.rendered;
    ctx.rendered = !!value;
    if (pre === false && ctx.rendered === true) {
      this[FIRE_EVENT]('render', {rendered : true});
    }
  }

  /**
   * Connected with the parent DOM
   *   - Resize observer
   * @private
   */
  connectedCallback () {
    runCallbacks(this, ONCONNECT);
  }

  /**
   * Disconnected of parent DOM
   *   - Remove resize observer
   * @private
   */
  disconnectedCallback () {
    runCallbacks(this, ONDISCONNECT);
  }

}

/**
 * Handles the ONCONNECT event for the Base prototype.
 * This array of functions is triggered when a connection occurs.
 * @memberof Base
 * @property [ONCONNECT]
 */
Base.prototype[ONCONNECT] = [];

/**
 * Handles the ONDISCONNECT event for the Base prototype.
 * This array of functions is triggered when a disconnection occurs.
 * @memberof Base
 * @property [ONCONNECT]
 */
Base.prototype[ONDISCONNECT] = [];


/**
 *
 * Define a Component
 *
 * @param {Function} Class - Class for this custom component
 */
function defineComponent (Class) {

  // Async call to render method
  if (isFunction(Class.prototype[RENDER])) {
    const preRender         = Class.prototype[RENDER];
    Class.prototype[RENDER] =
      preCondition(
        function () {
          this.rendered = false;
          return this.ready;
        },
        debounceMethodAsync(
          posExecution(
            async function () {
              return preRender.apply(this);
            },
            function (result) {
              this.rendered = result !== false;
              if (this.rendered && isFunction(this[REFRESH])) {
                this[REFRESH]();
              }
            }
          ),
          DELAY
        )
      );
  }

  // Async call to refresh method
  if (isFunction(Class.prototype[REFRESH])) {
    const prevRefresh        = Class.prototype[REFRESH];
    Class.prototype[REFRESH] =
      preCondition(
        function (force) {
          if (force) {
            this[CONTEXT].rendered = true;
          }
          return this.ready && this[CONTEXT].rendered;
        },
        debounceMethodAsync(
          posExecution(
            async function (...args) {
              return prevRefresh.apply(this, args);
            },
            function () {
              this[FIRE_EVENT]('refresh');
            }
          ),
          DELAY
        )
      );
  }

}


/**
 * Define a Base or
 * @param {Function} Class
 * @param {object} [def={}]
 * @returns {object}
 */
function define (Class, def = {}) {
  defineComponent(Class);
  return defineSimple(Class, def);
}

Base.RENDER       = RENDER;
Base.REFRESH      = REFRESH;
Base.ONCONNECT    = ONCONNECT;
Base.ONDISCONNECT = ONDISCONNECT;

/**
 * Export
 */
export {
  Base as default,
  Base,
  Simple,
  define,
  RENDER,
  REFRESH,
  CHANGE,
  CONTEXT,
  FIRE_EVENT,
  ONCONNECT,
  ONDISCONNECT
};
