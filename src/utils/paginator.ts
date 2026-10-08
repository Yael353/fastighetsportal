/**
 * Delar upp en array i mindre batcher baserat på angiven storlek.
 * @param array Arrayen som ska delas upp
 * @param batchSize Max antal element per batch
 * @returns En array av batcher
 */
export const paginateArray = <T>(array: T[], batchSize: number): T[][] => {
  const paginatedArray: T[][] = [];

  for (let i = 0; i < array.length; i += batchSize) {
    paginatedArray.push(array.slice(i, i + batchSize));
  }

  return paginatedArray;
};
