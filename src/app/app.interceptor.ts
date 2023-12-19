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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HelperService } from './helper.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private helperService: HelperService) {}

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
    let token = this.helperService.getHeaderData()?.token;
    let userName = this.helperService.getHeaderData()?.userName;

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
