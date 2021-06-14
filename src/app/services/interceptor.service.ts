import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FiltersStateService } from '../modules/dashboard/services/filters-state.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionInterceptor {
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private filtersStateService: FiltersStateService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authToken = localStorage.getItem('auth_token');
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

              const savedUser = this.cookieService.get('coop_user') && JSON.parse(this.cookieService.get('coop_user'));
              const currentUsermail = localStorage.getItem('usermail');

              if (savedUser.email === currentUsermail) {
                this.generatePersistSession(savedUser.email, savedUser.anonymous_id);
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

        this.router.navigate(['/dashboard/home']);

        // default redirection deprecated
        // this.userService.redirectToDefaultPage();
      },
      error => {
        this.userService.logout();
        this.router.navigate(['/login']);
        console.error(`[interceptor.service]: ${error?.error?.message ? error.error.message : error?.message}`);
      }
    )
  }
}
