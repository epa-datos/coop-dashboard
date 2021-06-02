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

              // console.log('savedUser', savedUser)
              // console.log('currentUser', currentUsermail)
              if (savedUser.email === currentUsermail) {
                // const currentUrl = this.router.url
                // const defaultUrl = this.userService.defaultRedirect.url;
                // let defaultQueryParams = this.userService.defaultRedirect.queryParams[Object.keys(this.userService.defaultRedirect.queryParams)[0]]
                // let areEquals = currentUrl.includes(defaultUrl) && this.router.url.includes(defaultQueryParams);
                // authToken = localStorage.getItem('auth_token');

                // // how to avoid multiple calls to generatePersistSession?
                // if (!authToken) {
                //   if (!areEquals) {
                //     this.generatePersistSession(user.email, user.anonymous_id);
                //   }
                // }

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
        this.userService.redirectToDefaultPage();
        // how to avoid multiple change in filtersChange observable?
        // a possible solution could be check a component to indicate to user that its token expires
        // so is necessary apply some filter or change again
        // this.filtersStateService.filtersChange();
      },
      error => {
        this.userService.logout();
        console.error(`[interceptor.service]: ${error?.error?.message ? error.error.message : error?.message}`);
      }
    )
  }
}
