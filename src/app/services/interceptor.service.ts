import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionInterceptor {
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken)
      });
    }

    return next.handle(request).pipe(
      tap(() => { },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // check if user data is in coop_user cookie
              const user = this.cookieService.get('coop_user') && JSON.parse(this.cookieService.get('coop_user'))
              console.log(user)
              if (user) {
                this.generatePersistSession(user.email, user.anonymous_id)
              } else {
                this.userService.logout();
              }
            }
          }
        })
    );
  }

  generatePersistSession(email: string, password: string) {
    this.userService.login(email, password).subscribe(
      () => {
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.userService.logout();
        console.error(`[interceptor.service]: ${error?.error?.message ? error.error.message : error?.message}`);
      }
    )
  }
}
