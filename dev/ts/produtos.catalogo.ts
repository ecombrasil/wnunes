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
    const element = createElement('div', {
      content: `
        <img src="/static/img/sample/image--031.jpg" alt="Sample product image" class="item-img">
        <div class="stars-group"></div>
        <h3 class="item-name">${item.fields.nome}</h3>
        <p class="item-description">${item.fields.descricao}</p>
      `,
      classes: ['catalog-item'],
      childOf: this.parentElement
    });

    for (let i = 0; i < 5; i++) {
      const star = createElement('img', {
        classes: ['star'],
        childOf: element.querySelector('.stars-group')
      });
      star.setAttribute('alt', 'Ilustração de estrela, utilizada na classicação do produto pelo usuário');
      star.setAttribute('src', '/static/img/star.svg');
    }
  }
}