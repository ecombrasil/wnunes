import Page from './page';
import { replaceLast } from './utils';

@Page('/kit/*')
export default class KitPage {
  constructor() {
    this.fixDescription();
  }

  private fixDescription() {
    const descriptionElements = document.getElementsByClassName('product-description');

    if (descriptionElements.length > 1) {
      const last = descriptionElements[1];
      last.innerHTML = replaceLast(',', '.', last.innerHTML);
    }
  }
}