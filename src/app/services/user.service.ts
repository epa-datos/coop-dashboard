import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Md5 } from 'ts-md5';
import { Configuration } from '../app.constants';
import { User } from '../models/user';
import { FiltersStateService } from '../modules/dashboard/services/filters-state.service';
import { UsersMngmtService } from '../modules/users-mngmt/services/users-mngmt.service';

@Injectable()
export class UserService {
  private baseUrl: string;

  private _user: User = new User();
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  private _loggedIn = false;

  defaultRedirect: Route; // default url to redirect after login and sidebar icons
  viewLevel: string; // 'latam' to be redirected to latam page or 'general' to be redirected to the first country or retailer depending on role 

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
    private cookieService: CookieService,
    private filtersStateService: FiltersStateService,
    private usersMngmtService: UsersMngmtService
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

    this.viewLevel = !!window.localStorage.getItem('view_level')
      ? window.localStorage.getItem('view_level')
      : '';

    this.baseUrl = this.config.endpoint;
  }

  singup(code: string, psw: string) {
    if (!code) {
      return throwError("[user.service]: not email provided");
    }
    if (!psw) {
      return throwError("[user.service]: not psw provided");
    }
    // const password = this.hashPsw(psw);
    const password = psw;
    return this.http.post(`${this.baseUrl}/users`, { code, password });
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
        tap((auth: any) => {
          if (auth.user && auth.token && auth.role) {
            // this.user.email = email;
            window.localStorage.setItem('usermail', auth.user.email);
            window.localStorage.setItem('auth_token', auth.token);
            window.localStorage.setItem('role_name', auth.role.name);
            window.localStorage.setItem('view_level', auth.level);

            this.user = auth.user;
            this.user.role_name = auth.role.name;
            this.viewLevel = auth.level;

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

  redirectToDefaultPage() {
    return new Promise<void>((resolve) => {
      this.getDefaultRedirect().then((route: Route) => {
        this.defaultRedirect = route;

        const { url, queryParams } = route;
        this.router.navigate([url], { queryParams });
        resolve();

        console.log('route', route);
      });
    });
  }

  getDefaultRedirect() {
    return new Promise(async (resolve) => {
      const role = this.user.role_name;
      let redirect: Route;

      if ((role === 'admin' || role === 'hp') || (role === 'countries' && this.viewLevel === 'latam')) {
        // For users who have enable LATAM view
        redirect = {
          url: '/dashboard/main-region',
          queryParams: { ['main-region']: 'latam' }
        }
      } else if (role === 'country' && this.viewLevel === 'general') {
        // For users who have country role and general level
        // the redirection is the first country that which they have access

        !this.filtersStateService.countriesInitial && await this.getCountries();
        let countries = this.filtersStateService.countriesInitial

        for (let country of countries) {
          country.title = country.region ? country.region : country.name;
        }

        if (countries.some(country => country.region)) {
          countries = countries.sort((a, b) => (a.title < b.title ? -1 : 1));
        }

        // If the first country that which they have access belongs to a region
        // is necessary to include it in a 'region' query param
        let queryParams;
        if (!countries[0].region) {
          queryParams = { ['country']: countries[0]?.name.toLowerCase().replaceAll(' ', '-') }
        } else {
          queryParams = {
            ['region']: countries[0]?.region.toLowerCase().replaceAll(' ', '-'),
            ['country']: countries[0]?.name.toLowerCase().replaceAll(' ', '-')
          }
        }

        redirect = { url: '/dashboard/country', queryParams }

      } else if (role === 'retailer' && this.viewLevel === 'general') {
        // For users who have retailer role and general level
        // the redirection is the first retailer that which they have access

        !this.filtersStateService.retailersInitial && await this.getRetailers();
        const retailers = this.filtersStateService.retailersInitial

        const retailerName = retailers[0]?.name.split(' - ')[1];
        redirect = {
          url: '/dashboard/retailer',
          queryParams: { ['retailer']: retailerName.toLowerCase().replaceAll(' ', '-') }
        }
      }

      resolve(redirect);
    });
  }

  logout() {
    this.cleanUserData();
    this.filtersStateService.deleteFilters();
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

  getCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((countries: any[]) => {
        this.filtersStateService.countriesInitial = countries;
      })
      .catch((error) => {
        console.error(`[user.service]: ${error}`);
      });
  }

  getRetailers() {
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((res: any[]) => {
        const retailers = res.map(retailer => {
          return { id: retailer.id, name: `${retailer.country_code} - ${retailer.name}` }
        });
        this.filtersStateService.retailersInitial = retailers;
      })
      .catch((error) => {
        console.error(`[user.service]: ${error}`);
      });
  }
}

export interface Route {
  url: string;
  queryParams: any;
}
