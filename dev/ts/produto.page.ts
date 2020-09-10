import Page from './page';

@Page('/produto/*')
export default class ProdutoPage {
  constructor() {
    this.addListeners();
  }

  private addListeners(): void { }
}