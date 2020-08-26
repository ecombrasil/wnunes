import { handleBindingAttr } from './utils';

handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value));