import Page from './page';

@Page('/montar-kit')
export default class MontarKitPage {
  constructor() {
    this.addListeners();
  }

  /**
   * Adds the proper event listeners to the document.
   */
  private addListeners(): void {
    this.toggleDistanceField();
    this.sendForm();
  }

  /**
   * Toggles the display of an element.
   * 
   * @param {HTMLElement} element Element to be toggled.
   * @param {boolean} boolean Optional boolean used to force the element to be displayed.
   * @param {string} displayAs Display type. Can be anyone of the acceptable values for the
   * CSS property `display` (except for `"none"`).
   */
  private toggleElement(element: HTMLElement, boolean: boolean = true, displayAs = 'block'): void {
    element.style.display = boolean ? displayAs : 'none';
  }

  /**
   * Adds the proper listener for toggling the distance between achorages field
   * according to the roof type chosen by the user.
   */
  private toggleDistanceField(): void {
    const inputTelhado = document.querySelector('#telhado') as HTMLSelectElement;
    const fieldDistanciaAncoragens = document.querySelector('#distancia-ancoragens-field') as HTMLElement;

    inputTelhado?.addEventListener('change', () => {
      const isMiniTrilho = ['T5', 'T6'].includes(inputTelhado.value);
      this.toggleElement(fieldDistanciaAncoragens, isMiniTrilho);
    });
  }

  /**
   * Adds the proper listener for sending the form after clicking its submit button.
   */
  private sendForm(): void {
    const form = document.querySelector('#montar-kit-form') as HTMLFormElement;
    const submitBtn = document.querySelector('.primary-btn');

    submitBtn.addEventListener('click', () => form.submit());
  }
}
