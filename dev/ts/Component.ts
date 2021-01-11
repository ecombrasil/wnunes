import { Type } from 'easy-coding/lib/types';

/**
 * Initializes a class binding its constructor to an element in the DOM.
 * 
 * @param {string} name Component's query selector.
 */
const Component = (name: string) => <T extends Type>(type: T): T => {
  [...document.querySelectorAll(name)].forEach((element) => type.bind(element));

  return type;
}

export default Component;
