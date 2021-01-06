import { createElement } from 'easy-coding';
import { uniqueId } from './utils';

/**
 * Interface for the options available on the Modal's class constructor.
 */
interface ModalInit {
  /**
   * Element in which the click event will open the modal.
   */
  trigger?: HTMLElement;
  /**
   * Modal element.
   */
  modal: HTMLElement;
  /**
   * Transition time (in milisseconds).
   */
  transition?: number;
  /**
   * Query selector of the main application wrapper. Default is the documents's body.
   */
  root?: string;
  /**
   * Event in which the modal must be toggled.
   */
  event?: string;
  /**
   * Event's target. Default is `window`.
   */
  eventTarget?: string;
}

/**
 * Enables creating a modal in the DOM using pure HTML or JavaScript code.
 * 
 * @example
 * new Modal({
 *   trigger: document.querySelector('#my-button'),
 *   modal: document.querySelector('#my-modal'),
 *   root: 'main'
 * });
 * 
 * @example
 * new Modal({
 *   modal: document.querySelector('#my-modal'),
 *   event: 'DOMContentLoaded',
 *   eventTarget: 'document'
 * });
 */
export default class Modal {
  /**
   * Modal's HTML element.
   */
  #modal: HTMLElement;

  /**
   * Transition time.
   */
  transition: number = 200;

  /**
   * Main application's element wrapper.
   */
  #root: HTMLElement;

  constructor({ trigger, modal, transition, root, event, eventTarget }: ModalInit) {
    this.#modal = modal;
    this.#root = document.querySelector(root) ?? document.body;

    if (transition !== null) this.transition = transition;

    this.stylize();
    this.addListeners({ trigger, event, eventTarget });
  }

  /**
   * Merge default modal styles with its inline CSS.
   */
  private stylize() {
    const customStyle = this.#modal.style.cssText;
    const defaultStyle = {
      position: 'fixed',
      zIndex: '9999',
      top: '0',
      left: '0',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100vh',
      opacity: '0',
      backgroundColor: 'rgba(245, 245, 245, 0.9)'
    };
    
    Object.entries(defaultStyle).forEach(([key, value]) => {
      if (key in this.#modal.style) this.#modal.style[key] = value;
    });

    this.#modal.style.cssText += customStyle;
  }

  /**
   * Add the proper listeners for toggling the modal's display.
   */
  private addListeners({ trigger, event, eventTarget }: Partial<ModalInit>): void {
    /*
      Add a listener for the optional event.
    */
    event && (
      eventTarget ?
        eventTarget === 'document' ? document : document.querySelector(eventTarget) :
        window
      ).addEventListener(event, () => this.toggle());
    
    /*
      Add a click listener for the optional trigger button.
    */
    trigger?.addEventListener('click', () => this.toggle());

    /*
      Add a click listener for closing the modal when it is open.
    */
    this.#modal.addEventListener('click', (e) => {
      if (e.target === this.#modal) this.toggle();
    });
  }

  /**
   * ID of the modal element.
   * 
   * @public
   */
  get id(): string {
    return this.#modal.id;
  }

  /**
   * Toggles the modal's display.
   * 
   * @public
   */
  toggle(): void {
    const mustShow = this.modalDisplay() === 'none';

    mustShow ? this.fadeIn() : this.fadeOut();
    this.#root.style.overflow = mustShow ? 'hidden' : 'auto';
  }

  /**
   * Shows the modal.
   * 
   * @param {number} [time] Animation time in milisseconds.
   */
  private fadeIn(): void {
    let opacity = 0;

    this.modalOpacity(opacity);
    this.modalDisplay('flex');

    const interval = setInterval(() => {
      if (opacity < 1) {
        opacity = opacity + 0.1;
        this.modalOpacity(opacity);
      } else {
        clearInterval(interval);
      }
    }, this.transition / 10);
  }

  /**
   * Hides the modal.
   * 
   * @param {number} [time] Animation time in milisseconds.
   */
  private fadeOut(): void {
    let opacity = 1;

    const interval = setInterval(() => {
      if (opacity > 0) {
        opacity = opacity - 0.1;
        this.modalOpacity(opacity);
      } else {
        this.modalDisplay('none');
        clearInterval(interval);
      }
    }, this.transition / 10);
  }

  /**
   * Getter/setter of the modal's display.
   * 
   * @param {string} [value] New value for the modal's display.
   * 
   * @returns {string}
   */
  private modalDisplay(value?: string): string {
    return value ? this.#modal.style.display = value : this.#modal.style.display;
  }

  /**
   * Getter/setter of the modal's opacity.
   * 
   * @param {number|string} [value] New value for the modal's opacity.
   * 
   * @returns {string}
   */
  private modalOpacity(value?: number|string): string {
    return value ? this.#modal.style.opacity = String(value) : this.#modal.style.opacity;
  }

  /**
   * Searches for every Modal element in the page and starts listening to the
   * events for toggling its display type. Returns all the created instances.
   * 
   * @param {Partial<ModalInit>} [globalSettings] Parameters to be applied at the
   * constructor function of every modal.
   * 
   * @returns {Modal[]} All the created instances.
   * 
   * @static
   */
  static initAll(globalSettings?: Partial<ModalInit>): Modal[] {
    const modals = [...document.querySelectorAll('[data-modal]')] as HTMLElement[];

    return modals.map((modal) =>
      new Modal({ ...this.extractParams(modal), ...globalSettings })
    );
  }

  /**
   * Extract the modal parameters from its attributes in the DOM
   * and return them as an `ModalInit` object.
   * 
   * @param {HTMLElement} modal Modal element in DOM.
   * 
   * @returns {ModalInit} Object with the modal parameters.
   */
  private static extractParams(modal: HTMLElement): ModalInit {
    const trigger = document.querySelector(modal.getAttribute('data-trigger')) as HTMLElement;
    const transition = modal.getAttribute('data-transition') !== null ? +modal.getAttribute('data-transition') : null;
    const event = modal.getAttribute('data-event');
    const root = modal.getAttribute('data-root');
    const eventTarget = modal.getAttribute('data-event-target');

    return { trigger, modal, transition, event, root, eventTarget };
  }
}
