import {Injectable} from '@angular/core';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, throwError} from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      catchError(error => {
        console.error('Error:', error);
        alert(`Error: ${error.error?.message || 'Ocurrió un problema en el servidor'}`);
        return throwError(() => new Error(error));
      })
    );
  }
}
