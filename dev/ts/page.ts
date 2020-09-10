import { Type } from 'easy-coding/lib/types';

interface PageOptions {
  globalInstance?: true;
  startAnytime?: true;
}

const Page = (route: string | string[], options?: PageOptions) => <T extends Type>(type: T): T => {
  const path = window.location.pathname;
  let properRoute: string;

  /**
   * Check if the route is the same as the current location
   * @param str {string} Route
   */
  const checkRoute = (str: string): boolean => {
    if (str.endsWith('*')) {
      str = str.slice(0, -1);
      return path.startsWith(str);
    } else return path === str;
  };

  // Check each route if `route` argument is array
  if (Array.isArray(route))
    for (const r of route) {
      if (checkRoute(r)) {
        properRoute = r;
        break;
      }
    }
  // Check route if `route` is a single string
  else if (checkRoute(route)) properRoute = route;
  
  // Create new `type` instance if the provided route matches
  // the current location
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