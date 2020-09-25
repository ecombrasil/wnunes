import Page from './page';

@Page('/criar-conta')
export default class CriarContaPage {
  constructor() {
    this.toggleUFSelectMenu();
  }

  private toggleUFSelectMenu() {
    const checkBox = document.getElementsByName('is_pessoa_juridica')[0] as HTMLInputElement;
    const UFMenu = document.querySelector('.uf-wrapper') as HTMLElement;

    checkBox.addEventListener('change', () =>
      UFMenu.style.display = checkBox.checked ? 'inline-block' : 'none'
    );
  }
}