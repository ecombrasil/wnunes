(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const easy_coding_1 = require("easy-coding");
const main_1 = require("./main");
const inicio_page_1 = require("./inicio.page");
const catalogo_page_1 = require("./catalogo.page");
const produto_page_1 = require("./produto.page");
let App = class App {
    constructor() {
        this.declarations = [
            inicio_page_1.default,
            catalogo_page_1.default,
            produto_page_1.default,
        ];
        this.addListeners();
    }
    addListeners() {
        // Avoid images from getting dragged by the user
        document.body.ondragstart = () => false;
        // Enable elements with the atribute clickAndGo to open links by clicking them
        easy_coding_1.handleBindingAttr('clickAndGo', (element, value) => element.addEventListener('click', () => window.location.href = value));
    }
};
App = __decorate([
    main_1.default
], App);

},{"./catalogo.page":2,"./inicio.page":3,"./main":4,"./produto.page":6,"easy-coding":10}],2:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _items, _pages, _currentPage, _ratings;
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
const easy_coding_1 = require("easy-coding");
let CatalogoPage = class CatalogoPage {
    constructor() {
        _items.set(this, []);
        _pages.set(this, []);
        _currentPage.set(this, 0);
        _ratings.set(this, []);
        this.storageRoot = 'https://wnunes.s3.sa-east-1.amazonaws.com/';
        this.parentElement = document.getElementById('catalog-wrapper');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.orderingSelect = document.querySelector('.ordering-btn');
        this.addListeners();
        this.setActiveSection();
        this.getRatingsList();
        this.getItemsList();
    }
    addListeners() {
        this.loadMoreBtn.addEventListener('click', () => this.nextPage());
        this.orderingSelect.addEventListener('change', () => this.init());
    }
    getItemsList() {
        const json = document.getElementById('items-list').innerHTML;
        const items = JSON.parse(json);
        this.items = items;
    }
    getRatingsList() {
        const json = document.getElementById('ratings-list').innerHTML;
        const ratings = JSON.parse(json);
        __classPrivateFieldSet(this, _ratings, ratings);
    }
    init() {
        this.parentElement.innerHTML = '';
        this.sortItems();
        this.createPages();
    }
    get items() {
        return __classPrivateFieldGet(this, _items);
    }
    set items(value) {
        __classPrivateFieldSet(this, _items, value);
        value.length && this.init();
    }
    get pages() {
        return __classPrivateFieldGet(this, _pages);
    }
    set pages(value) {
        __classPrivateFieldSet(this, _pages, value);
    }
    get currentPage() {
        return __classPrivateFieldGet(this, _currentPage);
    }
    set currentPage(value) {
        __classPrivateFieldSet(this, _currentPage, value);
        this.pages[value].forEach(item => this.renderElement(item));
        this.toggleLoadMoreBtn(!(this.currentPage === this.pages.length - 1));
    }
    createPages(itemsPerPage = 24) {
        this.pages = [];
        let availableItems = [...this.items];
        while (availableItems.length > 0)
            this.pages.push(availableItems.splice(0, itemsPerPage));
        this.currentPage = 0;
    }
    toggleLoadMoreBtn(show) {
        this.loadMoreBtn.style.display = show ? 'block' : 'none';
    }
    nextPage() {
        if (this.currentPage < this.pages.length - 1)
            this.currentPage++;
    }
    sortItems() {
        const by = this.orderingSelect.value;
        by === '+recentes' ?
            this.items.sort((a, b) => b.pk - a.pk) :
            this.items.sort((a, b) => a.pk - b.pk);
    }
    ;
    renderElement(item) {
        const imgUrl = item.fields.foto ?
            this.storageRoot.concat(item.fields.foto) : '/static/img/loading-img.svg';
        const element = easy_coding_1.createElement('div', {
            content: `
        <img src="${imgUrl}" alt="Imagem do produto ${item.fields.nome}" class="item-img">
        <div class="stars-group"></div>
        <h3 class="item-name">${item.fields.nome}</h3>
        <p class="item-description">${item.fields.descricao}</p>
      `,
            classes: ['catalog-item'],
            childOf: this.parentElement
        });
        const itemRating = __classPrivateFieldGet(this, _ratings).find(rating => rating.pk === item.pk).pontuacao;
        if (itemRating)
            for (let i = 0; i < itemRating; i++) {
                const star = easy_coding_1.createElement('img', {
                    classes: ['star'],
                    childOf: element.querySelector('.stars-group')
                });
                star.setAttribute('alt', 'Ilustração de estrela, utilizada na classicação do produto pelo usuário');
                star.setAttribute('src', '/static/img/star.svg');
            }
    }
    setActiveSection() {
        var _a;
        const availableSections = (_a = document.querySelector('.page-header')) === null || _a === void 0 ? void 0 : _a.querySelectorAll('a');
        const path = window.location.href;
        availableSections === null || availableSections === void 0 ? void 0 : availableSections.forEach(a => {
            if (a.href === path) {
                const p = a.querySelector('.pg-header-option');
                p === null || p === void 0 ? void 0 : p.classList.add('active-pg-option');
            }
        });
    }
};
_items = new WeakMap(), _pages = new WeakMap(), _currentPage = new WeakMap(), _ratings = new WeakMap();
CatalogoPage = __decorate([
    page_1.default('/catalogo/*')
], CatalogoPage);
exports.default = CatalogoPage;

},{"./page":5,"easy-coding":10}],3:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
let InicioPage = class InicioPage {
    constructor() {
        this.addListeners();
    }
    addListeners() {
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
InicioPage = __decorate([
    page_1.default('/')
], InicioPage);
exports.default = InicioPage;

},{"./page":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Main = (type) => {
    // Create instance
    new type();
    // Dispatch event
    const event = new Event('mainComponentLoaded');
    window.dispatchEvent(event);
    return type;
};
exports.default = Main;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Page = (route, options) => (type) => {
    const path = window.location.pathname;
    let properRoute;
    /**
     * Check if the route is the same as the current location
     * @param str {string} Route
     */
    const checkRoute = (str) => {
        if (str.endsWith('*')) {
            str = str.slice(0, -1);
            return path.startsWith(str);
        }
        else
            return path === str;
    };
    // Check each route if `route` argument is array
    if (Array.isArray(route))
        for (const r of route) {
            if (checkRoute(r)) {
                properRoute = r;
                break;
            }
        }
    // Check route if `route` is a single string
    else if (checkRoute(route))
        properRoute = route;
    // Create new `type` instance if the provided route matches
    // the current location
    if (properRoute) {
        const initialize = () => {
            const instance = new type();
            if (options === null || options === void 0 ? void 0 : options.globalInstance) {
                const objectName = type.name.charAt(0).toLowerCase() + type.name.substring(1);
                window[objectName] = instance;
            }
        };
        if (options === null || options === void 0 ? void 0 : options.startAnytime)
            initialize();
        else
            window.addEventListener('mainComponentLoaded', initialize);
    }
    return type;
};
exports.default = Page;

},{}],6:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
let ProdutoPage = class ProdutoPage {
    constructor() {
        this.addListeners();
    }
    addListeners() { }
};
ProdutoPage = __decorate([
    page_1.default('/produto/*')
], ProdutoPage);
exports.default = ProdutoPage;

},{"./page":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
/**
 * Decorator function that add the given class to `globalThis`
 * @param type {Type} Class that will be added to `globalThis`
 */
exports.Global = (type) => (globalThis[type.name] = type);

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSpecialChars = exports.randomDateBetween = exports.randomNumberBetween = exports.getRandomValueFrom = exports.ruleOfThree = exports.makeGlobal = exports.addGlobalEntries = exports.handleBindingAttr = exports.createElement = void 0;
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
 * Receive an object and add its properties to the `window` object
 * @param set {object} Object with properties that will be added to the `window` object
 */
exports.addGlobalEntries = (set) => Object.entries(set).forEach((entry) => (window[entry[0]] = entry[1]));
/**
 * Add a new property to the `window` object
 * @param key {string} Property name
 * @param value {any} Property value
 */
exports.makeGlobal = (key, value) => (window[key] = value);
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

},{}],10:[function(require,module,exports){
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

},{"./classes":7,"./decorators":8,"./functions":9}]},{},[1]);
