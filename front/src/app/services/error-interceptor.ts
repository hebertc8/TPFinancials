import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './login.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { RequestsService } from './requests.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  private subscriptionRefresh: Subscription;
  private refreshToken;
  constructor(
    private user: LoginService,
    private toastr: NbToastrService,
    private router: Router,
    private request: RequestsService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (this.user.getUser()) {
          this.refreshToken = this.user.getUser().refreshToken;
        }
        if (err.error.code === 400) {
          this.toastr.warning('Activando de nuevo.', 'Sesión inactiva', {
            duration: 7000,
          });

          this.subscriptionRefresh = this.request
            .refreshSession(this.refreshToken)
            .subscribe((res) => {
              if (this.user.relogin(res)) {
                this.toastr.success(
                  'Sesión activa, Intenta de nuevo.',
                  'Sesión',
                  { duration: 7000 }
                );
              } else {
                this.logout('Error reactivando sesión.');
              }
            });
        } else if (err.error.code === 401) {
          this.logout('Sesión expirada.');
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }

  logout(message) {
    this.toastr.warning(message, 'Sesión.');
    setTimeout(() => {
      this.user.logout();
      this.router.navigate(['/login']);
    }, 1000);
  }
}
