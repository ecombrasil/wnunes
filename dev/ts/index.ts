import { handleBindingAttr } from 'easy-coding';
import Inicio from './inicio';

// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;

// Enable elements with the atribute clickAndGo to be clicked to open links
handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);

// Run code for proper page
const pages = [
  Inicio
];