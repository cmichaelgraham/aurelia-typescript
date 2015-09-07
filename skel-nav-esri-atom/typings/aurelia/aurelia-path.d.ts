declare module 'aurelia-path' {
  export function relativeToFile(name: string, file: string): string;
  export function join(path1: string, path2: string): string;
  
  /**
  * Generate a query string from an object.
  *
  * @param params Object containing the keys and values to be used.
  * @returns The generated query string, excluding leading '?'.
  */
  export function buildQueryString(params: Object): string;
  
  /**
  * Parse a query string.
  *
  * @param The query string to parse.
  * @returns Object with keys and values mapped from the query string.
  */
  export function parseQueryString(queryString: string): Object;
}