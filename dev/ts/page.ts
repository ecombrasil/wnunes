import { Type } from 'easy-coding/lib/types';

interface PageOptions {
  globalInstance?: true;
  startAnytime?: true;
}

const Page = (route: string | string[], options?: PageOptions) => <T extends Type>(type: T): T => {
  let properRoute: string;

  if (Array.isArray(route))
    for (const r of route) {
      if (window.location.pathname === r) {
        properRoute = r;
        break;
      }
    }
  else if (window.location.pathname === route) properRoute = route;

  if (properRoute) {
    const initialize = () => {
      const instance: InstanceType<T> = new type();

      if (options?.globalInstance) {
        const objectName = type.name.charAt(0).toLowerCase() + type.name.substring(1);
        window[objectName] = instance;
      }
    };
    
    if (options?.startAnytime) initialize();
    else window.addEventListener('mainComponentLoaded', initialize);
  }

  return type;
};

export default Page;