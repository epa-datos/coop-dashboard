import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { Configuration } from '../app.constants';
import { User } from '../models/user';

@Injectable()
export class UserService {
  private baseUrl: string;

  private _user: User = new User();
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  private _loggedIn = false;
  redirectUrl: string;

  get user(): User {
    return this._user;
  }

  set user(user: User) {
    if (!user) {
      return;
    }
    this._user = user;
    this.userSource.next(this._user);
  }

  get loggedIn() {
    return !!window.localStorage.getItem('auth_token')
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private config: Configuration,
    private cookieService: CookieService
  ) {
    this._loggedIn = !!window.localStorage.getItem('auth_token');
    this.user.email = !!window.localStorage.getItem('usermail')
      ? window.localStorage.getItem('usermail')
      : '';
    this.user.username = !!window.localStorage.getItem('username')
      ? window.localStorage.getItem('username')
      : '';
    this.user.role_name = !!window.localStorage.getItem('role_name')
      ? window.localStorage.getItem('role_name')
      : '';

    this.baseUrl = this.config.endpoint;
  }

  singup(email: string, psw: string) {
    if (!email) {
      return throwError("[user.service]: not email provided");
    }
    if (!psw) {
      return throwError("[user.service]: not psw provided");
    }
    // const password = this.hashPsw(psw);
    const password = psw;
    return this.http.post(`${this.baseUrl}/users`, { email, password });
  }

  login(email: string, psw: string) {
    if (!email) {
      return throwError("[user.service]: not email provided");
    }
    if (!psw) {
      return throwError("[user.service]: not psw provided");
    }

    // Delete last session info if token expired and user doesn't logout.
    if (window.localStorage.getItem("usermail") !== email) {
      window.localStorage.clear();
    }

    // const password = this.hashPsw(psw);
    const password = psw;
    return this.http
      .post(`${this.baseUrl}/auth`, { email, password })
      .pipe(
        tap((resp: any) => {
          if (resp.user && resp.token && resp.role) {
            // this.user.email = email;
            window.localStorage.setItem('usermail', resp.user.email);
            window.localStorage.setItem('auth_token', resp.token);
            window.localStorage.setItem('role_name', resp.role.name);

            this.user = resp.user;
            this.user.role_name = resp.role.name;

            this._loggedIn = true;
          }
        })
      )
  }

  pswRecoveryRequest(email: string) {
    if (!email) {
      return throwError("[user.service]: not email provided");
    }

    return this.http.post(`${this.baseUrl}/users/forgot_password`, { email });
  }

  pswUpdateRequest(code: string, psw: string) {
    if (!code) {
      return throwError("[user.service]: not code provided");
    }
    if (!psw) {
      return throwError("[user.service]: not password provided");
    }

    // const password = this.hashPsw(psw);
    const password = psw;
    return this.http.post(`${this.baseUrl}/users/restore_password`, { code, password });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  isAdmin(): boolean {
    let role_name = this.user.role_name
      ? this.user.role_name
      : window.localStorage.getItem('role_name');

    return role_name === 'admin' ? true : false;
  }

  logout() {
    this.cleanUserData();
  }

  cleanUserData() {
    this._loggedIn = false;
    this._user = new User();
    this.router.navigate(["/"]);
    window.localStorage.clear();
  }

  hashPsw(password: string): string | Int32Array {
    return Md5.hashStr(password);
  }

  deleteUserCookieIfExists() {
    const user = this.cookieService.get('coop_user') && JSON.parse(this.cookieService.get('coop_user'));
    if (user) {
      this.cookieService.delete('coop_user');
    }
  }
}
