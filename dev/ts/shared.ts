import { Type } from 'easy-coding/lib/types';

const Shared = <T extends Type>(type: T): T => {
  new type();
  return type;
}

export default Shared;