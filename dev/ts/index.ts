import Shared from './shared';
import { Type } from 'easy-coding/lib/types';
import { handleBindingAttr } from 'easy-coding';
import Inicio from './inicio';
import catalogos from './catalogos';

@Shared
class App {
  declarations: Type[] = [
    Inicio,
    ...catalogos
  ];

  constructor() {
    this.addListeners();
  }

  private addListeners(): void {
    // Avoid images from getting arrested by the user
    document.body.ondragstart = () => false;

    // Enable elements with the atribute clickAndGo to open links by clicking them
    handleBindingAttr('clickAndGo', (element, value) =>
      element.addEventListener('click', () => window.location.href = value)
    );
  }
}