import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, lastValueFrom, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    let token ="eyJraWQiOiIwZGQ4SmdtRFlRdDlsWnlfNnZVQVVOSm16anN0eFVaeEg1YkwtRjNmYkJrIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHVlcmR2MWI0QkR5TDFoVTBoNyIsIm5hbWUiOiJYWVogTWFuYWdlciIsImxvY2FsZSI6IlVTIiwiZW1haWwiOiJtYW5hZ2VyQHh5enJlc3RhdXJhbnRzLmNvbSIsInZlciI6MSwiaXNzIjoiaHR0cHM6Ly9wcmV2aWV3LW9rdGFsb2dpbi5lY29sYWIuY29tIiwiYXVkIjoiMG9hZ2F1NnhoemJYenZseUQwaDciLCJpYXQiOjE3MDI5MTI1OTksImV4cCI6MTcwMjkxNjE5OSwianRpIjoiSUQuNV81UDMyNWhqTWpuZHNFS1Fpcnh5UlpUMGxjV0hfeG14WTBPMU9SR2xSbyIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvNml0YnN5YzRWdXljakowaDciLCJub25jZSI6InNWbHYzOUNoTkFPRlZNblNQdGtwT1V4VmkzbEJDUGZIYVBiZkt6MjFPSExDWFdMcGxDcERSRTgzSXhUS2V3Y0kiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJtYW5hZ2VyQHh5enJlc3RhdXJhbnRzLmNvbSIsImdpdmVuX25hbWUiOiJYWVoiLCJmYW1pbHlfbmFtZSI6Ik1hbmFnZXIiLCJ6b25laW5mbyI6IkFtZXJpY2EvTG9zX0FuZ2VsZXMiLCJ1cGRhdGVkX2F0IjoxNjAyMDgxOTU4LCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXV0aF90aW1lIjoxNzAyODg0NDA4LCJhZGRyZXNzIjp7ImNvdW50cnkiOiJVUyJ9fQ.dqCBljKIHsoXGIvlGUIhYuXUZJxXwbWu1nvi97AoQ69ddhW1dqOVC6jiorFnde5sEIRO1vY45ZTtzI2RAH3WQdvngkblZVUlQjL9HtvUka-Dk8zd0QFWX-yuYiscEcSUZ9mC_TxwZvpuBx8gyTEr2z5JfPVL3QP8AsUbp2OddSFFAatjG5ydlOMyP6RxlCYlvL8ejwzEyANYP37MR0JXkXtP_3C4n0hLYeqdunDKppHq__ulklC1iRvBkWAs1EbfG6B_wNdhFqsewjhQC2jN5zl8RdzovfGiDULIPkwI7cZwLguWKzgnFR25mmZn7ntDzFP6jn61-C5ME_97z7TtVw";
    let userName = 'manager@xyzrestaurants.com';

    request = request.clone({
      headers: request.headers.delete('No-Authentication'),
      setHeaders: {
        Authorization: `Bearer ${token}`,
        UserId: userName,
        ClientType: 'CW',
        DeviceId: 'WEB',
        Trackid: this.uuidv4(),
      },
    });
    return await lastValueFrom( next.handle(request)
      .pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401 || error.status === 403) {
              console.log('Error');
            }
          }
          return throwError(()=>new Error(error));
        })
      ))
  }

  uuidv4(): any {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
