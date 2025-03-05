import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { User } from '../../interfaces/auth.interfaces';

describe('AuthEffects', () => {
  let actions$: Observable<Action>;
  let effects: AuthEffects;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  const testUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    const authServiceSpy = {
      login: jest.fn(),
      logout: jest.fn(),
      saveToken: jest.fn(),
      saveUser: jest.fn(),
    };
    const routerSpy = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should call loginSuccess on successful login', (done) => {
    const credentials = { username: 'testuser', password: 'password' };
    const action = AuthActions.login({ credentials });
    const response = {
      user: testUser,
      access_token: 'test-token',
    };

    authService.login.mockReturnValue(of(response));

    actions$ = of(action);

    effects.login$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        AuthActions.loginSuccess({ user: testUser })
      );
      expect(authService.login).toHaveBeenCalledWith(credentials);
      expect(authService.saveToken).toHaveBeenCalledWith('test-token');
      expect(authService.saveUser).toHaveBeenCalledWith(testUser);
      done();
    });
  });

  it('should call loginFailure on login error', (done) => {
    const credentials = { username: 'testuser', password: 'password' };
    const action = AuthActions.login({ credentials });
    const errorResponse = {
      error: {
        message: 'Invalid credentials',
      },
    };

    authService.login.mockReturnValue(throwError(() => errorResponse));

    actions$ = of(action);

    effects.login$.subscribe((resultAction) => {
      expect(resultAction).toEqual(
        AuthActions.loginFailure({ error: 'Invalid credentials' })
      );
      expect(authService.login).toHaveBeenCalledWith(credentials);
      done();
    });
  });

  it('should redirect to home page after successful login', (done) => {
    const action = AuthActions.loginSuccess({ user: testUser });

    actions$ = of(action);

    effects.loginSuccess$.subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('should call logout method in authService', (done) => {
    const action = AuthActions.logout();

    actions$ = of(action);

    effects.logout$.subscribe(() => {
      expect(authService.logout).toHaveBeenCalled();
      done();
    });
  });
});
