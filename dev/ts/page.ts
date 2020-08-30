import { Type } from 'easy-coding/lib/types';

interface PageOptions {
  globalInstance: true;
}

const Page = (route: string | string[], options?: PageOptions) => <T extends Type>(type: T): T => {
  let instance: InstanceType<T>;

  if (Array.isArray(route))
    for (const r of route) {
      if (window.location.pathname === r) {
        instance = new type();
        break;
      }
    }
  else if (window.location.pathname === route) instance = new type();

  if (instance && options?.globalInstance) {
    const objectName = type.name.charAt(0).toLowerCase() + type.name.substring(1);
    (<any>window)[objectName] = instance;
  }

  return type;
};

export default Page;