(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
class Catalogo {
    constructor() {
        this.items = [];
        this.elements = [];
    }
    init() { }
}
let CatalogoProdutos = class CatalogoProdutos extends Catalogo {
    constructor() {
        super();
    }
};
CatalogoProdutos = __decorate([
    page_1.default('/catalogo/produtos', {
        globalInstance: true
    })
], CatalogoProdutos);
const catalogos = [
    CatalogoProdutos
];
exports.default = catalogos;

},{"./page":4}],2:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("./shared");
const easy_coding_1 = require("easy-coding");
const inicio_1 = require("./inicio");
const catalogos_1 = require("./catalogos");
let App = class App {
    constructor() {
        this.declarations = [
            inicio_1.default,
            ...catalogos_1.default
        ];
        this.addListeners();
    }
    addListeners() {
        // Avoid images from getting arrested by the user
        document.body.ondragstart = () => false;
        // Enable elements with the atribute clickAndGo to open links by clicking them
        easy_coding_1.handleBindingAttr('clickAndGo', (element, value) => element.addEventListener('click', () => window.location.href = value));
    }
};
App = __decorate([
    shared_1.default
], App);

},{"./catalogos":1,"./inicio":3,"./shared":5,"easy-coding":9}],3:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
let Inicio = class Inicio {
    constructor() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initSlider();
            this.setSlidesSize();
        });
        window.addEventListener('resize', () => this.setSlidesSize());
    }
    initSlider() {
        const slider = document.getElementById('customers-slider');
        const controllers = document.getElementsByClassName('slider-btn-controller');
        const animate = (direction, btn) => {
            switch (direction) {
                case 'left':
                    slider.scrollLeft = 0;
                    break;
                case 'center':
                    slider.scrollLeft = (slider.scrollWidth - slider.clientWidth) / 2;
                    break;
                case 'right':
                    slider.scrollLeft = slider.scrollWidth;
                    break;
            }
            if (btn)
                for (const c of controllers)
                    c.classList.toggle('active-slider-controller', c === btn);
        };
        controllers[0].addEventListener('click', (e) => animate('left', e.target));
        controllers[1].addEventListener('click', (e) => animate('center', e.target));
        controllers[2].addEventListener('click', (e) => animate('right', e.target));
        animate('center');
    }
    setSlidesSize() {
        const slides = [...document.querySelectorAll('.customer-box')];
        const windowWidth = window.innerWidth;
        if (windowWidth <= 600)
            slides.forEach(el => el.style.height = el.clientWidth + 'px');
        else if (windowWidth <= 1366)
            slides.forEach(el => el.style.height = '22em');
        else
            slides.forEach(el => el.style.height = '25em');
    }
};
Inicio = __decorate([
    page_1.default('/')
], Inicio);
exports.default = Inicio;

},{"./page":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page = (route, options) => (type) => {
    let instance;
    if (Array.isArray(route))
        for (const r of route) {
            if (window.location.pathname === r) {
                instance = new type();
                break;
            }
        }
    else if (window.location.pathname === route)
        instance = new type();
    if (instance && (options === null || options === void 0 ? void 0 : options.globalInstance)) {
        const objectName = type.name.charAt(0).toLowerCase() + type.name.substring(1);
        window[objectName] = instance;
    }
    return type;
};
exports.default = Page;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shared = (type) => {
    new type();
    return type;
};
exports.default = Shared;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
/**
 * Basic cookie handler for setting and reading cookies
 */
class Cookies {
    /**
     * Allows to set a cookie
     * @param cname {string} Cookie name
     * @param cvalue {string} Cookie value
     * @param exdays {string} Cookie duration in days
     */
    static set(cookieName, value, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + d.toUTCString();
        document.cookie = `${cookieName}=${value};${expires};path=/`;
    }
    /**
     * Returns cookie value
     * @param cname {string} Cookie name
     * @returns {string} Value for the given cookie name
     */
    static get(cookieName) {
        const name = cookieName + '=';
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ')
                c = c.substring(1);
            if (c.indexOf(name) === 0)
                return c.substring(name.length, c.length);
        }
        return '';
    }
}
exports.Cookies = Cookies;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
/**
 * Decorator function that add the given class to `globalThis`
 * @param type {Type} Class that will be added to `globalThis`
 */
exports.Global = (type) => (globalThis[type.name] = type);

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecialChars = exports.randomDateBetween = exports.randomNumberBetween = exports.getRandomValueFrom = exports.ruleOfThree = exports.makeGlobal = exports.handleBindingAttr = exports.createElement = void 0;
/**
 * Create a new element with custom options and return it
 * @param tag {keyof HTMLElementTagNameMap} Element tag
 * @param options {NewElementOptions} Options for the new element, such as id, classes and event listeners
 * @returns New HTMLElement
 */
exports.createElement = (tag, options) => {
    var _a;
    const element = document.createElement(tag);
    const { id, classes, content, listeners } = options;
    if (id)
        element.id = id;
    if (classes)
        element.classList.add(...classes);
    if (content)
        element.innerHTML = content;
    listeners === null || listeners === void 0 ? void 0 : listeners.forEach((listener) => element.addEventListener(...listener));
    (_a = options.childOf) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    return element;
};
/**
 * Get DOM elements with the specified attribute and run a callback
 * function for each one, passing the element and its attribute value as
 * arguments
 * @param attr {string} Element attribute
 * @param callback {(element: Element, value: string) => any} Callback function
 * that runs for each element with the specified attribute. The element and its
 * attribute value are the arguments for the function
 */
exports.handleBindingAttr = (attr, callback) => {
    const bindings = document.querySelectorAll(`[${attr}]`);
    bindings.forEach((element) => callback(element, element.getAttribute(attr)));
};
/**
 * Receive an object and add its properties to `globalThis`
 * @param set {object} Object with properties that will be added to `globalThis`
 */
exports.makeGlobal = (set) => Object.entries(set).forEach((entry) => (globalThis[entry[0]] = entry[1]));
/**
 * Return x where `a` is equivalent to `b` and `c` is equivalent to x
 */
exports.ruleOfThree = (a, b, c) => (b * c) / a;
/* tslint:disable:no-bitwise */
/**
 * Return an index value from the given array
 * @param arr {T[]} Any type of array
 * @returns {T} Random index value from the given array
 */
exports.getRandomValueFrom = (arr) => arr[~~(Math.random() * arr.length)];
/* tslint:enable:no-bitwise */
/**
 * Returns a random number between the two given parameters
 * @param min {number}
 * @param max {number}
 * @returns {number} Random number between min and max
 */
exports.randomNumberBetween = (min, max) => Math.random() * (max - min) + min;
/**
 * Returns random date between two other dates
 * @returns {string} Random date
 */
exports.randomDateBetween = (date1, date2) => {
    date1 = date1 || '01-01-1970';
    date2 = date2 || new Date().toLocaleDateString();
    date1 = new Date(date1).getTime();
    date2 = new Date(date2).getTime();
    return date1 > date2
        ? new Date(exports.randomNumberBetween(date2, date1)).toLocaleDateString()
        : new Date(exports.randomNumberBetween(date1, date2)).toLocaleDateString();
};
/**
 * Returns the given string without special chars
 * @param str {string} Initial string
 * @returns {string} The given string without special chars
 */
exports.removeSpecialChars = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

},{}],9:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./functions"), exports);
__exportStar(require("./decorators"), exports);
__exportStar(require("./classes"), exports);

},{"./classes":6,"./decorators":7,"./functions":8}]},{},[2]);
