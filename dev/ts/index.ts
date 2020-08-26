import { handleBindingAttr } from './utils';

// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;

// Enable elements with the atribute clickAndGo to be clicked to open links
handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);