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
const carrinho_page_1 = require("./carrinho.page");
const produto_page_1 = require("./produto.page");
const kit_page_1 = require("./kit.page");
const criar_conta_page_1 = require("./criar-conta.page");
let App = class App {
    constructor() {
        this.pages = [
            inicio_page_1.default,
            catalogo_page_1.default,
            produto_page_1.default,
            kit_page_1.default,
            carrinho_page_1.default,
            criar_conta_page_1.default
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

},{"./carrinho.page":2,"./catalogo.page":3,"./criar-conta.page":4,"./inicio.page":5,"./kit.page":6,"./main":7,"./produto.page":9,"easy-coding":14}],2:[function(require,module,exports){
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
var _carrinhoService;
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
const http_service_ts_1 = require("http-service-ts");
const easy_coding_1 = require("easy-coding");
let CarrinhoPage = class CarrinhoPage {
    constructor() {
        _carrinhoService.set(this, void 0);
        __classPrivateFieldSet(this, _carrinhoService, new http_service_ts_1.Service('/api/item-carrinho', {
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': easy_coding_1.Cookies.get('csrftoken')
            }),
            appendSlash: true
        }));
        this.enableItemsControls();
    }
    enableItemsControls() {
        // List of elements the represent cart items
        const itemsAsElements = document.querySelectorAll('.cart-item');
        // Iterate each element to add its proper listeners
        itemsAsElements === null || itemsAsElements === void 0 ? void 0 : itemsAsElements.forEach(element => {
            const [removeBtn, addBtn, deleteBtn] = element.getElementsByClassName('cart-item-option-btn');
            const errorMessage = element.querySelector('.cart-item-error-message');
            const id = Number(element.id);
            const errorHandler = (message) => {
                // Display error message
                errorMessage.textContent = message;
                errorMessage.style.display = 'flex';
            };
            const patchSuccessHandler = (partial) => {
                this.setItemQuantity(element, partial.qntd);
                this.updateCartPrice();
                // Remove previous error message
                errorMessage.style.display = 'none';
            };
            // Action when user clicks to remove an unity
            removeBtn.addEventListener('click', () => __classPrivateFieldGet(this, _carrinhoService).patch({ qntd: this.getItemQuantity(element) - 1 }, id)
                .then((partial) => patchSuccessHandler(partial), (error) => errorHandler(error.data.message)));
            // Action when user clicks to add an unity
            addBtn.addEventListener('click', () => __classPrivateFieldGet(this, _carrinhoService).patch({ qntd: this.getItemQuantity(element) + 1 }, id)
                .then((partial) => patchSuccessHandler(partial), (error) => errorHandler(error.data.message)));
            // Action when user clicks to delete the item
            deleteBtn.addEventListener('click', () => __classPrivateFieldGet(this, _carrinhoService).delete(id)
                .then((success) => element.remove(), (error) => errorHandler('Houve um erro ao tentar excluir este item.')));
        });
    }
    getItemQuantity(element) {
        return Number(element.querySelector('.cart-item-qntd').textContent.split(' ')[0]);
    }
    setItemQuantity(element, qntd) {
        const qntdElement = element.querySelector('.cart-item-qntd');
        qntdElement.textContent = qntd + ' unidade';
        if (qntd > 1)
            qntdElement.textContent += 's';
    }
    calcCartPrice() {
        const parent = document.querySelector('.cart-wrapper');
        const cartItems = parent.querySelectorAll('.cart-item');
        let totalPrice = 0;
        cartItems.forEach(element => {
            const price = Number(element.querySelector('.cart-item-preco').textContent.split(' ')[1].replace(',', '.'));
            const qntd = Number(element.querySelector('.cart-item-qntd').textContent.split(' ')[0]);
            totalPrice += price * qntd;
        });
        return totalPrice;
    }
    updateCartPrice() {
        const price = String(this.calcCartPrice()).replace('.', ',');
        document.querySelector('#cart-price').textContent = 'R$ ' + price;
    }
};
_carrinhoService = new WeakMap();
CarrinhoPage = __decorate([
    page_1.default('/carrinho')
], CarrinhoPage);
exports.default = CarrinhoPage;

},{"./page":8,"easy-coding":14,"http-service-ts":15}],3:[function(require,module,exports){
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
        this.loadMoreBtn = document.querySelector('.load-more-btn-wrapper');
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
        this.items = JSON.parse(json);
    }
    getRatingsList() {
        const json = document.getElementById('ratings-list').innerHTML;
        __classPrivateFieldSet(this, _ratings, JSON.parse(json));
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
        let link = Object(item.fields).hasOwnProperty('itens') ? '/kit/' : '/produto/';
        link += item.pk;
        const element = easy_coding_1.createElement('div', {
            classes: ['catalog-item'],
            attributes: [['clickAndGo', link]],
            content: `
        <img src="${imgUrl}" alt="Imagem do produto ${item.fields.nome}" class="item-img">
        <div class="stars-group"></div>
        <h3 class="item-name">${item.fields.nome}</h3>
        <p class="item-description">${item.fields.descricao}</p>
      `,
            childOf: this.parentElement
        });
        const itemRating = __classPrivateFieldGet(this, _ratings).find(rating => rating.pk === item.pk).pontuacao;
        if (itemRating) {
            const starsGroupElement = element.querySelector('.stars-group');
            // Add stars according to the customers rating
            for (let i = 0; i < itemRating; i++)
                easy_coding_1.createElement('img', {
                    classes: ['star'],
                    attributes: [
                        ['alt', 'Ilustração de estrela, utilizada na classicação do produto pelo usuário'],
                        ['src', '/static/img/star.svg']
                    ],
                    childOf: starsGroupElement
                });
        }
    }
    setActiveSection() {
        const availableSections = document.querySelector('.page-header').querySelectorAll('a');
        availableSections.forEach(a => {
            var _a;
            if (a.href === window.location.href)
                (_a = a.querySelector('.pg-header-option')) === null || _a === void 0 ? void 0 : _a.classList.add('active-pg-option');
        });
    }
};
_items = new WeakMap(), _pages = new WeakMap(), _currentPage = new WeakMap(), _ratings = new WeakMap();
CatalogoPage = __decorate([
    page_1.default('/catalogo/*')
], CatalogoPage);
exports.default = CatalogoPage;

},{"./page":8,"easy-coding":14}],4:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
let CriarContaPage = class CriarContaPage {
    constructor() {
        this.toggleUFSelectMenu();
    }
    toggleUFSelectMenu() {
        const checkBox = document.getElementsByName('is_pessoa_juridica')[0];
        const UFMenu = document.querySelector('.uf-wrapper');
        checkBox.addEventListener('change', () => UFMenu.style.display = checkBox.checked ? 'inline-block' : 'none');
    }
};
CriarContaPage = __decorate([
    page_1.default('/criar-conta')
], CriarContaPage);
exports.default = CriarContaPage;

},{"./page":8}],5:[function(require,module,exports){
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

},{"./page":8}],6:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
const utils_1 = require("./utils");
let KitPage = class KitPage {
    constructor() {
        this.fixDescription();
    }
    fixDescription() {
        const descriptionElements = document.getElementsByClassName('product-description');
        if (descriptionElements.length > 1) {
            const last = descriptionElements[1];
            last.innerHTML = utils_1.replaceLast(',', '.', last.innerHTML);
        }
    }
};
KitPage = __decorate([
    page_1.default('/kit/*')
], KitPage);
exports.default = KitPage;

},{"./page":8,"./utils":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Automatically creates an instance of the given class and
 * dispatch an event called `mainComponentLoaded` that is used
 * to say to other components that they can be initialize now.
 * @param type {Type} Main class of the application
 */
const Main = (type) => {
    // Create instance
    new type();
    // Dispatch event
    const event = new Event('mainComponentLoaded');
    window.dispatchEvent(event);
    return type;
};
exports.default = Main;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Automatically initialize an instance of the given class if one of the routes
 * passed in the first parameter matches the current path.
 *
 * @param route {string | string[]} Route or array of routes. If the currrent
 * path matches one of them, an instance of the given class is initialized.
 * @param options {PageOptions} Object with options about the instance
 * and its initilization.
 */
const Page = (route, options) => (type) => {
    const path = window.location.pathname;
    let properRoute;
    /**
     * Check if the route is the same as the current location.
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

},{}],9:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _title;
Object.defineProperty(exports, "__esModule", { value: true });
const page_1 = require("./page");
let ProdutoPage = class ProdutoPage {
    constructor() {
        _title.set(this, void 0);
    }
    get title() {
        return __classPrivateFieldGet(this, _title);
    }
    set title(value) {
        __classPrivateFieldSet(this, _title, value);
        this.createTitle();
    }
    createTitle() {
        const nameElement = document.querySelector('.product-name');
        const words = this.title.split(' ');
        let properClass = 'title-size-';
        if (words.length <= 3)
            properClass += 1;
        else if (words.length === 4)
            properClass += 2;
        else
            properClass += 3;
        nameElement.classList.add(properClass);
        if (words.length === 1)
            nameElement.innerHTML = `<span class="title-first-line">${words[0]}</span>`;
        else {
            const half = Math.floor(words.length / 2);
            nameElement.innerHTML = `
        <span class="title-first-line">${words.slice(0, half).join(' ')}</span><br>
        ${words.slice(half).join(' ')}
      `;
        }
    }
};
_title = new WeakMap();
ProdutoPage = __decorate([
    page_1.default(['/produto/*', '/kit/*'], {
        globalInstance: true
    })
], ProdutoPage);
exports.default = ProdutoPage;

},{"./page":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceLast = void 0;
/**
 * Replace the last ocurrence of a string inside another one.
 * @param find {string} String to be replaced
 * @param replace {string} String to be placed
 * @param string {string} String where the replacement will be done
 * @returns {string} The given string after the replacement.
 */
function replaceLast(find, replace, string) {
    const lastIndex = string.lastIndexOf(find);
    if (lastIndex === -1)
        return string;
    const beginString = string.substring(0, lastIndex);
    const endString = string.substring(lastIndex + find.length);
    return beginString + replace + endString;
}
exports.replaceLast = replaceLast;

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
/**
 * Decorator function that add the given class to `globalThis`
 * @param type {Type} Class that will be added to `globalThis`
 */
exports.Global = (type) => (globalThis[type.name] = type);

},{}],13:[function(require,module,exports){
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
    const { id, classes, attributes, content, listeners } = options;
    if (id)
        element.id = id;
    if (classes)
        element.classList.add(...classes);
    if (content)
        element.innerHTML = content;
    attributes === null || attributes === void 0 ? void 0 : attributes.forEach((arr) => element.setAttribute(arr[0], arr[1]));
    listeners === null || listeners === void 0 ? void 0 : listeners.forEach((listener) => element.addEventListener(...listener));
    (_a = options.childOf) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    return element;
};
/**
 * Get DOM elements with the specified attribute and run a callback
 * function for each one, passing the element and its attribute value as
 * arguments
 * @param attribute {string} Element attribute
 * @param callback {(element: Element, value: string) => any} Callback function
 * that runs for each element with the specified attribute. The element and its
 * attribute value are the arguments for the function
 */
exports.handleBindingAttr = (attribute, callback) => {
    // Get elements instantly generated
    const bindingElements = [...document.querySelectorAll(`[${attribute}]`)];
    bindingElements.forEach((element) => {
        const attr = element.getAttribute(attribute);
        if (attr)
            callback(element, attr);
    });
    // Get elements dinamically generated
    new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList')
                mutation.addedNodes.forEach((node) => {
                    const element = node;
                    const attr = element.getAttribute(attribute);
                    if (attr)
                        callback(element, attr);
                });
        });
    }).observe(document, {
        childList: true,
        subtree: true,
    });
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

},{}],14:[function(require,module,exports){
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

},{"./classes":11,"./decorators":12,"./functions":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
exports.Service = service_1.default;
const request_parser_1 = require("./request.parser");
exports.RequestParser = request_parser_1.default;

},{"./request.parser":16,"./service":17}],16:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class
 *
 * Allows to make requests and save some configurations for future
 * requests too. Accepts an API root at the constructor that can be used
 * to fix an URL to fetch. If one be provided, every future request will
 * fetch this URL + the URL passed in `RequestArgs` interface.
 */
