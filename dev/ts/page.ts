import { Type } from './types';

const Page = (route: string) => (type: Type): Type => {
  if (window.location.pathname === route) new type();
  return type;
};

export default Page;