/**
 * Returns an array with only unique values
 * @param array The input array with potentially duplicate values
 * @returns A new array containing only unique values
 */
export function getUniqueValues<T>(array: T[]): T[] {
  return [...new Set(array)];
}
