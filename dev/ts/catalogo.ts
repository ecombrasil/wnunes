import Page from './page';

@Page('/catalogo', {
  globalInstance: true
})
export default class Catalogo {
  listItems: HTMLElement[] = [];

  createLazyLoad(): void { }
}