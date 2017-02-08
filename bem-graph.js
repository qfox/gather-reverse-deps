/*eslint: ignore*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BemGraph = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

const assert = require('assert');
const util = require('util');

const BemEntityName = require('@bem/entity-name');

module.exports = class BemCell {
    /**
     * @param {object} obj — representation of cell.
     * @param {BemEntityName} obj.entity — representation of entity name.
     * @param {string} [obj.tech] - tech of cell.
     * @param {string} [obj.layer] - layer of cell.
     */
    constructor(obj) {
        assert(obj && obj.entity, 'Required `entity` field');
        assert(BemEntityName.isBemEntityName(obj.entity), 'The `entity` field should be an instance of BemEntityName');

        this._entity = obj.entity;
        this._layer = obj.layer;
        this._tech = obj.tech;
    }

    /**
     * Returns the name of entity.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' })
     * });
     *
     * cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
     *
     * @returns {BemEntityName} name of entity.
     */
    get entity() { return this._entity; }

    /**
     * Returns the tech of cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     tech: 'css'
     * });
     *
     * cell.tech; // ➜ css
     *
     * @returns {string} tech of cell.
     */
    get tech() { return this._tech; }

    /**
     * Returns the layer of this cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     layer: 'desktop'
     * });
     *
     * cell.layer; // ➜ desktop
     *
     * @returns {string} layer of cell.
     */
    get layer() { return this._layer; }

    /**
     * Returns the identifier of this cell.
     *
     * Important: should only be used to determine uniqueness of cell.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' }),
     *     tech: 'css',
     *     layer: 'desktop'
     * });
     *
     * cell.id; // ➜ "button__text@desktop.css"
     *
     * @returns {string} identifier of cell.
     */
    get id() {
        if (this._id) {
            return this._id;
        }

        const layer = this._layer ? `@${this._layer}` : '';
        const tech = this._tech ? `.${this._tech}` : '';

        this._id = `${this._entity}${layer}${tech}`;

        return this._id;
    }

    /**
     * Returns string representing the bem cell.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button', mod: 'focused' }) });
     *
     * cell.toString(); // button_focused
     *
     * @returns {string}
     */
    toString() { return this.id; }

    /**
     * Returns object representing the bem cell. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button', mod: 'focused' }) });
     *
     * cell.valueOf();
     *
     * // ➜ { entity: { block: 'button', mod: { name: 'focused', value: true } },
     * //     tech: null,
     * //     layer: null }
     *
     * @returns {{ entity: {block: string, elem: ?string, mod: ?{name: string, val: *}}, tech: *, layer: *}}
     */
    valueOf() {
        const res = { entity: this._entity.valueOf() };
        this._tech && (res.tech = this._tech);
        this._layer && (res.layer = this._layer);
        return res;
    }

    /**
     * Returns object representing the bem cell. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `entity`, `tech` and `layer` fields
     * without private fields.
     *
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     * const cell = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
     *
     * console.log(cell); // BemCell { entity: { block: 'button' }, tech: null, layer: null }
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                           that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.valueOf(), options);

        return `BemCell ${stringRepresentation}`;
    }

    /**
     * Return raw data for `JSON.stringify()`.
     *
     * @returns {{ entity: {block: string, elem: ?string, mod: ?{name: string, val: *}}, tech: *, layer: *}}
     */
    toJSON() {
        return this.valueOf();
    }

    /**
     * Determines whether specified cell is instance of BemCell.
     *
     * @param {BemCell} cell - the cell to check.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemCell.
     * @example
     * const BemCell = require('@bem/cell');
     * const BemEntityName = require('@bem/entity-name');
     *
     * const cell = new BemCell({
     *     entity: new BemEntityName({ block: 'button', elem: 'text' })
     * });
     *
     * BemCell.isBemCell(cell); // true
     * BemCell.isBemCell({}); // false
     */
    static isBemCell(cell) {
        return cell && this.name === cell.constructor.name;
    }
};

},{"@bem/entity-name":2,"assert":14,"util":22}],2:[function(require,module,exports){
'use strict';

const util = require('util');

const stringifyEntity = require('bem-naming').stringify;

/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
const TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

module.exports = class BemEntityName {
    /**
     * @param {object} obj — representation of entity name.
     * @param {string} obj.block  — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {object} [obj.mod]  — the modifier of entity.
     * @param {string} [obj.mod.name] — the modifier name of entity.
     * @param {string} [obj.mod.val]  — the modifier value of entity.
     */
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        const data = this._data = { block: obj.block };

        obj.elem && (data.elem = obj.elem);

        const modObj = obj.mod;
        const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) || obj.modName;
        const hasModVal = modObj && modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');

        if (modName) {
            data.mod = {
                name: modName,
                val: hasModVal ? modObj && modObj.val || obj.modVal : true
            };
        } else if (modObj || hasModVal) {
            throw new Error('This is not valid BEM entity: the field `mod.name` is undefined.');
        }

        this.__isBemEntityName__ = true;
    }

    /**
     * Returns the name of block to which this entity belongs.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * name.block; // button
     *
     * @returns {string} name of entity block.
     */
    get block() { return this._data.block; }

    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.elem; // text
     *
     * @returns {string} name of entity element.
     */
    get elem() { return this._data.elem; }

    /**
     * Returns the modifier of this entity.
     *
     * Important: If entity is not a modifier then returns `undefined`.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const blockName = new BemEntityName({ block: 'button' });
     * const modName = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * modName.mod;   // { name: 'disabled', val: true }
     * blockName.mod; // undefined
     *
     * @returns {{mod: string, val: *}} entity modifier.
     */
    get mod() { return this._data.mod; }

    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.name` instead.
     */
    get modName() { return this.mod && this.mod.name; }

    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.val` instead.
     */
    get modVal() { return this.mod && this.mod.val; }

    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * name.id; // button_disabled
     *
     * @returns {string} id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._data.block };

        this.elem && (entity.elem = this.elem);
        this.modName && (entity.modName = this.modName);
        this.modVal && (entity.modVal = this.modVal);

        this._id = stringifyEntity(entity);

        return this._id;
    }

    /**
     * Returns type for this entity.
     *
     * @example <caption>type of element</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.type; // elem
     *
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * name.type; // elemMod
     *
     * @returns {string} type of entity.
     */
    get type() {
        if (this._type) { return this._type; }

        const data = this._data;
        const isMod = data.mod;

        this._type = data.elem
            ? isMod ? TYPES.ELEM_MOD : TYPES.ELEM
            : isMod ? TYPES.BLOCK_MOD : TYPES.BLOCK;

        return this._type;
    }
    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.toString(); // button_focused
     *
     * @returns {string}
     */
    toString() { return this.id; }

    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.valueOf();
     *
     * // ➜ { block: 'button', mod: { name: 'focused', value: true } }
     *
     * @returns {{block: string, elem: ?string, mod: ?{name: ?string, val: *}}}
     */
    valueOf() { return this._data; }

    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // BemEntityName { block: 'button' }
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                         	 that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._data, options);

        return `BemEntityName ${stringRepresentation}`;
    }

    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is the deepEqual entity.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * inputName.isEqual(buttonName); // false
     * buttonName.isEqual(buttonName); // true
     */
    isEqual(entityName) {
        return entityName && (this.id === entityName.id);
    }

    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @param {BemEntityName} entityName - the entity to check.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemEntityName.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const entityName = new BemEntityName({ block: 'input' });
     *
     * BemEntityName.isBemEntityName(entityName); // true
     * BemEntityName.isBemEntityName({}); // false
     */
    static isBemEntityName(entityName) {
        return entityName && entityName.__isBemEntityName__;
    }
};

},{"bem-naming":3,"util":22}],3:[function(require,module,exports){
(function (global){
'use strict';

(function (global) {
/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
var TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

/**
 * Defines which symbols can be used for block, element and modifier's names.
 * @readonly
 */
var WORD_PATTERN = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';

/**
 * Presets of options for various naming.
 * @readonly
 */
var presets = {
    origin: {
        delims: {
            elem: '__',
            mod: { name: '_', val: '_' }
        },
        wordPattern: WORD_PATTERN
    },
    'two-dashes': {
        delims: {
            elem: '__',
            mod: { name: '--', val: '_' }
        },
        wordPattern: WORD_PATTERN
    }
};

/**
 * It is necessary not to create new instances for the same custom naming.
 * @readonly
 */
var cache = {};

/**
 * Creates namespace with methods which allows getting information about BEM entity using string as well
 * as forming string representation based on naming object.
 *
 * @param {Object} [options]              Options.
 * @param {String} [options.elem=__]      Separates element's name from block.
 * @param {String|Object} [options.mod=_] Separates modifiers from blocks and elements.
 * @param {String} [options.mod.name=_]   Separates name of modifier from blocks and elements.
 * @param {String} [options.mod.val=_]    Separates value of modifier from name of modifier.
 * @param {String} [options.wordPattern]  Defines which symbols can be used for block, element and modifier's names.
 * @return {Object}
 */
function createNaming(options) {
    var opts = init(options),
        id = JSON.stringify(opts);

    if (cache[id]) {
        return cache[id];
    }

    var delims = opts.delims,
        regex = buildRegex(delims, opts.wordPattern);

    /**
     * Checks a string to be valid BEM notation.
     *
     * @param {String} str - String representation of BEM entity.
     * @returns {Boolean}
     */
    function validate(str) {
        return regex.test(str);
    }

    /**
     * Parses string into naming object.
     *
     * @param {String} str - string representation of BEM entity.
     * @returns {Object|undefined}
     */
    function parse(str) {
        var executed = regex.exec(str);

        if (!executed) { return undefined; }

        var notation = {
                block: executed[1] || executed[4]
            },
            elem = executed[5],
            modName = executed[2] || executed[6];

        elem && (notation.elem = elem);

        if (modName) {
            var modVal = executed[3] || executed[7];

            notation.modName = modName;
            notation.modVal = modVal || true;
        }

        return notation;
    }

    /**
     * Forms a string according to naming object.
     *
     * @param {Object} obj - naming object
     * @returns {String}
     */
    function stringify(obj) {
        if (!obj || !obj.block) {
            return undefined;
        }

        var res = obj.block;

        if (obj.elem) {
            res += delims.elem + obj.elem;
        }

        if (obj.modName) {
            var modVal = obj.modVal;

            if (modVal || modVal === 0 || !obj.hasOwnProperty('modVal')) {
                res += delims.mod.name + obj.modName;
            }

            if (modVal && modVal !== true) {
                res += delims.mod.val + modVal;
            }
        }

        return res;
    }

    /**
     * Returns a string indicating type of a BEM entity.
     *
     * @param {Object|String|undefined} obj - naming object or string representation of BEM entity.
     * @returns {String}
     */
    function typeOf(obj) {
        if (typeof obj === 'string') {
            obj = parse(obj);
        }

        if (!obj || !obj.block) { return undefined; }

        var modName = obj.modName,
            isMod = modName && (obj.modVal || !obj.hasOwnProperty('modVal'));

        if (obj.elem) {
            if (isMod)    { return TYPES.ELEM_MOD; }
            if (!modName) { return TYPES.ELEM;     }
        }

        if (isMod)    { return TYPES.BLOCK_MOD; }
        if (!modName) { return TYPES.BLOCK;     }
    }

    /**
     * Checks whether naming object or string is a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isBlock(obj) {
        return typeOf(obj) === TYPES.BLOCK;
    }

    /**
     * Checks whether naming object or string is modifier of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isBlockMod(obj) {
        return typeOf(obj) === TYPES.BLOCK_MOD;
    }

    /**
     * Checks whether naming object or string is element of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isElem(obj) {
        return typeOf(obj) === TYPES.ELEM;
    }

    /**
     * Checks whether naming object or string is element of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isElemMod(obj) {
        return typeOf(obj) === TYPES.ELEM_MOD;
    }

    var namespace = {
        validate: validate,
        typeOf: typeOf,
        isBlock: isBlock,
        isBlockMod: isBlockMod,
        isElem: isElem,
        isElemMod: isElemMod,
        parse: parse,
        stringify: stringify,
        /**
         * String to separate elem from block.
         *
         * @type {String}
         */
        elemDelim: delims.elem,
        /**
         * String to separate modifiers from blocks and elements.
         *
         * @type {String}
         */
        modDelim: delims.mod.name,
        /**
         * String to separate value of modifier from name of modifier.
         *
         * @type {String}
         */
        modValDelim: delims.mod.val
    };

    cache[id] = namespace;

    return namespace;
}

/**
 * Returns delims and wordPattern.
 *
 * @param {Object} options - user options
 * @returns {{delims: Object, wordPattern: String}}
 */
function init(options) {
    options || (options = {});

    if (typeof options === 'string') {
        var preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    var defaults = presets.origin,
        defaultDelims = defaults.delims,
        defaultModDelims = defaultDelims.mod,
        mod = options.mod || defaultDelims.mod;

    return {
        delims: {
            elem: options.elem || defaultDelims.elem,
            mod: typeof mod === 'string'
                ? { name: mod, val: mod }
                : {
                    name: mod.name || defaultModDelims.name,
                    val: mod.val || mod.name || defaultModDelims.val
                }
        },
        wordPattern: options.wordPattern || defaults.wordPattern
    };
}

/**
 * Builds regex for specified naming.
 *
 * @param {Object} delims      Separates block names, elements and modifiers.
 * @param {String} wordPattern Defines which symbols can be used for block, element and modifier's names.
 * @returns {RegExp}
 */
function buildRegex(delims, wordPattern) {
    var block = '(' + wordPattern + ')',
        elem = '(?:' + delims.elem + '(' + wordPattern + '))?',
        modName = '(?:' + delims.mod.name + '(' + wordPattern + '))?',
        modVal = '(?:' + delims.mod.val + '(' + wordPattern + '))?',
        mod = modName + modVal;

    return new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
}

var defineAsGlobal = true,
    api = [
        'validate', 'typeOf',
        'isBlock', 'isBlockMod', 'isElem', 'isElemMod',
        'parse', 'stringify',
        'elemDelim', 'modDelim', 'modValDelim'
    ],
    originalNaming = createNaming();

api.forEach(function (name) {
    createNaming[name] = originalNaming[name];
});

// Node.js
/* istanbul ignore if */
if (typeof exports === 'object') {
    module.exports = createNaming;
    defineAsGlobal = false;
}

// YModules
/* istanbul ignore if */
if (typeof modules === 'object') {
    modules.define('bem-naming', function (provide) {
        provide(createNaming);
    });
    defineAsGlobal = false;
}

// AMD
/* istanbul ignore if */
if (typeof define === 'function') {
    define(function (require, exports, module) {
        module.exports = createNaming;
    });
    defineAsGlobal = false;
}

/* istanbul ignore next */
defineAsGlobal && (global.bemNaming = createNaming);
})(typeof window !== 'undefined' ? window : global);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
'use strict';

const util = require('util');

const stringifyEntity = require('bem-naming').stringify;

/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
const TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

module.exports = class BemEntityName {
    /**
     * @param {object} obj — representation of entity name.
     * @param {string} obj.block  — the block name of entity.
     * @param {string} [obj.elem] — the element name of entity.
     * @param {object} [obj.mod]  — the modifier of entity.
     * @param {string} [obj.mod.name] — the modifier name of entity.
     * @param {string} [obj.mod.val]  — the modifier value of entity.
     */
    constructor(obj) {
        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        const data = this._data = { block: obj.block };

        obj.elem && (data.elem = obj.elem);

        const modObj = obj.mod;
        const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) || obj.modName;
        const hasModVal = modObj && modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');

        if (modName) {
            data.mod = {
                name: modName,
                val: hasModVal ? modObj && modObj.val || obj.modVal : true
            };
        } else if (modObj || hasModVal) {
            throw new Error('This is not valid BEM entity: the field `mod.name` is undefined.');
        }

        this.__isBemEntityName__ = true;
    }

    /**
     * Returns the name of block to which this entity belongs.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * name.block; // button
     *
     * @returns {string} name of entity block.
     */
    get block() { return this._data.block; }

    /**
     * Returns the element name of this entity.
     *
     * If entity is not element or modifier of element then returns empty string.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.elem; // text
     *
     * @returns {string} name of entity element.
     */
    get elem() { return this._data.elem; }

    /**
     * Returns the modifier of this entity.
     *
     * Important: If entity is not a modifier then returns `undefined`.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const blockName = new BemEntityName({ block: 'button' });
     * const modName = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * modName.mod;   // { name: 'disabled', val: true }
     * blockName.mod; // undefined
     *
     * @returns {{mod: string, val: *}} entity modifier.
     */
    get mod() { return this._data.mod; }

    /**
     * Returns the modifier name of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.name` instead.
     */
    get modName() { return this.mod && this.mod.name; }

    /**
     * Returns the modifier value of this entity.
     *
     * If entity is not modifier then returns `undefined`.
     *
     * @returns {string} entity modifier name.
     * @deprecated use `mod.val` instead.
     */
    get modVal() { return this.mod && this.mod.val; }

    /**
     * Returns id for this entity.
     *
     * Important: should only be used to determine uniqueness of entity.
     *
     * If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'disabled' });
     *
     * name.id; // button_disabled
     *
     * @returns {string} id of entity.
     */
    get id() {
        if (this._id) { return this._id; }

        const entity = { block: this._data.block };

        this.elem && (entity.elem = this.elem);
        this.modName && (entity.modName = this.modName);
        this.modVal && (entity.modVal = this.modVal);

        this._id = stringifyEntity(entity);

        return this._id;
    }

    /**
     * Returns type for this entity.
     *
     * @example <caption>type of element</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', elem: 'text' });
     *
     * name.type; // elem
     *
     * @example <caption>type of element modifier</caption>
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });
     *
     * name.type; // elemMod
     *
     * @returns {string} type of entity.
     */
    get type() {
        if (this._type) { return this._type; }

        const data = this._data;
        const isMod = data.mod;

        this._type = data.elem
            ? isMod ? TYPES.ELEM_MOD : TYPES.ELEM
            : isMod ? TYPES.BLOCK_MOD : TYPES.BLOCK;

        return this._type;
    }
    /**
     * Returns string representing the entity name.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `bem-naming` package.
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.toString(); // button_focused
     *
     * @returns {string}
     */
    toString() { return this.id; }

    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button', mod: 'focused' });
     *
     * name.valueOf();
     *
     * // ➜ { block: 'button', mod: { name: 'focused', value: true } }
     *
     * @returns {{block: string, elem: ?string, mod: ?{name: ?string, val: *}}}
     */
    valueOf() { return this._data; }

    /**
     * Returns object representing the entity name. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * The representation object contains only `block`, `elem` and `mod` fields
     * without private and deprecated fields (`modName` and `modVal`).
     *
     * @example
     * const BemEntityName = require('@bem/entity-name');
     * const name = new BemEntityName({ block: 'button' });
     *
     * console.log(name); // BemEntityName { block: 'button' }
     *
     * @param {integer} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *                         	 that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this._data, options);

        return `BemEntityName ${stringRepresentation}`;
    }

    /**
     * Return raw data for `JSON.stringify()`.
     *
     * @returns {{block: string, elem: ?string, mod: ?{name: string, val: *}}}
     */
    toJSON() {
        return this._data;
    }

    /**
     * Determines whether specified entity is the deepEqual entity.
     *
     * @param {BemEntityName} entityName - the entity to compare.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is the deepEqual entity.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const inputName = new BemEntityName({ block: 'input' });
     * const buttonName = new BemEntityName({ block: 'button' });
     *
     * inputName.isEqual(buttonName); // false
     * buttonName.isEqual(buttonName); // true
     */
    isEqual(entityName) {
        return entityName && (this.id === entityName.id);
    }

    /**
     * Determines whether specified entity is instance of BemEntityName.
     *
     * @param {BemEntityName} entityName - the entity to check.
     *
     * @returns {boolean} A Boolean indicating whether or not specified entity is instance of BemEntityName.
     * @example
     * const BemEntityName = require('@bem/entity-name');
     *
     * const entityName = new BemEntityName({ block: 'input' });
     *
     * BemEntityName.isBemEntityName(entityName); // true
     * BemEntityName.isBemEntityName({}); // false
     */
    static isBemEntityName(entityName) {
        return entityName && entityName.__isBemEntityName__;
    }
};

},{"bem-naming":5,"util":22}],5:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],6:[function(require,module,exports){
module.exports = require('.').BemGraph;

},{".":10}],7:[function(require,module,exports){
'use strict';

const debug = require('debug')('bem-graph');
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const MixedGraph = require('./mixed-graph');
const resolve = require('./mixed-graph-resolve');

class BemGraph {
    constructor() {
        this._mixedGraph = new MixedGraph();
    }
    vertex(entity, tech) {
        const mixedGraph = this._mixedGraph;

        const vertex = new BemCell({ entity: new BemEntityName(entity), tech });

        mixedGraph.addVertex(vertex);

        return new BemGraph.Vertex(this, vertex);
    }
    naturalDependenciesOf(entities, tech) {
        return this.dependenciesOf(this._sortNaturally(entities), tech);
    }
    dependenciesOf(entities, tech, reversed) {
        if (!Array.isArray(entities)) {
            entities = [entities];
        }

        const vertices = entities.reduce((res, entity) => {
            const entityName = new BemEntityName(entity);

            res.push(new BemCell({ entity: entityName }));

            // Multiply techs
            tech && res.push(new BemCell({ entity: entityName, tech }));

            return res;
        }, []);

        // Recommended order
        const iter = resolve(this._mixedGraph, vertices, tech, reversed);
        const arr = Array.from(iter);

        // TODO: returns iterator
        const verticesCheckList = {};
        return arr.map(vertex => {
            if (verticesCheckList[`${vertex.entity.id}.${(vertex.tech || tech)}`]) {
                return false;
            }

            const obj = { entity: vertex.entity.valueOf() };

            (vertex.tech || tech) && (obj.tech = vertex.tech || tech);
            verticesCheckList[`${vertex.entity.id}.${obj.tech}`] = true;

            return obj;
        }).filter(Boolean);
    }
    reverseDependenciesOf(entities, tech) {
        return this.dependenciesOf(entities, tech, true);
    }
    naturalize() {
        const mixedGraph = this._mixedGraph;

        const vertices = Array.from(mixedGraph.vertices());
        const index = {};
        for (let vertex of vertices) {
            index[vertex.id] = vertex;
        }

        function hasOrderedDepend(vertex, depend) {
            const orderedDirectSuccessors = mixedGraph.directSuccessors(vertex, { ordered: true });

            for (let successor of orderedDirectSuccessors) {
                if (successor.id === depend.id) {
                    return true;
                }
            }

            return false;
        }

        function addEdgeLosely(vertex, key) {
            const dependant = index[key];

            if (dependant) {
                if (hasOrderedDepend(dependant, vertex)) {
                    return false;
                }

                mixedGraph.addEdge(vertex, dependant, {ordered: true});
                return true;
            }

            return false;
        }

        for (let vertex of vertices) {
            const entity = vertex.entity;

            // Elem modifier should depend on elen by default
            if (entity.elem && (entity.mod && entity.mod.name || entity.modName)) {
                (entity.mod.val !== true) &&
                    addEdgeLosely(vertex, `${entity.block}__${entity.elem}_${entity.mod.name || entity.modName}`);

                addEdgeLosely(vertex, `${entity.block}__${entity.elem}`) ||
                    addEdgeLosely(vertex, entity.block);
            }
            // Elem should depend on block by default
            else if (entity.elem) {
                addEdgeLosely(vertex, entity.block);
            }
            // Block modifier should depend on block by default
            else if (entity.mod && entity.mod.name || entity.modName) {
                (entity.mod.val !== true) &&
                    addEdgeLosely(vertex, `${entity.block}_${entity.mod.name || entity.modName}`);

                addEdgeLosely(vertex, entity.block);
            }
        }
    }
    _sortNaturally(entities) {
        const order = {};
        let idx = 0;
        for (let entity of entities) {
            entity.id || (entity.id = (new BemEntityName(entity)).id);
            order[entity.id] = idx++;
        }

        let k = 1;
        for (let entity of entities) {
            // Elem should depend on block by default
            if (entity.elem && !entity.modName) {
                order[entity.block] && (order[entity.id] = order[entity.block] + 0.001*(k++));
            }
        }

        // Block/Elem boolean modifier should depend on elem/block by default
        for (let entity of entities) {
            if (entity.modName && entity.modVal === true) {
                let depId = `${entity.block}__${entity.elem}`;
                order[depId] || (depId = entity.block);
                order[depId] && (order[entity.id] = order[depId] + 0.00001*(k++));
            }
        }

        // Block/Elem key-value modifier should depend on boolean modifier, elem or block by default
        for (let entity of entities) {
            if (entity.modName && entity.modVal !== true) {
                let depId = entity.elem
                    ? `${entity.block}__${entity.elem}_${entity.modName}`
                    : `${entity.block}_${entity.modName}`;
                order[depId] || entity.elem && (depId = `${entity.block}__${entity.elem}`);
                order[depId] || (depId = entity.block);
                order[depId] && (order[entity.id] = order[depId] + 0.0000001*(k++));
            }
        }

        return entities.sort((a, b) => order[a.id] - order[b.id]);
    }
}

BemGraph.Vertex = class {
    constructor(graph, vertex) {
        this.graph = graph;
        this.vertex = vertex;
    }
    linkWith(entity, tech) {
        const dependencyVertex = new BemCell({ entity: new BemEntityName(entity), tech });

        debug('link ' + this.vertex.id + ' -> ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: false });

        return this;
    }
    dependsOn(entity, tech) {
        const dependencyVertex = new BemCell({ entity: new BemEntityName(entity), tech });

        debug('link ' + this.vertex.id + ' => ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: true });

        return this;
    }
}

module.exports = BemGraph;

},{"./mixed-graph":12,"./mixed-graph-resolve":11,"@bem/cell":1,"@bem/entity-name":4,"debug":23}],8:[function(require,module,exports){
'use strict';

const ExtendableError = require('es6-error');

/**
 * СircularDependencyError
 */
module.exports = class СircularDependencyError extends ExtendableError {
    constructor(loop) {
        loop = Array.from(loop || []);

        let message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${loop.join(' <- ')})`;
        }

        super(message);

        this._loop = loop;
    }
    get loop() {
        return this._loop.map(item => {
            const res = {};
            item.entity && (res.entity = item.entity.valueOf());
            item.tech && (res.tech = item.tech);
            return res;
        });
    }
};

},{"es6-error":26}],9:[function(require,module,exports){
'use strict';

const VertexSet = require('./vertex-set');

module.exports = class DirectedGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._edgeMap = new Map();
    }
    addVertex(vertex) {
        this._vertices.add(vertex);

        return this;
    }
    hasVertex(vertex) {
        return this._vertices.has(vertex);
    }
    vertices() {
        return this._vertices.values();
    }
    addEdge(fromVertex, toVertex) {
        this.addVertex(fromVertex).addVertex(toVertex);

        let successors = this._edgeMap.get(fromVertex.id);

        if (!successors) {
            successors = new VertexSet();

            this._edgeMap.set(fromVertex.id, successors);
        }

        successors.add(toVertex);

        return this;
    }
    hasEdge(fromVertex, toVertex) {
        return this.directSuccessors(fromVertex).has(toVertex);
    }
    directSuccessors(vertex) {
        return this._edgeMap.get(vertex.id) || new VertexSet();
    }
    * successors(startVertex) {
        const graph = this;

        function* step(fromVertex) {
            const successors = graph.directSuccessors(fromVertex);

            for (let vertex of successors) {
                yield vertex;
                yield * step(vertex);
            }
        }

        yield * step(startVertex);
    }
}

},{"./vertex-set":13}],10:[function(require,module,exports){
const BemGraph = require('./bem-graph');

module.exports = {
    BemGraph
};

},{"./bem-graph":7}],11:[function(require,module,exports){
'use strict';

const hoi = require('ho-iter');
const series = hoi.series;

const VertexSet = require('./vertex-set');
const CircularDependencyError = require('./circular-dependency-error');

module.exports = resolve;

class TopoGroups {
    constructor() {
        this._groups = [];
        this._index = Object.create(null);
    }
    get index() {
        return Object.assign(Object.create(null), this._index);
    }
    get groups() {
        return [].concat(this._groups);
    }
    lookup(id) {
        if (this._index[id]) {
            return this._index[id];
        }
        // console.log('looking for ' + id);
        for (let i = this._groups.length - 1; i >= 0; i -= 1) {
            const group = this._groups[i];
            // console.log('group', group);
            if (group.has(id)) {
                // console.log('found ' + id);
                this._index[id] = group;
                return group;
            }
        }
    }
    lookupCreate(id) {
        let res = this.lookup(id);
        if (!res) {
            res = new Set([id]);
            this._index[id] = res;
            this._groups.push(res);
        }
        return res;
    }
    merge(vertexId, parentId) {
        const parentGroup = this.lookupCreate(parentId);
        const vertexGroup = this.lookup(vertexId);

        if (!vertexGroup) {
            parentGroup.add(vertexId);
        } else if (parentGroup !== vertexGroup) {
            vertexGroup.forEach(id => {
                this._index[id] = parentGroup;
                parentGroup.add(id);
            });
            this.drop(vertexGroup);
        }
    }
    drop(group) {
        if (this._groups.indexOf(group) !== -1) {
            this._groups.splice(this._groups.indexOf(group), 1);
        }
    }
}

function resolve(mixedGraph, startVertices, tech, reverse) {
    const _positions = startVertices.reduce((res, e, pos) => { res[e.id] = pos + 1; return res; }, {});
    const backsort = (a, b) => _positions[a.id] - _positions[b.id];

    const orderedSuccessors = []; // L ← Empty list that will contain the sorted nodes
    const _orderedVisits = {}; // Hash with visiting flags: temporary - false, permanently - true
    const unorderedSuccessors = new VertexSet(); // The rest nodes
    let crumbs = [];
    const topo = new TopoGroups();

    // ... while there are unmarked nodes do
    startVertices.forEach(v => visit(v, false));

    const _orderedSuccessors = reverse ? [] : Array.from(new VertexSet(orderedSuccessors.reverse()));
    const _unorderedSuccessors = Array.from(unorderedSuccessors).sort(backsort);

    // console.log({topogroups, ordered: Array.from(_orderedSuccessors).map(v => v.id), unordered: Array.from(_unorderedSuccessors).map(v => v.id)});

    // const res = topogroups.reduce((r, topogroup) => {
    //     _orderedSuccessors.filter(v => topogroup.has(v.id)).forEach(v => r.push(v));
    //     _unorderedSuccessors.filter(v => topogroup.has(v.id)).forEach(v => r.push(v));
    //     return r;
    // }, []);
    //const res = .concat();

    // console.log('res:', res.map(v => v.id));

    return series(_orderedSuccessors, _unorderedSuccessors);

    function visit(fromVertex, weak) {
        //console.log('visit', crumbs.map(v => v.id).join('→'), weak, fromVertex.id, ''+Object.keys(_orderedVisits));

        // ... if n has a temporary mark then stop (not a DAG)
        if (!weak && _orderedVisits[fromVertex.id] === false) {
            if (crumbs.filter(c => (c.entity.id === fromVertex.entity.id) &&
                (!c.tech || c.tech === fromVertex.tech)).length) {
                throw new CircularDependencyError(crumbs.concat(fromVertex)); // TODO: правильно считать цикл
            }
        }

        // ... if n is not marked (i.e. has not been visited yet) then ... else already visited
        if (_orderedVisits[fromVertex.id] !== undefined) {
            // Already visited
            return;
        }

        crumbs.push(fromVertex);

        // ... mark n temporarily
        _orderedVisits[fromVertex.id] = false;

        topo.lookupCreate(fromVertex.id);

        // ... for each node m with an edge from n to m do
        const orderedDirectSuccessors = reverse ? [] : mixedGraph.directSuccessors(fromVertex, { ordered: true, tech });

        for (let successor of orderedDirectSuccessors) {
            if (successor.id === fromVertex.id) { // TODO: Filter loops earlier
                continue;
            }

            if (weak) {
                // TODO: Very slow piece of shit
                const topogroup = topo.lookup(successor.id);
                if (topogroup && !topogroup.has(fromVertex.id)) {
                    // Drop all entities for the current topogroup if came from unordered
                    Array.from(topo.lookup(successor.id) || []).forEach(id => { _orderedVisits[id] = undefined; });
                }
                // console.log('topolength: ', topogroups.length, Array.from(findTopoGroup(successor.id) || []));
            }

            // Add to topogroup for ordered dependencies to sort them later in groups
            topo.merge(fromVertex.id, successor.id);

            visit(successor, false);
        }

        // ... mark n permanently
        // ... unmark n temporarily
        _orderedVisits[fromVertex.id] = true;

        // ... add n to head of L
        weak || orderedSuccessors.unshift(fromVertex);
        weak && unorderedSuccessors.add(fromVertex);

        const unorderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, { ordered: false, tech, reversed: reverse });

        for (let successor of unorderedDirectSuccessors) {
            // console.log('unordered', successor.id);
            if (successor.id === fromVertex.id || // TODO: Filter loops earlier
                _orderedVisits[successor.id] ||
                unorderedSuccessors.has(successor) ||
                orderedSuccessors.indexOf(successor) !== -1) {
                continue;
            }

            const _crumbs = crumbs;
            //console.log('remember ', crumbs.map(v => v.id).join('->'));
            crumbs = [];

            visit(successor, true);

            crumbs = _crumbs;
        }

        crumbs.pop();
    }
}

},{"./circular-dependency-error":8,"./vertex-set":13,"ho-iter":28}],12:[function(require,module,exports){
'use strict';

const series = require('ho-iter').series;
const BemCell = require('@bem/cell');

const VertexSet = require('./vertex-set');
const DirectedGraph = require('./directed-graph');

/**
 * Mixed graph.
 *
 * Incapsulate func-ty for strict and non-strict ordering graphs.
 *
 * @type {MixedGraph}
 */
module.exports = class MixedGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._orderedGraphMap = new Map();
        this._unorderedGraphMap = new Map();
        this._reverseGraphMap = new Map();
    }
    addVertex(vertex) {
        this._vertices.add(vertex);

        return this;
    }
    hasVertex(vertex) {
        return this._vertices.has(vertex);
    }
    vertices() {
        return this._vertices.values();
    }
    addEdge(fromVertex, toVertex, data) {
        data || (data = {});

        const tech = fromVertex.tech || null;

        this.addVertex(fromVertex)
            .addVertex(toVertex);

        let subgraph = this._getSubgraph({ tech, ordered: data.ordered });

        // Create DirectedGraph for each tech
        if (!subgraph) {
            const graphMap = this._getGraphMap(data);

            subgraph = new DirectedGraph();

            graphMap.set(tech, subgraph);
        }

        subgraph.addEdge(fromVertex, toVertex);

        let reverseSubgraph = this._getSubgraph({ tech, reversed: true });

        // Create DirectedGraph for each tech
        if (!reverseSubgraph) {
            reverseSubgraph = new DirectedGraph();

            this._reverseGraphMap.set(tech, reverseSubgraph);
        }

        reverseSubgraph.addEdge(toVertex, fromVertex);

        return this;
    }
    /**
     * Get direct successors
     *
     * @param {Vertex} vertex - Vertex with succeeding vertices
     * @param {{ordered: ?Boolean, tech: ?String}} data - ?
     * @returns {HOIterator} - Iterator with succeeding vertices
     */
    directSuccessors(vertex, data) {
        data || (data = {});

        const graphMap = this._getGraphMap(data);

        const commonGraph = graphMap.get(null);
        const techGraph = data.tech && graphMap.get(data.tech);

        const vertexWithoutTech = vertex.tech && (new BemCell({ entity: vertex.entity }));
        const vertexWithDataTech = data.tech && !vertex.tech && (new BemCell({ entity: vertex.entity, tech: data.tech }));

        // TODO: think about this shit and order between virtual vertixes
        const commonGraphIterator = vertexWithoutTech && commonGraph && commonGraph.directSuccessors(vertexWithoutTech);
        const commonGraphIterator2 = commonGraph && commonGraph.directSuccessors(vertex);

        const techGraphIterator = vertexWithDataTech && techGraph && techGraph.directSuccessors(vertexWithDataTech);
        const techGraphIterator2 = techGraph && techGraph.directSuccessors(vertex);

        return series(
            commonGraphIterator || [],
            commonGraphIterator2 || [],
            techGraphIterator || [],
            techGraphIterator2 || []
        );
    }
    _getGraphMap(data) {
        return data.reversed ? this._reverseGraphMap
            : data.ordered ? this._orderedGraphMap : this._unorderedGraphMap;
    }
    _getSubgraph(data) {
        return this._getGraphMap(data).get(data.tech);
    }
}

},{"./directed-graph":9,"./vertex-set":13,"@bem/cell":1,"ho-iter":28}],13:[function(require,module,exports){
'use strict';

const hashSet = require('hash-set');

module.exports = hashSet(vertex => vertex.id);

},{"hash-set":27}],14:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":22}],15:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":16,"ieee754":17,"isarray":18}],16:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],17:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],18:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],19:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],20:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],21:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],22:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":21,"_process":19,"inherits":20}],23:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":24}],24:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":25}],25:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype, {
    constructor: {
      value: cls,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExtendableBuiltin, cls);
  } else {
    ExtendableBuiltin.__proto__ = cls;
  }

  return ExtendableBuiltin;
}

var ExtendableError = function (_extendableBuiltin2) {
  _inherits(ExtendableError, _extendableBuiltin2);

  function ExtendableError() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    _classCallCheck(this, ExtendableError);

    // extending Error is weird and does not propagate `message`

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExtendableError).call(this, message));

    Object.defineProperty(_this, 'message', {
      configurable: true,
      enumerable: false,
      value: message,
      writable: true
    });

    Object.defineProperty(_this, 'name', {
      configurable: true,
      enumerable: false,
      value: _this.constructor.name,
      writable: true
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(_this, _this.constructor);
      return _possibleConstructorReturn(_this);
    }

    Object.defineProperty(_this, 'stack', {
      configurable: true,
      enumerable: false,
      value: new Error(message).stack,
      writable: true
    });
    return _this;
  }

  return ExtendableError;
}(_extendableBuiltin(Error));

exports.default = ExtendableError;
module.exports = exports['default'];
},{}],27:[function(require,module,exports){
'use strict';

/**
 * Returns `Set` class with custom equality comparisons.
 *
 * @param {function} hashFn — the function to determine the unique of value.
 * @returns {HashSet}
 */
module.exports = function hashSet(hashFn) {
    if (!hashFn) {
        throw new Error('You should specify hash function to create HashSet.');
    }

    /**
     * Set objects are collections of values, you can iterate its elements in insertion order.
     *
     * A value in the Set may only occur once; it is unique in the Set's collection.
     */
    return class HashSet {
        /**
         * The value of the length property is 0.
         */
        static get length() {
            return 0;
        }
        /**
         * Returns the function that created an instance's prototype.
         *
         * @param iterable If an iterable object is passed, all of its elements will be added to the new Set.
         *                 null is treated as undefined.
         * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of}
         */
        constructor(iterable) {
            this._map = new Map();

            if (iterable) {
                for (let item of iterable) {
                    this.add(item);
                }
            }
        }
        /**
         * The value of size is an integer representing how many entries the Set object has.
         * A set accessor function for size is undefined; you can not change this property.
         *
         * @returns the number of elements in a Set object.
         */
        get size() {
            return this._map.size;
        }
        /**
         * Appends a new element with the given value to the Set object.
         *
         * @param {*} value — the value of the element to add to the Set object.
         * @returns {HashSet}.
         */
        add(value) {
            const id = hashFn(value);

            if (!this._map.has(id)) {
                this._map.set(id, value);
            }

            return this;
        }
        /**
         * Returns a boolean asserting whether an element is present with the given value in the Set object or not.
         *
         * @param {*} value — the value to test for presence in the Set object.
         * @returns {boolean} Returns true if an element with the specified value exists in the Set object;
         *                    otherwise false.
         */
        has(value) {
            const id = hashFn(value);

            return this._map.has(id);
        }
        /**
         * Removes the element associated to the value and returns the value that.
         *
         * `Set.prototype.has(value)` would have previously returned.
         * `Set.prototype.has(value)` will return false afterwards.
         *
         * @param {*} value — the value of the element to remove from the Set object.
         * @returns {boolean} Returns true if an element in the Set object has been removed successfully;
         *                    otherwise false.
         */
        delete(obj) {
            const id = hashFn(obj);

            return this._map.delete(id);
        }
        /**
         * Removes all elements from the Set object.
         */
        clear() {
            this._map.clear();
        }
        /**
         * Returns a new Iterator object that contains an array of [value, value] for each element in the Set object,
         * in insertion order.
         *
         * This is kept similar to the Map object, so that each entry has the same value for its key and value here.
         *
         * @returns {Iterator}
         */
        entries() {
            return this._map.values();
        }
        /**
         * Executes a provided function once per each value in the Set object, in insertion order.
         *
         * It is not invoked for values which have been deleted. However, it is executed for values which are present
         * but have the value undefined.
         *
         * Callback is invoked with three arguments:
         *   * the element value
         *   * the element key
         *   * the Set object being traversed
         *
         * @param {function} callbackFn — function to execute for each element.
         * @param {object} thisArg — value to use as this when executing callback. If a thisArg parameter is provided
         *                           to forEach, it will be used as the this value for each callback.
         */
        forEach(callbackFn, thisArg) {
            this._map.forEach((value, key) => callbackFn.call(thisArg, value, key, this));
        }
        /**
         * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
         *
         * Is the same function as the values() function.
         *
         * @returns {Iterator}
         */
        values() {
            return this._map.values();
        }
        /**
         * Returns a new Iterator object that contains the values for each element in the Set object in insertion order.
         *
         * Is the same function as the values() function.
         *
         * @returns {Iterator}
         */
        keys() {
            return this._map.values();
        }
        /**
         * The initial value of the @@iterator property is the same function object as the initial
         * value of the values property.
         *
         * Is the same function as the values() function.
         *
         * @returns {Iterator}
         */
        [Symbol.iterator]() {
            return this._map.values();
        }
        /**
         * Returns Set object is equivalent to this HashSet object.
         *
         * @returns {Set}
         */
        valueOf() {
            return new Set(this._map.values());
        }
        /**
         * Returns a string representing object.
         *
         * @returns {string}
         */
        toString() {
            return '[object Set]';
        }
    };
}

},{}],28:[function(require,module,exports){
'use strict';

const createIterator = require('./lib/create-iterator');

module.exports = exports = (value) => createIterator(value, { strict: true });

exports.value = require('./lib/value');

exports.isIterable = require('./lib/is-iterable');
exports.isIterator = require('./lib/is-iterator');

exports.series = require('./lib/series');
exports.evenly = require('./lib/evenly');
exports.reverse = require('./lib/reverse');

},{"./lib/create-iterator":29,"./lib/evenly":31,"./lib/is-iterable":32,"./lib/is-iterator":33,"./lib/reverse":35,"./lib/series":36,"./lib/value":38}],29:[function(require,module,exports){
'use strict';

const kindOf = require('kind-of');
const isPromise = require('is-promise');
const isError = require('is-error');

const isIterable = require('./is-iterable');
const isIterator = require('./is-iterator');

const ValueIterator = require('./value-iterator');
const ObjectEntriesIterator = require('./object-entries-iterator');

/**
 * Creates iterator with specified value or iterable object.
 *
 * If value is not specified, returns empty iterator.
 *
 * @param {*} value - primitive value, object or iterable object.
 * @param {object} [opts] - options.
 * @param {boolean} [opts.strict=true] - in strict mode throw error for not iterable values,
 *                                       in non-strict mode create iterator with specified value.
 * @returns {Iterator}
 */
module.exports = function(value, opts) {
    if (arguments.length === 0) {
        return new ValueIterator();
    }

    const type = kindOf(value);

    if (isIterable(value)) {
        return value[Symbol.iterator]();
    }

    if (isIterator(value)) {
        return value;
    }

    if (type === 'object' && !isPromise(value) && !isError(value)) {
        return new ObjectEntriesIterator(value);
    }

    opts || (opts = {});
    opts.hasOwnProperty('strict') || (opts.strict = true);

    if (opts.strict) {
        throw new Error(`It is impossible to create iterator: \`${value}\` is not iterable object.`);
    }

    return new ValueIterator(value);
};

},{"./is-iterable":32,"./is-iterator":33,"./object-entries-iterator":34,"./value-iterator":37,"is-error":39,"is-promise":40,"kind-of":41}],30:[function(require,module,exports){
'use strict';

module.exports = Object.freeze({ done: true });

},{}],31:[function(require,module,exports){
'use strict';

const unspread = require('spread-args').unspread;

const createIterator = require('./create-iterator');
const done = require('./done');

/**
 * Returns an Iterator, that traverses iterators evenly.
 *
 * This is reminiscent of the traversing of several arrays
 *
 * @example
 * const evenly = require('ho-iter').evenly;
 *
 * const arr1 = [1, 2];
 * const arr2 = [3, 4];
 *
 * const set1 = new Set([1, 2]);
 * const set2 = new Set([3, 4]);
 *
 * for (let i = 0; i < arr1.length; i++) {
 *     console.log(arr1[i]);
 *     console.log(arr2[i]);
 * }
 *
 * // 1 3 2 4
 *
 * for (let item of evenly(set1, set2)) {
 *     console.log(item);
 * }
 *
 * // 1 3 2 4
 *
 * @param {Iterable[]} iterables - iterable objects or iterators.
 * @returns {Iterator}
 */
function evenly(iterables) {
    const iterators = iterables.map(iterable => createIterator(iterable, { strict: false }));
    const empties = new Set();

    const count = iterators.length;
    let index = -1;

    /**
     * Returns next iterator.
     *
     * Returns the first iterator after the last one.
     *
     * @returns {Iterator}
     */
    function step() {
        // Back to the first iterator.
        if (index === count - 1) {
            index = -1;
        }

        // Go to the next iterator.
        index++;

        // Ignore empty iterators.
        while(empties.has(index)) {
            if (index === count - 1) {
                index = -1;
            }

            index++;
        }

        return iterators[index];
    }

    /**
     * Returns next value.
     *
     * @returns {{done: boolean, value: *}}
     */
    function next() {
        // Exit if all iterators are traversed.
        if (empties.size === count) {
            return done;
        }

        // Go to the next iterator.
        const iter = step();

        const res = iter.next();

        // Mark iterator as empty and go to the next.
        if (res.done) {
            empties.add(index);

            return next();
        }

        return res;
    }

    return { next, [Symbol.iterator]() { return this; } };
}

module.exports = unspread(evenly);

},{"./create-iterator":29,"./done":30,"spread-args":43}],32:[function(require,module,exports){
'use strict';

/**
 * Returns `true` if the specified object implements the Iterator protocol via implementing a `Symbol.iterator`.
 *
 * @example
 * const isIterable = require('ho-iter').isIterable;
 *
 * isIterable([1, 2, 3]); // true
 * isIterable(123); // false
 *
 * @param  {*} iterable - a value which might implement the Iterable protocol.
 * @return {boolean}
 */
module.exports = (iterable) => iterable != null && typeof iterable[Symbol.iterator] === 'function';

},{}],33:[function(require,module,exports){
'use strict';

/**
 * Returns `true` if the specified object is iterator.
 *
 * @example
 * const isIterator = require('ho-iter').isIterator;
 *
 * const generator = function *() {};
 * const iterator = generator();
 *
 * isIterator(generator) // false
 * isIterator(iterator) // true
 *
 * @param  {*} iterator - the object to inspect.
 * @return {boolean}
 */
module.exports = (iterator) => Boolean(iterator) && typeof iterator.next === 'function';

},{}],34:[function(require,module,exports){
'use strict';

const done = require('./done');

/**
 * Creates an iterator whose elements are arrays corresponding to the enumerable property [key, value] pairs
 * found directly upon object.
 *
 * The ordering of the properties is the same as that given by looping over the property values of the object manually.
 *
 * @example <caption>Iterate by Object entries</caption>
 * const obj = { foo: 'bar', baz: 42 }
 * const entries = new ObjectEntriesIterator(obj);
 *
 * for (let [key, value] of entries) {
 *     console.log(`${key}: ${value}`);
 * }
 *
 * // foo: 'bar'
 * // baz: 42
 *
 * @example <caption>Converting an Object to a Map</caption>
 * const obj = { foo: 'bar', baz: 42 }
 * const entries = new ObjectEntriesIterator(obj);
 * const map = new Map(entries);
 *
 * // Map { foo: "bar", baz: 42 }
 *
 * @param {object} obj — The object whose enumerable own property [key, value] pairs are to be returned.
 * @returns {Iterator}
 */
module.exports = class ObjectEntriesIterator {
    constructor(obj) {
        this._obj = obj;
        this._keys = Object.keys(obj);

        this._length = this._keys.length;
        this._index = 0;
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        if (this._index === this._length) {
            return done;
        }

        const key = this._keys[this._index++];
        const val = this._obj[key];

        return { value: [key, val], done: false };
    }
};

},{"./done":30}],35:[function(require,module,exports){
'use strict';

const createIterator = require('./create-iterator');
const done = require('./done');

/**
 * Returns an reversed Iterator.
 *
 * **Important:** don't use infinite iterator, reverse method fall into endless loop.
 *
 * This is reminiscent of the reversing of array
 *
 * @example
 * const reverse = require('ho-iter').reverse;
 *
 * const arr = [1, 2, 3, 4];
 * const set = new Set([1, 2, 3, 4]);
 *
 * for (let i = lenght; i > 0; i--) {
 *     console.log(arr[i]);
 * }
 *
 * // ➜ 4 3 2 1
 *
 * for (let item of reverse(set)) {
 *     console.log(item);
 * }
 *
 * // ➜ 4 3 2 1
 *
 * @param {Iterable} iterable iterable object to reversing.
 * @returns {Iterator}
 */
function reverse(iterable) {
    if (arguments.length === 0) {
        return createIterator();
    }

    const iter = createIterator(iterable);
    const arr = Array.from(iter);

    let index = arr.length - 1;

    return {
        [Symbol.iterator]() { return this; },
        next() {
            if (index === -1) {
                return done;
            }

            return {
                value: arr[index--],
                done: false
            }
        }
    }
}

module.exports = reverse;

},{"./create-iterator":29,"./done":30}],36:[function(require,module,exports){
'use strict';

const unspread = require('spread-args').unspread;

const createIterator = require('./create-iterator');
const done = require('./done');

/**
 * Returns an Iterator, that traverses iterators in series.
 *
 * This is reminiscent of the concatenation of arrays.
 *
 * @example
 * ```js
 * const series = require('ho-iter').series;
 *
 * const arr1 = [1, 2];
 * const arr2 = [3, 4];
 *
 * const set1 = new Set([1, 2]);
 * const set2 = new Set([3, 4]);
 *
 * [].concat(arr1, arr2); // [1, 2, 3, 4]
 *
 * for (let item of series(set1, set2)) {
 *     console.log(item);
 * }
 *
 * // 1 2 3 4
 * ```
 *
 * @param {Iterable[]} iterables - iterable objects or iterators.
 * @returns {Iterator}
 */
function series(iterables) {
    if (iterables.length === 0) {
        return createIterator();
    }

    let iter = createIterator(iterables.shift(), { strict: false });

    return {
        [Symbol.iterator]() { return this; },
        next() {
            let next = iter.next();

            // If iterator is ended go to the next.
            // If next iterator is empty (is ended) go to the next,
            // until you get not empty iterator, or all iterators are ended.
            while (next.done) {
                // If iterators are ended, then exit.
                if (iterables.length === 0) {
                    return done;
                }

                iter = createIterator(iterables.shift(), { strict: false });

                next = iter.next();
            }

            return next;
        }
    };
}

module.exports = unspread(series);

},{"./create-iterator":29,"./done":30,"spread-args":43}],37:[function(require,module,exports){
'use strict';

const done = require('./done');

/**
 * Iterator with specified value.
 *
 * @example
 * const iter = new ValueIterator(123);
 *
 * iter.next(); // { value: 123, done: false }
 * iter.next(); // { value: null, done: true }
 *
 * @param {*} value — the value which will be in created iterator.
 * @returns {Iterator}
 */
module.exports = class ValueIterator {
    constructor(value) {
        this._value = value;
        this._done = Boolean(arguments.length === 0);
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        if (this._done) {
            return done;
        }

        this._done = true;

        return { value: this._value, done: false };
    }
};

},{"./done":30}],38:[function(require,module,exports){
'use strict';

const ValueIterator = require('./value-iterator');

/**
 * Creates iterator with specified value.
 *
 * @example
 * const hoi = require('ho-iter');
 *
 * const iter = hoi.value(123);
 *
 * iter.next(); // { value: 123, done: false }
 * iter.next(); // { value: null, done: true }
 *
 * @param {*} value — the value which will be in created iterator.
 * @returns {ValueIterator}
 */
module.exports = (value) => new ValueIterator(value);

},{"./value-iterator":37}],39:[function(require,module,exports){
'use strict';

var objectToString = Object.prototype.toString;
var getPrototypeOf = Object.getPrototypeOf;
var ERROR_TYPE = '[object Error]';

module.exports = isError;

function isError(err) {
    if (typeof err !== 'object') {
        return false;
    }
    while (err) {
        if (objectToString.call(err) === ERROR_TYPE) {
            return true;
        }
        err = getPrototypeOf(err);
    }
    return false;
}

},{}],40:[function(require,module,exports){
module.exports = isPromise;

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

},{}],41:[function(require,module,exports){
(function (Buffer){
var isBuffer = require('is-buffer');
var toString = Object.prototype.toString;

/**
 * Get the native `typeof` a value.
 *
 * @param  {*} `val`
 * @return {*} Native javascript type
 */

module.exports = function kindOf(val) {
  // primitivies
  if (typeof val === 'undefined') {
    return 'undefined';
  }
  if (val === null) {
    return 'null';
  }
  if (val === true || val === false || val instanceof Boolean) {
    return 'boolean';
  }
  if (typeof val === 'string' || val instanceof String) {
    return 'string';
  }
  if (typeof val === 'number' || val instanceof Number) {
    return 'number';
  }

  // functions
  if (typeof val === 'function' || val instanceof Function) {
    return 'function';
  }

  // array
  if (typeof Array.isArray !== 'undefined' && Array.isArray(val)) {
    return 'array';
  }

  // check for instances of RegExp and Date before calling `toString`
  if (val instanceof RegExp) {
    return 'regexp';
  }
  if (val instanceof Date) {
    return 'date';
  }

  // other objects
  var type = toString.call(val);

  if (type === '[object RegExp]') {
    return 'regexp';
  }
  if (type === '[object Date]') {
    return 'date';
  }
  if (type === '[object Arguments]') {
    return 'arguments';
  }

  // buffer
  if (typeof Buffer !== 'undefined' && isBuffer(val)) {
    return 'buffer';
  }

  // es6: Map, WeakMap, Set, WeakSet
  if (type === '[object Set]') {
    return 'set';
  }
  if (type === '[object WeakSet]') {
    return 'weakset';
  }
  if (type === '[object Map]') {
    return 'map';
  }
  if (type === '[object WeakMap]') {
    return 'weakmap';
  }
  if (type === '[object Symbol]') {
    return 'symbol';
  }

  // typed arrays
  if (type === '[object Int8Array]') {
    return 'int8array';
  }
  if (type === '[object Uint8Array]') {
    return 'uint8array';
  }
  if (type === '[object Uint8ClampedArray]') {
    return 'uint8clampedarray';
  }
  if (type === '[object Int16Array]') {
    return 'int16array';
  }
  if (type === '[object Uint16Array]') {
    return 'uint16array';
  }
  if (type === '[object Int32Array]') {
    return 'int32array';
  }
  if (type === '[object Uint32Array]') {
    return 'uint32array';
  }
  if (type === '[object Float32Array]') {
    return 'float32array';
  }
  if (type === '[object Float64Array]') {
    return 'float64array';
  }

  // must be a plain object
  return 'object';
};

}).call(this,require("buffer").Buffer)
},{"buffer":15,"is-buffer":42}],42:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],43:[function(require,module,exports){
/*! spread-args 0.1.2 Original author Alan Plum <me@pluma.io>. Released into the Public Domain under the UNLICENSE. @preserve */
module.exports = spread;
spread.unspread = unspread;

function spread(fn) {
  return function(args) {
    return fn.apply(this, args.concat(
      Array.prototype.slice.call(arguments, 1)
    ));
  };
}

function unspread(fn) {
  return function() {
    return fn.call(this, Array.prototype.slice.call(arguments, 0));
  };
}
},{}]},{},[6])(6)
});