class RequestParser {
    /**
     * @param {string} [root] You can provide a value for root property
     * or simply pass one every time you access `request()` method.
     * @param {HttpConfig} [config] Configurations that will be aplied
     * in every request.
     */
    constructor(root, config) {
        this.root = root;
        /**
         * @param {string} start First piece of URL (API root). E.g. `'https://api.example.com'`
         * @param {string} [final] Last piece of URL. E.g. `'users/12'`
         *
         * @returns {string} URL with a slash between its first and last pieces or a slash at the end of the first.
         */
        this.hasSlash = (start, end) => end ? start.endsWith('/') || end.startsWith('/') : start.endsWith('/');
        this.config = config || {
            headers: new Headers(),
            appendSlash: false,
        };
    }
    /**
     * @param {RequestArgs<T>} args Provide request configurations
     *
     * @returns {Promise<T>} Promise with parsed content
     */
    request(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = '';
            // Add root if there's one
            if (this.root)
                url = this.root;
            // Concat root with URI if they were provided
            if (this.root && args.url)
                url += this.hasSlash(this.root, args.url) ? args.url : `/${args.url}`;
            // fetch URL provided in arguments
            if (!this.root && args.url)
                url = args.url;
            // add a slash
            if (this.config.appendSlash && !this.hasSlash(url))
                url += '/';
            // add ID
            if (args.id)
                url += this.config.appendSlash ? args.id + '/' : args.id.toString();
            // Append search params to the end of URL
            if (args.params) {
                // Remove last slash and add a "?"
                if (url.endsWith('/'))
                    url = url.substring(0, url.length - 1);
                url += '?';
                // Add params and remove last "&"
                for (const key in args.params)
                    url += `${key}=${args.params[key]}&`;
                url = url.substring(0, url.length - 1);
            }
            // Configure request
            const requestInit = {
                method: args.method.toUpperCase(),
                headers: args.headers || this.config.headers,
                mode: args.noCors === true ? 'no-cors' : 'cors',
            };
            // Add body if there is one
            if (args.method !== 'get' && args.obj)
                requestInit.body = JSON.stringify(args.obj);
            // Request
            const req = yield fetch(url, requestInit);
            // Return promise with parsed content from response
            return this.parse(req);
        });
    }
    /**
     * @param {Response} response Response to turn into JSON, Text or Blob
     *
     * @returns {Promise<T | string | null | Blob>} Promise with formatted content
     */
    parse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            let p;
            const contentType = response.headers.get('content-type');
            if (contentType === 'application/json')
                // Object
                p = yield response.json();
            else if (contentType && contentType.startsWith('text'))
                // Text
                p = yield response.text();
            else if (!contentType)
                // Null
                p = null;
            // Blob
            else
                p = yield response.blob();
            return new Promise((resolve, reject) => (response.status >= 200 && response.status < 300 ? resolve(p) : reject(p)));
        });
    }
}
exports.default = RequestParser;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_parser_1 = require("./request.parser");
/**
 * @class
 *
 * Customizable service that allow to perform main HTTP requests.
 * Extends `RequestParser` class. So it's possible to add more types of
 * request when extending this class.
 */
