import Page from './page';
import Catalogo from './catalogo';
import Model, { Produto } from './models';
import { createElement, randomNumberBetween } from 'easy-coding';

@Page('/catalogo/produtos', {
  globalInstance: true
})
export default class ProdutosCatalogo extends Catalogo<Produto> {
  private readonly storageRoot = 'https://wnunes.s3.sa-east-1.amazonaws.com/';

  renderElement(item: Model<Produto>): void {
    const imgUrl = item.fields.foto ?
      this.storageRoot.concat(item.fields.foto) : '/static/img/loading-img.svg';
    
    const element = createElement('div', {
      content: `
        <img src="${imgUrl}" alt="Imagem do produto ${item.fields.nome}" class="item-img">
        <div class="stars-group"></div>
        <h3 class="item-name">${item.fields.nome}</h3>
        <p class="item-description">${item.fields.descricao}</p>
      `,
      classes: ['catalog-item'],
      childOf: this.parentElement
    });

    /* Temporarily code (just for tests) */
    const n = randomNumberBetween(1, 5);
    
    for (let i = 0; i < n; i++) {
      const star = createElement('img', {
        classes: ['star'],
        childOf: element.querySelector('.stars-group')
      });
      star.setAttribute('alt', 'Ilustração de estrela, utilizada na classicação do produto pelo usuário');
      star.setAttribute('src', '/static/img/star.svg');
    }
    /* --- */
  }
}