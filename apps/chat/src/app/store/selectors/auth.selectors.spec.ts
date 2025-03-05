import * as fromSelectors from './auth.selectors';
import { AuthState } from '../../interfaces/auth.interfaces';

describe('Auth Selectors', () => {
  const testUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  const initialState: AuthState = {
    user: null,
    token: null,
    error: null,
    isLoading: false,
  };

  describe('selectAuthState', () => {
    it('should select the auth state from AppState', () => {
      const appState = { auth: initialState };
      const result = fromSelectors.selectAuthState(appState);
      expect(result).toEqual(initialState);
    });
  });

  describe('selectAuthError', () => {
    it('should return the authentication error', () => {
      const state: AuthState = {
        ...initialState,
        error: 'Invalid username or password',
      };
      const result = fromSelectors.selectAuthError.projector(state);
      expect(result).toBe('Invalid username or password');
    });

    it('should return null if there is no error', () => {
      const result = fromSelectors.selectAuthError.projector(initialState);
      expect(result).toBeNull();
    });
  });

  describe('selectIsLoading', () => {
    it('should return the loading state', () => {
      const state: AuthState = {
        ...initialState,
        isLoading: true,
      };
      const result = fromSelectors.selectIsLoading.projector(state);
      expect(result).toBe(true);
    });

    it('should return false if not loading', () => {
      const result = fromSelectors.selectIsLoading.projector(initialState);
      expect(result).toBe(false);
    });
  });

  describe('selectCurrentUser', () => {
    it('should return the current user', () => {
      const state: AuthState = {
        ...initialState,
        user: testUser,
      };
      const result = fromSelectors.selectCurrentUser.projector(state);
      expect(result).toEqual(testUser);
    });

    it('should return null if user is not authenticated', () => {
      const result = fromSelectors.selectCurrentUser.projector(initialState);
      expect(result).toBeNull();
    });
  });

  describe('Selector Composition', () => {
    it('all selectors should use the base selectAuthState selector', () => {
      const state: AuthState = {
        user: testUser,
        token: 'test-token',
        error: 'test-error',
        isLoading: true,
      };

      const authState = fromSelectors.selectAuthState({ auth: state });
      const currentUser = fromSelectors.selectCurrentUser.projector(state);
      const error = fromSelectors.selectAuthError.projector(state);
      const isLoading = fromSelectors.selectIsLoading.projector(state);

      expect(authState).toEqual(state);
      expect(currentUser).toEqual(testUser);
      expect(error).toBe('test-error');
      expect(isLoading).toBe(true);
    });
  });
});
