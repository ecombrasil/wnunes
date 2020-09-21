import Page from './page';

@Page(['/produto/*', '/kit/*'], {
  globalInstance: true
})
export default class ProdutoPage {
  #title: string;
  
  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value;
    this.createTitle();
  }

  private createTitle(): void {
    const words = this.title.split(' ');

    console.log(this.title, words);
  }
}