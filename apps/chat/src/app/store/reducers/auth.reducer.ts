import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../interfaces/auth.interfaces';
import * as AuthActions from '../actions/auth.actions';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  error: null,
  isLoading: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    isLoading: false,
    user,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(AuthActions.logout, () => ({
    ...initialState,
    token: null,
  }))
);
