import { Type } from 'easy-coding/lib/types';

/**
 * Automatically creates an instance of the given class and 
 * dispatch an event called `mainComponentLoaded` that is used 
 * to say to other components that they can initialize now
 * @param type {Type} Main class of the application
 */
const Main = <T extends Type>(type: T): T => {
  // Create instance
  new type();
  
  // Dispatch event
  const event = new Event('mainComponentLoaded');
  window.dispatchEvent(event);

  return type;
}

export default Main;