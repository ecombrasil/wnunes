import { handleBindingAttr } from 'easy-coding';

// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;

// Enable elements with the atribute clickAndGo to be clicked to open links
handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);

// Slider
const initSlider = () => {
  const slider = document.getElementById('customers-slider');
  const controllers = document.getElementsByClassName('slider-btn-controller');

  const animate = (direction: 'left' | 'center' | 'right', btn?: HTMLElement) => {
    switch(direction) {
      case 'left':
        slider.scrollLeft = 0;
        break;
      case 'center':
        slider.scrollLeft = (slider.scrollWidth - slider.clientWidth) / 2;
        break;
      case 'right':
        slider.scrollLeft = slider.scrollWidth;
        break;
    }

    if (btn)
      for (const c of controllers)
        c.classList.toggle('active-slider-controller', c === btn);
  };

  controllers[0].addEventListener('click', (e) => animate('left', e.target as HTMLElement));
  controllers[1].addEventListener('click', (e) => animate('center', e.target as HTMLElement));
  controllers[2].addEventListener('click', (e) => animate('right', e.target as HTMLElement));

  animate('center');
};

document.addEventListener('DOMContentLoaded', initSlider);

// Adjust slides for mobile
const setSlidesSize = () => {
  const slides = [...document.querySelectorAll('.customer-box')] as HTMLElement[];
  const windowWidth = window.innerWidth;

  if (windowWidth <= 600)
    slides.forEach(el => el.style.height = el.clientWidth + 'px');
  else if (windowWidth <= 1366)
    slides.forEach(el => el.style.height = '22em');
  else
    slides.forEach(el => el.style.height = '25em');
}

document.addEventListener('DOMContentLoaded', setSlidesSize);
window.addEventListener('resize', setSlidesSize);