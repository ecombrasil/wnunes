import { Type } from 'easy-coding/lib/types';
import { handleBindingAttr } from 'easy-coding';

import Main from './main';
import InicioPage from './inicio.page';
import CatalogoPage from './catalogo.page';
import ProdutoPage from './produto.page';

@Main
class App {
  declarations: Type[] = [
    InicioPage,
    CatalogoPage,
    ProdutoPage,
  ];

  constructor() {
    this.addListeners();
  }

  private addListeners(): void {
    // Avoid images from getting dragged by the user
    document.body.ondragstart = () => false;

    // Enable elements with the atribute clickAndGo to open links by clicking them
    handleBindingAttr('clickAndGo', (element, value) =>
      element.addEventListener('click', () => window.location.href = value)
    );
  }
}