/**
 * Redux Barrel Export
 * Central export for Redux store and slices
 */

export { default as store } from './store';
export type { RootState, AppDispatch } from './store';

// Export all slices
export * from './slices';
