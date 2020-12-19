import { createElement } from 'easy-coding';
import Page from './page';

@Page('/montar-kit*')
export default class MontarKitPage {
  constructor() {
    this.addListeners();
  }

  private addListeners() {
    this.toggleDistanciaAncoragens();
    this.addFilaField();
  }

  private toggleElement(element: HTMLElement, boolean: boolean = true, displayAs = 'block') {
    element.style.display = boolean ? displayAs : 'none';
  }

  private toggleDistanciaAncoragens() {
    const inputTelhado = document.querySelector('#telhado') as HTMLSelectElement;
    const fieldDistanciaAncoragens = document.querySelector('#distancia-ancoragens-field') as HTMLElement;

    inputTelhado?.addEventListener('change', () => {
      const isMiniTrilho = ['T5', 'T6'].includes(inputTelhado.value);
      this.toggleElement(fieldDistanciaAncoragens, isMiniTrilho);
    });
  }

  private addFilaField() {
    const addFilaBtn = document.querySelector('#add-fila-btn');

    addFilaBtn?.addEventListener('click', () =>
      createElement('div', {
        classes: ['form-field', 'fila-field'],
        content: ``,
        childOf: document.querySelector('.fields-wrapper')
      })
    );
  }
}
