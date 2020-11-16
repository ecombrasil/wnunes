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

    this.enableItemsControls();
  }

  private enableItemsControls(): void {
    // List of elements the represent cart items
    const itemsAsElements = document.querySelectorAll('.cart-item');

    // Iterate each element to add its proper listeners
    itemsAsElements?.forEach(element => {
      const [ removeBtn, addBtn, deleteBtn ] = element.getElementsByClassName('cart-item-option-btn');
      
      const errorMessage = element.querySelector('.cart-item-error-message') as HTMLElement;
      const id = +element.id;

      const errorHandler = (message: string) => {
        // Display error message
        errorMessage.textContent = message;
        errorMessage.style.display = 'flex';
      };

      const patchSuccessHandler = (partial: Partial<ItemCarrinho>) => {
        const newQntd = partial.qntd;

        this.setItemQuantity(element, newQntd);
        this.updateCartPrice();

        // Toggle remove button according to the new quantity
        this.toggleButton(removeBtn as HTMLElement, newQntd > 1);

        // Remove previous error message
        errorMessage.style.display = 'none';
      };

      const userActionHandler = (button: HTMLElement, callback: () => void) => {
        const isEnabled = !button.classList.contains('disabled-item-option');
        
        if (isEnabled) callback();
      };

      // Action when user clicks to remove an unity
      removeBtn.addEventListener('click', () => userActionHandler(removeBtn as HTMLElement, () =>
        this.#carrinhoService.patch({ qntd: this.getItemQuantity(element) - 1}, id)
          .then(
            (partial) => {
              patchSuccessHandler(partial);
              this.toggleButton(addBtn as HTMLElement);
            },
            (error: APIErrorResponse) => errorHandler(error.data.message)
          )
      ));
      
      // Action when user clicks to add an unity
      addBtn.addEventListener('click', () => userActionHandler(addBtn as HTMLElement, () =>
        this.#carrinhoService.patch({ qntd: this.getItemQuantity(element) + 1}, id)
          .then(
            (partial) => patchSuccessHandler(partial),
            (error: APIErrorResponse) => this.toggleButton(addBtn as HTMLElement, false)
          )
      ));

      // Action when user clicks to delete the item
      deleteBtn.addEventListener('click', () =>
        this.#carrinhoService.delete(id)
          .then(
            (success) => window.location.reload(),
            (error) => errorHandler('Houve um erro ao tentar excluir este item.')
          )
      );
    });
  }

  private getItemQuantity(element: Element): number {
    return Number(element.querySelector('.cart-item-qntd').textContent.split(' ')[0]);
  }

  private setItemQuantity(element: Element, qntd: number): void {
    const qntdElement = element.querySelector('.cart-item-qntd');
    qntdElement.textContent = qntd + ' unidade';

    if (qntd > 1) qntdElement.textContent += 's';
  }

  private calcCartPrice(): number {
    const parent = document.querySelector('.cart-wrapper');
    const cartItems = [...parent.querySelectorAll('.cart-item')];

    let totalPrice = 0;

    cartItems.forEach(element => {
      const price = Number(element.querySelector('.cart-item-preco').textContent.split(' ')[1].replace(',', '.'));
      const qntd = Number(element.querySelector('.cart-item-qntd').textContent.split(' ')[0]);

      totalPrice += price * qntd;
    });

    return totalPrice;
  }

  private updateCartPrice(): void {
    const price = String(this.calcCartPrice()).replace('.', ',');
    document.querySelector('#cart-price').textContent = 'R$ ' + price;
  }

  private toggleButton(button: HTMLElement, condition: boolean = true): void {
    !condition ? button.classList.add('disabled-item-option') : button.classList.remove('disabled-item-option');
  }
}