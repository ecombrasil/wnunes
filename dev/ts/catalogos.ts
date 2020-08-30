import Page from './page';
import Model, { Produto } from './models';
import { createElement } from 'easy-coding';
import { Type } from 'easy-coding/lib/types';

abstract class Catalogo<T> {
  items: T[] = [];
  elements: HTMLElement[] = [];
  init(): void { }
}

@Page('/catalogo/produtos', {
  globalInstance: true
})
class CatalogoProdutos extends Catalogo<Produto> {
  constructor() {
    super();
  }
}

const catalogos: Type<Catalogo<Model>>[] = [
  CatalogoProdutos
]
export default catalogos;