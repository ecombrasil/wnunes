import { Type } from './types';

const Page = (route: string | string[]) => (type: Type): Type => {
  if (Array.isArray(route))
    for (const r of route) {
      if (window.location.pathname === r) {
        new type();
        break;
      }
    }
  else if (window.location.pathname === route) new type();
  return type;
};

export default Page;