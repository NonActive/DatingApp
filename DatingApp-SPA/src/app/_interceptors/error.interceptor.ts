import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        console.log(error);
        if (error) {
          switch (error.status) {
            case 400:
              const rawStateErrors = error.error.errors;

              if (rawStateErrors) {
                const modalStateErrors = [];
                for (const key in rawStateErrors) {
                  if (rawStateErrors[key]) {
                    modalStateErrors.push(rawStateErrors[key]);
                  }
                }
                console.log(modalStateErrors.flat());
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText, error.status);
              } else {
                this.toastr.error(error.error, error.status);
              }

              console.log('400');
              break;
            case 401:
              this.toastr.error(error.statusText, error.status);
              console.log('401');
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              console.log('404');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              console.log('500');
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
