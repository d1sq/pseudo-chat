import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Произошла неизвестная ошибка';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Ошибка: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Неверный запрос';
            break;
          case 401:
            errorMessage = 'Необходима авторизация';
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Доступ запрещен';
            break;
          case 404:
            errorMessage = 'Ресурс не найден';
            break;
          case 500:
            errorMessage = 'Внутренняя ошибка сервера';
            break;
          default:
            errorMessage = `Ошибка ${error.status}: ${
              error.error?.message || error.statusText
            } - ${error.name}`;
        }
      }

      notificationService.error(errorMessage);

      return throwError(() => error);
    })
  );
};
