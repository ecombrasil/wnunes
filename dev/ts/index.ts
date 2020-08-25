import { addBindingAttr } from './utils';

addBindingAttr('clickAndGo', 'click', (attr) => window.location.href = attr);