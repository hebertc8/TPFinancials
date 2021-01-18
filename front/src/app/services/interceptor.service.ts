import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private user: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.user.getUser();


    if (currentUser) {

          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${currentUser.token}`,
              'Access-Control-Allow-Origin': '*',
            },
          });
          return next.handle(request);
    } else {
      return next.handle(request);
    }

  }
}

