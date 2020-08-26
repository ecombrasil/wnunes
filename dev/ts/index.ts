import { handleBindingAttr } from './utils';

// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;

window.addEventListener('load', () => {
  const headerElement = document.querySelector('#header');
  const mainElement = document.querySelector('main');

  // Add shadows to the header after scrolling more than 70 pixels
  mainElement.addEventListener('scroll', () =>
    headerElement.classList.toggle('shaded-header', mainElement.scrollTop > 70
  ));
});

// Enable elements with the atribute clickAndGo to be clicked to open links
handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);