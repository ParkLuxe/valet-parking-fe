/**
 * Deprecated tests placeholder for `authService`.
 * The project has migrated to TanStack Query hooks (useAuth). Keep a
 * single smoke test to ensure the deprecated shim throws a helpful error.
 */

import authService from './authService';

describe('authService (deprecated shim)', () => {
  test('deprecated authService methods throw a helpful error', () => {
    expect(() => (authService as any).login()).toThrow('authService is deprecated');
  });
});
