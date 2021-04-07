import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UsersMngmtService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: Configuration,
  ) {
    this.baseUrl = this.config.endpoint;
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  deleteUser(userID: number) {
    if (!userID) {
      return throwError('[users-mngmt.service]: not userID provided');
    }
    return this.http.delete(`${this.baseUrl}/users/${userID}`);
  }

  getRoles() {
    return this.http.get(`${this.baseUrl}/roles`);
  }

  getCountries() {
    return this.http.get(`${this.baseUrl}/countries`);
  }

  getRetailers() {
    return this.http.get(`${this.baseUrl}/retailers`);
  }

  getSectors() {
    return this.http.get(`${this.baseUrl}/sectors`);
  }

  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`);
  }
}
