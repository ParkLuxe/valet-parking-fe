/**
 * Auth Service - Lightweight wrapper around apiHelper
 * For new code, prefer using TanStack Query hooks from ../api/auth
 */

// Deprecated compatibility shim for `authService`.
// Project migrated to TanStack Query hooks in `src/hooks/queries/useAuth.ts`.
// Import the hooks (`useLogin`, `useRegister`, `useProfile`, etc.) instead of calling
// these functions directly. This file remains to provide clearer error messages if
// any old code still imports it.

const deprecated = new Proxy({}, {
  get() {
    return () => {
      throw new Error('authService is deprecated. Use hooks from src/hooks/queries/useAuth.ts instead.');
    };
  }
});

const authService = deprecated as any;
export default authService;
