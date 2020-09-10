import { Type } from 'easy-coding/lib/types';

const Main = <T extends Type>(type: T): T => {
  // Create instance
  new type();
  
  // Dispatch event
  const event = new Event('mainComponentLoaded');
  window.dispatchEvent(event);

  return type;
}

export default Main;