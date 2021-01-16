import { Service } from 'http-service-ts';
import Component from '../Component';
import { MensagemSite } from '../models';
import apiConfig from '../services/apiConfig';

enum RequestStatus {
  Default = 'Enviar',
  Unable = 'Algum campo incorreto!',
  Sending = 'Enviando...',
  Success = 'Mensagem enviada!',
  Error = 'Tentar novamente!'
};

@Component('#footer')
export default class Footer {
  /**
   * Service that enables handling requests to the `MensagemSite` API endpoints.
   */
  #messageService: Service<MensagemSite>;

  /**
   * User message form.
   */
  #form: HTMLFormElement;

  /**
   * Boolean that indicates wheter the message is still being sent to the server.
   */
  #isSendingMessage: boolean = false;

  #sendMessageBtn: HTMLElement;
  #messageStatusText: HTMLElement;

  constructor() {
    this.#messageService = new Service<MensagemSite>('/api/mensagem', apiConfig);
    this.#form = document.querySelector('#send-message-form');

    this.#sendMessageBtn  = document.querySelector('#send-message-btn');
    this.#messageStatusText = document.querySelector('#message-form-status-text');
  
    this.#sendMessageBtn.addEventListener('click', () => this.sendMessage());
  }

  get isSendingMessage() {
    return this.#isSendingMessage;
  }

  set isSendingMessage(value) {
    this.#isSendingMessage = value;
    this.#sendMessageBtn.classList.toggle('disabled', value);
    
    value && this.updateFormStatus(RequestStatus.Sending);
  }

  /**
   * If form validity is ok, returns it as a `FormData` object. Otherwise, returns `null`.
   * 
   * @returns {FormData|null} Form data as a `FormData` object or `null` (if something is
   * missing or incorrect).
   */
  private getFormData(): FormData|null {
    return this.#form.checkValidity() ? new FormData(this.#form) : null;
  }

  /**
   * Requests the creation of a new customer message based on the form.
   */
  private sendMessage(): void {
    if (!this.isSendingMessage) {
      const formData = this.getFormData();

      if (formData) {
        this.isSendingMessage = true;
        const messageInstance = Object.fromEntries(formData.entries()) as unknown as MensagemSite;

        this.#messageService.post(messageInstance)
          .then((success) => {
            this.updateFormStatus(RequestStatus.Success)
            this.#form.reset();

            this.updateFormStatus(RequestStatus.Default, 3000);
          })
          .catch((error) => this.updateFormStatus(RequestStatus.Error))
          .finally(() => this.isSendingMessage = false);
      } else {
        this.updateFormStatus(RequestStatus.Unable);
        this.updateFormStatus(RequestStatus.Default, 3000);
      }
    }
  }

  /**
   * Updates the text display corresponding to the message form status.
   * 
   * @param {RequestStatus} status Current message form status.
   * @param {number} [delay] Delay time in milisseconds for changing the status.
   */
  private updateFormStatus(status: RequestStatus, delay: number = 0): void {
    setTimeout(() => this.#messageStatusText.textContent = status, delay);
  }
}
