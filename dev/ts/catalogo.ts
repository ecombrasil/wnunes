import Model from './models';

type CatalogItem<T> = Model<T & { preco: number }>;

abstract class CatalogoBase<T> {
  #items: CatalogItem<T>[] = [];
  #pages: Model<T>[][] = [];
  #currentPage = 0;

  protected parentElement = document.getElementById('catalog-wrapper');
  protected loadMoreBtn = document.querySelector('.load-more-btn') as HTMLElement;
  protected orderingSelect = document.querySelector('.ordering-btn') as HTMLSelectElement;

  constructor() {
    this.addListeners();
  }

  private addListeners(): void {
    this.loadMoreBtn.addEventListener('click', () => this.nextPage());
    this.orderingSelect.addEventListener('change', () => this.init());
  }

  init(): void {
    this.parentElement.innerHTML = '';
    this.sortItems();
    this.createPages();
  }

  get items() {
    return this.#items;
  }

  set items(value) {
    this.#items = value;
    this.init();
  }

  get pages() {
    return this.#pages;
  }

  set pages(value) {
    this.#pages = value;
  }

  get currentPage() {
    return this.#currentPage;
  }

  set currentPage(value) {
    this.#currentPage = value;
    this.pages[value].forEach(item => this.renderElement(item));
    this.toggleLoadMoreBtn(!(this.currentPage === this.pages.length - 1));
  }

  private createPages(itemsPerPage = 24): void {
    this.pages = [];
    let availableItems = [...this.items];

    while (availableItems.length > 0) {
      this.pages.push(availableItems.splice(0, itemsPerPage));
    }

    this.currentPage = 0;
  }

  private toggleLoadMoreBtn(show: boolean): void {
    this.loadMoreBtn.style.display = show ? 'block' : 'none';
  }

  private nextPage(): void {
    if (this.currentPage < this.pages.length - 1) this.currentPage++;
  }

  private sortItems(): void {
    const by = this.orderingSelect.value as '-preco' | '+preco' | '+recentes';

    switch(by) {
      case '+recentes':
        this.items.sort((a, b) => b.pk - a.pk);
        break;
      case '-preco':
        this.items.sort((a, b) => a.fields.preco - b.fields.preco);
        break;
      case '+preco':
        this.items.sort((a, b) => b.fields.preco - a.fields.preco);
        break;
    }
  };

  /**
   * Render an element from the `items` list in the DOM
   * @param item {Model<T>} Model object
   */
  renderElement(item: Model<T>): void { }
}

export default CatalogoBase;