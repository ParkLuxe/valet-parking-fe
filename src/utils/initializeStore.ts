/**
 * Initialize Redux store
 * Now that we use TanStack Query for data fetching,
 * this function is simplified to just return without doing anything
 */

import type {  AppDispatch  } from '../redux';

export const initializeStore = (_dispatch: AppDispatch): void => {
  // Data initialization is now handled by TanStack Query
  // This function is kept for backward compatibility but does nothing
  return;
};
