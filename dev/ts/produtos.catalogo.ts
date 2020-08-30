import Page from './page';
import Catalogo from './catalogo';
import { Produto } from './models';
import { createElement } from 'easy-coding';

@Page('/catalogo/produtos', {
  globalInstance: true
})
export default class ProdutosCatalogo extends Catalogo<Produto> {
  constructor() {
    super();
  }

  renderElement(item: Produto): void {
    createElement('div', {
      content: ``,
      classes: ['catalog-item'],
      childOf: this.parentElement
    });
  }
}