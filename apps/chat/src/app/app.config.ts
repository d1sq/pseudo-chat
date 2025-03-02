import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer, authFeatureKey } from './store/reducers/auth.reducer';
import { chatReducer } from './store/reducers/chat.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { ChatEffects } from './store/effects/chat.effects';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      [authFeatureKey]: authReducer,
      chat: chatReducer
    }),
    provideEffects([AuthEffects, ChatEffects]),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};
