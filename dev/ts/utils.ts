/**
 * Replace the last ocurrence of a string inside another one.
 * @param find {string} String to be replaced
 * @param replace {string} String to be placed
 * @param string {string} String where the replacement will be done
 * @returns {string} The given string after the replacement.
 */
export function replaceLast(find: string, replace: string, string: string): string {
  const lastIndex = string.lastIndexOf(find);
  
  if (lastIndex === -1) return string;
  
  const beginString = string.substring(0, lastIndex);
  const endString = string.substring(lastIndex + find.length);
  
  return beginString + replace + endString;
}