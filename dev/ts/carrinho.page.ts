import Page from './page';
import { Service } from 'http-service-ts';
import { ItemCarrinho } from './models';
import { Cookies } from 'easy-coding';
import { APIErrorResponse } from './types';

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

  private addListeners(): void {
    this.enableItemsControls();
  }

  private enableItemsControls(): void {
    // List of elements the represent cart items
    const itemsAsElements = document.querySelectorAll('.cart-item');

    // Iterate each element to add its proper listeners
    itemsAsElements.forEach(element => {
      const [ removeBtn, addBtn, deleteBtn ] = element.getElementsByClassName('cart-item-option-btn');
      const errorMessage = element.querySelector('.cart-item-error-message') as HTMLElement;
      const qntdElement = element.querySelector('.cart-item-qntd');
      const qntd = Number(qntdElement.textContent.split(' ')[0]);
      const id = Number(element.id);

      const errorHandler = (message: string) => {
        // Display error message
        errorMessage.textContent = message;
        errorMessage.style.visibility = 'visible';
      };

      const patchSuccessHandler = (partial: Partial<ItemCarrinho>) => {
        // Display new quantity
        qntdElement.textContent = String(partial.qntd) + ' unidade';
        if (partial.qntd > 1) qntdElement.textContent += 's';
        // Remove previous error message
        errorMessage.style.visibility = 'invisible';
      };

      // Action when user clicks to remove an unity
      removeBtn.addEventListener('click', () =>
        this.#carrinhoService.patch({ qntd: qntd - 1}, id)
          .then(
            (partial) => patchSuccessHandler(partial),
            (error: APIErrorResponse) => errorHandler(error.data.message)
          )
      );

      // Action when user clicks to add an unity
      addBtn.addEventListener('click', () => 
        this.#carrinhoService.patch({ qntd: qntd + 1}, id)
          .then(
            (partial) => patchSuccessHandler(partial),
            (error: APIErrorResponse) => errorHandler(error.data.message)
          )
      );

      // Action when user clicks to delete the item
      deleteBtn.addEventListener('click', () =>
        this.#carrinhoService.delete(id)
          .then(
            (sucess) => element.remove(),
            (error) => errorHandler('Houve um error ao tentar excluir este item.')
          )
      );
    });
  }
}