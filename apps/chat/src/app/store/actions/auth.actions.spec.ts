import * as fromActions from './auth.actions';
import { LoginCredentials, User } from '../../interfaces/auth.interfaces';

describe('Auth Actions', () => {
  it('should create login action with credentials', () => {
    const credentials: LoginCredentials = {
      username: 'testuser',
      password: 'password',
    };
    const action = fromActions.login({ credentials });

    expect(action.type).toBe('[Auth] Login');
    expect(action.credentials).toEqual(credentials);
  });

  it('should create loginSuccess action with user data', () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };
    const action = fromActions.loginSuccess({ user });

    expect(action.type).toBe('[Auth] Login Success');
    expect(action.user).toEqual(user);
  });

  it('should create loginFailure action with error message', () => {
    const error = 'Invalid credentials';
    const action = fromActions.loginFailure({ error });

    expect(action.type).toBe('[Auth] Login Failure');
    expect(action.error).toBe(error);
  });

  it('should create logout action without parameters', () => {
    const action = fromActions.logout();

    expect(action.type).toBe('[Auth] Logout');
  });
});
