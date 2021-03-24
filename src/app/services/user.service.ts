import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { User } from '../models/user';

@Injectable()
export class UserService {
  private baseUrl: string = 'http://localhost:3000';

  private _user: User = new User();
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  private _loggedIn = false;

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
    return !!window.localStorage.getItem("auth_token")
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this._loggedIn = !!window.localStorage.getItem("auth_token");
    this.user.email = !!window.localStorage.getItem("usermail")
      ? window.localStorage.getItem("usermail")
      : "";
    this.user.username = !!window.localStorage.getItem("username")
      ? window.localStorage.getItem("username")
      : "";
  }

  singup(email: string, psw: string) {
    if (!email) {
      return throwError("[user.service]: not email provided");
    }
    if (!psw) {
      return throwError("[user.service]: not psw provided");
    }
    const password = this.hashPsw(psw);
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

    const password = this.hashPsw(psw);
    return this.http
      .post(`${this.baseUrl}/auth`, { email, password })
      .pipe(
        tap((resp: any) => {
          if (resp && resp.token) {
            this.user.email = email;
            window.localStorage.setItem("usermail", email);
            window.localStorage.setItem("auth_token", resp.token);

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

    const password = this.hashPsw(psw);
    return this.http.post(`${this.baseUrl}/users/restore_password`, { code, password });
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
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
}
