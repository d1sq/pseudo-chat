import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(request);
};