class Service extends request_parser_1.default {
    /**
     * @param {string} apiRoot Collection path (e.g. `"https://api.example.com/users/"`)
     */
    constructor(apiRoot, config) {
        super(apiRoot, config);
    }
    /**
     * @returns {Promise<T[]>} Promise with array of objets
     */
    get() {
        return this.request({ method: 'get' });
    }
    /**
     * @param {number} id Object ID to fetch
     * @returns {Promise<T>} A promise of object
     */
    getById(id) {
        return this.request({ method: 'get', id });
    }
    /**
     * @param {T} obj Object to post
     * @returns {Promise<T>} Posted object
     */
    post(obj) {
        return this.request({ method: 'post', obj });
    }
    /**
     * @param {T} obj Object to update
     * @param {number} id ID of object that will be updated
     * @returns {Promise<T>} Updated object
     */
    put(obj, id) {
        return this.request({ method: 'put', obj, id });
    }
    /**
     * @param {Partial<T>} obj Object to update
     * @param {number} id ID of object that will be updated
     * @returns {Promise<Partial<T>>} Updated object part
     */
    patch(obj, id) {
        return this.request({ method: 'patch', obj, id });
    }
    /**
     * @param {number} id ID of object that will be deleted
     * @returns {Promise<null>} Null
     */
    delete(id) {
        return this.request({ method: 'delete', id });
    }
}
exports.default = Service;

},{"./request.parser":16}]},{},[1]);
