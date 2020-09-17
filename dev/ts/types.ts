/**
 * Partial object
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Default JSON response for errors on the request
 */
export interface APIErrorResponse {
  data: {
    message: string;
  };
}