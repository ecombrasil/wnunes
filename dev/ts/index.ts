import { handleBindingAttr } from 'easy-coding';

// Avoid images from getting arrested by the user
document.body.ondragstart = () => false;

// Enable elements with the atribute clickAndGo to be clicked to open links
handleBindingAttr('clickAndGo', (element, value) =>
  element.addEventListener('click', () => window.location.href = value)
);

// Slider

const slider = document.getElementById('customers-slider');

const initSlider = () => {
  const getCenter = () => (slider.scrollWidth - slider.clientWidth) / 2;
  const [ leftBtn, centerBtn, rightBtn ] = document.getElementsByClassName('slider-btn-controller');

  leftBtn.addEventListener('click', () => slider.scrollLeft = 0);
  centerBtn.addEventListener('click', () => slider.scrollLeft = getCenter());
  rightBtn.addEventListener('click', () => slider.scrollLeft = slider.scrollWidth);

  slider.scrollLeft = getCenter();
};

window.addEventListener('load', initSlider);