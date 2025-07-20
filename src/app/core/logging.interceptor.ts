import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (
  //function interceptor not class based so register in app.config or main.ts
  req: HttpRequest<any>,
  next: HttpHandlerFn //not handler because interceptor is not class based
): Observable<HttpEvent<any>> => {
  console.log('%c[Http Request]', 'color: blue;', req.method, req.url);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          console.log(
            '%c[Http Response]',
            'color: green;',
            event.status,
            event.url
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(
          '%c[Http Error]',
          'color: red;',
          error.status,
          error.message
        );
      },
    })
  );
};
