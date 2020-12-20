import { Type } from 'easy-coding/lib/types';
import { handleBindingAttr } from 'easy-coding';

import Main from './main';
import InicioPage from './inicio.page';
import CatalogoPage from './catalogo.page';
import CarrinhoPage from './carrinho.page';
import ProdutoPage from './produto.page';
import KitPage from './kit.page';
import CriarContaPage from './criar-conta.page';
import MontarKitPage from './montar-kit';

@Main
class App {
  pages: Type[] = [
    InicioPage,
    CatalogoPage,
    ProdutoPage,
    KitPage,
    MontarKitPage,
    CarrinhoPage,
    CriarContaPage
  ];

  constructor() {
    this.addListeners();
  }

  private addListeners(): void {
    // Avoid images from getting dragged by the user
    document.body.ondragstart = () => false;

    // Enable elements with the attribute clickAndGo to open links by clicking them
    handleBindingAttr('clickAndGo', (element, value) =>
      element.addEventListener('click', () => window.location.href = value)
    );
  }
}