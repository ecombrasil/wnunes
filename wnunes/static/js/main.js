(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;
window.addEventListener('load', () => {
    const headerElement = document.querySelector('#header');
    const mainElement = document.querySelector('main');
    // Add shadows to the header after scrolling more than 70 pixels
    mainElement.addEventListener('scroll', () => headerElement.classList.toggle('shaded-header', mainElement.scrollTop > 70));
});
// Enable elements with the atribute clickAndGo to be clicked to open links
utils_1.handleBindingAttr('clickAndGo', (element, value) => element.addEventListener('click', () => window.location.href = value));

},{"./utils":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBindingAttr = void 0;
exports.handleBindingAttr = (attr, callback) => {
    const bindings = document.querySelectorAll(`[${attr}]`);
    bindings.forEach(element => {
        const value = element.getAttribute('clickAndGo');
        callback(element, value);
    });
};

},{}]},{},[1]);
