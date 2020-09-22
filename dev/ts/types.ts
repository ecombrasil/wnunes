/**
 * Partial object.
 * 
 * @example
 * interface User {
 *   id: number;
 *   firstName: string;
 * }
 * 
 * const partialUser: Partial<User> = { id: 1 };
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Object with keys as numbers.
 * 
 * @example
 * const obj: EnumerableObject = {
 *   0: 'Some text',
 *   1: ['Banana', 'Pineapple'],
 * };
 */
export type EnumerableObject = {
  [key: number]: any;
}

/**
 * Default JSON response for errors on the request.
 */
export interface APIErrorResponse {
  data: {
    message: string;
  };
}