import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../interfaces/auth.interfaces';
import { authFeatureKey } from '../reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);
