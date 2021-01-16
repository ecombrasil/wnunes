import { Type } from 'easy-coding/lib/types';
import { handleBindingAttr } from 'easy-coding';

import Main from './main';
import Modal from './Modal';

import InicioPage from './inicio.page';
import CatalogoPage from './catalogo.page';
import CarrinhoPage from './carrinho.page';
import ProdutoPage from './produto.page';
import KitPage from './kit.page';
import CriarContaPage from './criar-conta.page';

import ShareModal from './components/ShareModal';
import Footer from './components/Footer';

@Main
class App {
  pages: Type[] = [
    InicioPage,
    CatalogoPage,
    ProdutoPage,
    KitPage,
    CarrinhoPage,
    CriarContaPage
  ];

  components: Type[] = [
    ShareModal,
    Footer
  ];

  constructor() {
    this.addListeners();
  }

  private addListeners(): void {
    /*
      Avoid images from getting dragged by the user.
    */
    document.body.ondragstart = () => false;

    /*
      Enable elements with the attribute "clickAndGo" to open links by clicking them.
    */
    handleBindingAttr('clickAndGo', (element, url) =>
      element.addEventListener('click', () => window.location.href = url)
    );

    /*
      Enable elements with the attribute "clickAndGoBlank" to open links in a new tab
      by clicking them.
    */
    handleBindingAttr('clickAndGoBlank', (element, url) =>
      element.addEventListener('click', () => window.open(url, '_blank'))
    );

    /**
     * Initialize all modal instances set in the DOM.
     */
    Modal.initAll({ root: 'main' });
  }
}
