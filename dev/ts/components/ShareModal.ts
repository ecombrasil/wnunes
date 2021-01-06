import Page from '../page';

@Page('*')
export default class ShareModal {
  #component = document.querySelector('#share-modal');
  
  #copyLinkButton = document.querySelector('#copy-link') as HTMLElement;
  #doingCopyStuff = false;

  constructor() {
    this.#component && this.addListeners();
  }

  private addListeners(): void {
    this.#copyLinkButton.addEventListener('click', () => this.copyLink());
  }

  private copyLink(): void {
    if (!this.#doingCopyStuff) {
      this.#doingCopyStuff = true;

      const button = this.#copyLinkButton;
      const link = button.textContent;

      navigator.clipboard.writeText(link);
      button.style.textTransform = 'uppercase';
      button.textContent = 'Link copiado!';
  
      setTimeout(() => {
        button.style.textTransform = 'none';
        button.textContent = link;
  
        this.#doingCopyStuff = false;
      }, 3000);
    }
  }
}
