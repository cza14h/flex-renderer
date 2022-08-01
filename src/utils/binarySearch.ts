


export function binarySearch(sortedArr: number[], val: number) {
  let minIndex = 0,
    maxIndex = sortedArr.length;

  while (minIndex < maxIndex) {
    const mid = (minIndex + maxIndex) >>> 1; // right shift avoid decimal
    if (sortedArr[mid] < val) minIndex = mid + 1;
    else maxIndex = mid;
  }
  return minIndex;
}