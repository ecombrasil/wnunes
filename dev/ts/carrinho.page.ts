import Page from './page';
import { Service } from 'http-service-ts';
import { ItemCarrinho } from './models';
import { Cookies } from 'easy-coding';

@Page('/carrinho')
export default class CarrinhoPage {
  #carrinhoService: Service<ItemCarrinho>;

  constructor() {
    this.#carrinhoService = new Service<ItemCarrinho>('/api/item-carrinho', {
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken')
      }),
      appendSlash: true
    });

    this.addListeners();
  }

  private addListeners(): void { }
}