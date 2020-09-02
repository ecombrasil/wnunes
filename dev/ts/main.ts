import { Type } from 'easy-coding/lib/types';

const Main = <T extends Type>(type: T): T => {
  new type();
  window.dispatchEvent(new Event('mainComponentLoaded'));

  return type;
}

export default Main;