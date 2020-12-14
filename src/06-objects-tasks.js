/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(w, h) {
  this.width = w;
  this.height = h;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const objFromJson = JSON.parse(json);
  const objFromProto = Object.create(proto);
  return Object.assign(objFromProto, objFromJson);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  selector: '',

  clone(value) {
    const val = { ...this };
    val.selector = value;
    return val;
  },

  throwDoubleInvocationError() {
    throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  },

  throwOrderInvocationError() {
    throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  },

  lock(errorFunction, ...methods) {
    methods.forEach((method) => {
      this[method] = errorFunction;
    });
  },

  element(value) {
    const selec = this.clone(this.selector + value);
    selec.element = this.throwDoubleInvocationError;
    return selec;
  },

  id(value) {
    const selec = this.clone(`${this.selector}#${value}`);
    selec.id = this.throwDoubleInvocationError;
    selec.element = this.throwOrderInvocationError;
    return selec;
  },

  class(value) {
    const selec = this.clone(`${this.selector}.${value}`);
    selec.lock(this.throwOrderInvocationError, 'id', 'element');
    return selec;
  },

  attr(value) {
    const selec = this.clone(`${this.selector}[${value}]`);
    selec.lock(this.throwOrderInvocationError, 'id', 'element', 'class');
    return selec;
  },

  pseudoClass(value) {
    const selec = this.clone(`${this.selector}:${value}`);
    selec.lock(this.throwOrderInvocationError, 'id', 'element', 'class', 'attr');
    return selec;
  },

  pseudoElement(value) {
    const selec = this.clone(`${this.selector}::${value}`);
    selec.pseudoElement = this.throwDoubleInvocationError;
    selec.lock(this.throwOrderInvocationError, 'id', 'element', 'class', 'attr', 'pseudoClass');
    return selec;
  },

  combine(selector1, combinator, selector2) {
    const selec = { ...this };
    selec.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return selec;
  },

  stringify() {
    return this.selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
