import { authReducer, initialState } from './auth.reducer';
import * as AuthActions from '../actions/auth.actions';
import { AuthState } from '../../interfaces/auth.interfaces';

describe('Auth Reducer', () => {
  const testUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' };
      const state = authReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('login action', () => {
    it('should set isLoading to true and reset error', () => {
      const credentials = { username: 'testuser', password: 'password' };
      const action = AuthActions.login({ credentials });
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginSuccess action', () => {
    it('should set the user and reset loading state and error', () => {
      const action = AuthActions.loginSuccess({ user: testUser });
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(testUser);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure action', () => {
    it('should set the error and reset loading state', () => {
      const error = 'Invalid username or password';
      const action = AuthActions.loginFailure({ error });
      const state = authReducer(initialState, action);

      expect(state.error).toBe(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logout action', () => {
    it('should reset the state to initial and clear the token', () => {
      const loggedInState: AuthState = {
        user: testUser,
        token: 'test-token',
        error: null,
        isLoading: false,
      };

      const action = AuthActions.logout();
      const state = authReducer(loggedInState, action);

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });
  });
});
