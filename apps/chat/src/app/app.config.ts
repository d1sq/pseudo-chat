import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer, authFeatureKey } from './store/reducers/auth.reducer';
import { chatReducer, chatFeatureKey } from './store/reducers/chat.reducer';
import { AuthEffects } from './store/effects/auth.effects';
import { ChatEffects } from './store/effects/chat.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideRouter(routes),
    provideStore({
      [authFeatureKey]: authReducer,
      [chatFeatureKey]: chatReducer,
    }),
    provideEffects([AuthEffects, ChatEffects]),
    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: true,
      traceLimit: 25,
      connectInZone: true,
      name: 'Chat App Store',
    }),
    provideAnimations(),
  ],
};
