import { createElement } from 'easy-coding';
import Page from './page';

@Page('/montar-kit/filas')
export default class MontarKitFilasPage {
  constructor() {
    this.addListeners();
  }

  /**
   * Adds the proper event listeners to the document.
   */
  private addListeners(): void {
    this.addRowField();
    this.submitForm();
  }

  /**
   * Adds the proper listeners for adding a new row field to the view and for
   * deleting it too.
   */
  private addRowField(): void {
    document.addEventListener('DOMContentLoaded', () => this.createRowField());
    document.querySelector('#add-fila-btn')?.addEventListener('click', () => this.createRowField());
  }

  /**
   * Creates a new row field.
   */
  private createRowField(): void {
    const element = createElement('div', {
      classes: ['form-field', 'fila-field'],
      content: `
        <div class="fila-drawning"></div>
        <div class="fila-options">
          <div class="wrapper">
            <div class="fila-input-wrapper">
              <label>Quantidade de placas:</label>
              <input type="number" value="1" name="qntd_placas">
            </div>
            <div class="fila-input-wrapper">
              <label>Orientação:</label>
              <select name="orientacao" class="select-field">
                <option value="P" selected>Paisagem</option>
                <option value="R">Retrato</option>
              </select>
            </div>
          </div>
        </div>
        <div class="fila-actions">
          <div class="action-delete" title="Remover fila">
            <img src="/static/img/red-trash.png" alt="Remover fila" class="delete-icon">
          </div>
        </div>
      `,
      childOf: document.querySelector('.fields-wrapper')
    });

    const deleteBtn = element.querySelector('.action-delete');
    deleteBtn.addEventListener('click', () => element.remove());
  }

  /**
   * Adds the proper listener for concating previous and current forms into
   * a JSON string and submitting the form when user clicks its submit button.
   */
  private submitForm(): void {
    const submitBtn = document.querySelector('.primary-btn');

    submitBtn.addEventListener('click', () => {
      const previousData = JSON.parse(
        document.querySelector('#previous-data').textContent
      );
      const rowFields = [...document.querySelectorAll('.fila-field')];
      const data = {
        filas: rowFields.map((row) => ({
          qntd_placas: +(row.querySelector('[name="qntd_placas"]') as HTMLInputElement).value,
          orientacao: (row.querySelector('[name="orientacao"]') as HTMLInputElement).value
        })),
        ...previousData
      };
      const form = document.querySelector('#montar-kit-form') as HTMLFormElement;
      const dataField = form.querySelector('[name="data"]') as HTMLInputElement;

      dataField.value = JSON.stringify(data);
      console.log(data);
      //form.submit();
    })
  }
}
