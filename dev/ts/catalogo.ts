import Page from './page';
import Model, { Produto, Kit } from './models';
import { createElement, randomNumberBetween } from 'easy-coding';

@Page(['/catalogo/produtos', 'catalogo/kits'], {
  globalInstance: true
})
export default class Catalogo {
  #items: Model<Produto | Kit>[] = [];
  #pages: Model<Produto | Kit>[][] = [];
  #currentPage = 0;

  private readonly storageRoot = 'https://wnunes.s3.sa-east-1.amazonaws.com/';

  protected parentElement = document.getElementById('catalog-wrapper');
  protected loadMoreBtn = document.querySelector('.load-more-btn') as HTMLElement;
  protected orderingSelect = document.querySelector('.ordering-btn') as HTMLSelectElement;

  constructor() {
    this.addListeners();
    this.setActiveSection();
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

    while (availableItems.length > 0)
      this.pages.push(availableItems.splice(0, itemsPerPage));

    this.currentPage = 0;
  }

  private toggleLoadMoreBtn(show: boolean): void {
    this.loadMoreBtn.style.display = show ? 'block' : 'none';
  }

  private nextPage(): void {
    if (this.currentPage < this.pages.length - 1) this.currentPage++;
  }

  private sortItems(): void {
    const by = this.orderingSelect.value as '+recentes' | '-recentes';

    by === '+recentes' ?
      this.items.sort((a, b) => b.pk - a.pk) :
      this.items.sort((a, b) => a.pk - b.pk)
  };

  private renderElement(item: Model<Produto | Kit>): void {
    const imgUrl = item.fields.foto ?
      this.storageRoot.concat(item.fields.foto) : '/static/img/loading-img.svg';
    
    const element = createElement('div', {
      content: `
        <img src="${imgUrl}" alt="Imagem do produto ${item.fields.nome}" class="item-img">
        <div class="stars-group"></div>
        <h3 class="item-name">${item.fields.nome}</h3>
        <p class="item-description">${item.fields.descricao}</p>
      `,
      classes: ['catalog-item'],
      childOf: this.parentElement
    });

    /* Temporarily code (just for tests) */
    const n = randomNumberBetween(1, 5);
    
    for (let i = 0; i < n; i++) {
      const star = createElement('img', {
        classes: ['star'],
        childOf: element.querySelector('.stars-group')
      });
      star.setAttribute('alt', 'Ilustração de estrela, utilizada na classicação do produto pelo usuário');
      star.setAttribute('src', '/static/img/star.svg');
    }
  }

  private setActiveSection(): void {
    const availableSections = document.querySelector('.page-header')?.querySelectorAll('a');
    const path = window.location.pathname;

    availableSections?.forEach(a => {
      if (a.href === path) {
        const p = a.querySelector('.pg-header-option');
        p?.classList.add('active-pg-option');
      }
    });
  }
}