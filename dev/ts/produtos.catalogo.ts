import Page from './page';
import Catalogo from './catalogo';
import Model, { Produto } from './models';
import { createElement } from 'easy-coding';

@Page('/catalogo/produtos', {
  globalInstance: true
})
export default class ProdutosCatalogo extends Catalogo<Model<Produto>> {
  constructor() {
    super();
  }

  renderElement(item: Model<Produto>): void {
    createElement('div', {
      content: ``,
      classes: ['catalog-item'],
      childOf: this.parentElement
    });
  }
}