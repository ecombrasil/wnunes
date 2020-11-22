import Page from './page';

@Page('/criar-conta')
export default class CriarContaPage {
  constructor() {
    this.toggleUFSelectMenu();
  }

  private toggleUFSelectMenu() {
    const checkBox = document.querySelector('[name=is_pessoa_juridica]') as HTMLInputElement;
    const UFMenu = document.querySelector('.uf-wrapper') as HTMLElement;

    checkBox.addEventListener('change', () =>
      UFMenu.style.display = checkBox.checked ? 'inline-block' : 'none'
    );
  }
}