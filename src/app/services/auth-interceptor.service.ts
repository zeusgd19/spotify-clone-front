import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpotifyApiService } from './spotify-api.service';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const spotifyApiService = inject(SpotifyApiService);
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    // Usuario no logueado → no interceptar, continuar normal
    return next(req);
  }
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return spotifyApiService.refreshToken().pipe(
          switchMap(res => {
            localStorage.setItem('jwt_token', res.token);
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.token}`
              }
            });
            return next(retryReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
