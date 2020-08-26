import { handleBindingAttr } from './utils';

document.body.ondragstart = () => false;

handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);