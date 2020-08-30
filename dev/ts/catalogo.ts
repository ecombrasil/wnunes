abstract class CatalogoBase<T> {
  #items: T[] = [];
  #pages: T[][] = [];
  #currentPage = 0;
  parentElement = document.getElementById('catalog-wrapper');

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

  get currentPage() {
    return this.#currentPage;
  }

  set currentPage(value) {
    this.#currentPage = value;
    this.pages[value].forEach(this.renderElement);
  }

  protected createPages(itemsPerPage = 24): void {
    let availableItems = [...this.items];

    while (availableItems.length > 0) {
      this.pages.push(availableItems.splice(0, itemsPerPage));
    }

    this.currentPage = 0;
  }

  init(): void {
    this.createPages();
    this.afterInit();
  }

  /**
   * Runs after initialization. Place secondary needs here.
   */
  afterInit(): void { }
  /**
   * Render an element from the `items` list in the DOM
   * @param item {T} Model object
   */
  renderElement(item: T): void { }
}

export default CatalogoBase;