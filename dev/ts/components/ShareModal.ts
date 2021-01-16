import Component from '../Component';

@Component('#share-modal')
export default class ShareModal {
  /**
   * Button for copying the current link.
   */
  #copyLinkButton = document.querySelector('#copy-link') as HTMLElement;

  /**
   * Boolean indicating if the click event callback for the "copy" button
   * is currently running.
   */
  #doingCopyStuff = false;

  constructor() {
    this.#copyLinkButton.addEventListener('click', () => this.copyLink());
  }

  /**
   * Copies the current link.
   */
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
