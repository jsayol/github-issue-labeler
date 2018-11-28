/**
 * Implements a Fisher–Yates shuffling algorithm to shuffle
 * in place a set of arrays, while also maintaining the same order
 * between all the given arrays.
 */
export function shuffleArrays(arrays: any[][]): any[][] {
  let currentIndex = arrays[0].length;
  let randomIndex;
  let tempValue;

  // While there are still elements to shuffle in the arrays
  while (currentIndex !== 0) {
    // Pick one of the remaining positions at random
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // Swap the elements at that position with the current ones
    for (const array of arrays) {
      tempValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = tempValue;
    }
  }

  return arrays;
}
