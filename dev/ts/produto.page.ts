import Page from './page';

@Page(['/produto/*', '/kit/*'], {
  globalInstance: true
})
export default class ProdutoPage {
  #title: string;

  constructor() {
    this.addHelpBoxClickListener();
  }
  
  get title() {
    return this.#title;
  }

  set title(value) {
    this.#title = value;
    this.createTitle();
  }

  private createTitle(): void {
    const nameElement = document.querySelector('.product-name');
    const words = this.title.split(' ');
    let properClass = 'title-size-';
    
    if (words.length <= 3) properClass += 1; 
    else if (words.length === 4) properClass += 2;
    else properClass += 3;

    nameElement.classList.add(properClass);

    if (words.length === 1) nameElement.innerHTML = `<span class="title-first-line">${words[0]}</span>`;
    else {
      const half = Math.floor(words.length / 2);

      nameElement.innerHTML = `
        <span class="title-first-line">${words.slice(0, half).join(' ')}</span><br>
        ${words.slice(half).join(' ')}
      `;
    }
  }

  private addHelpBoxClickListener(): void {
    const helpBox = document.querySelector('.help-box');
    const footer = document.querySelector('#footer');
    let underEffect = false;

    helpBox.addEventListener('click', () => {
      if (!underEffect) {
        underEffect = true;
        footer.classList.add('highlight');

        setTimeout(() => {
          footer.classList.remove('highlight');
          underEffect = false;
        }, 1500);
      }
    });
  }
}