import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Configuration } from 'src/app/app.constants';
import { Invite } from 'src/app/models/permission';

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

  /**** USERS MANAGMENT
  * Endpoints related to list and remove created users
  * ****/
  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  deleteUser(userID: number) {
    if (!userID) {
      return throwError('[users-mngmt.service]: not userID provided');
    }
    return this.http.delete(`${this.baseUrl}/users/${userID}`);
  }

  /**** ROLE AND ENTITIES
  * Endpoints related to role and entities to invite a new user
  * ****/
  getRoles() {
    return this.http.get(`${this.baseUrl}/roles`);
  }

  getCountries() {
    return this.http.get(`${this.baseUrl}/countries`);
  }

  getRetailers(countryID?) {
    const endpoint = countryID
      ? `?country=${countryID}`
      : '';
    return this.http.get(`${this.baseUrl}/retailers${endpoint}`);
  }

  getSectors() {
    return this.http.get(`${this.baseUrl}/sectors`);
  }

  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  /**** INVITATIONS
  * Endpoints related to user invitation
  * ****/
  getInvitations() {
    return this.http.get(`${this.baseUrl}/users/invitations`);
  }

  sendInvitation(invite: Invite) {
    if (!invite) {
      return throwError('[users-mngmt.service]: not invite provided');
    }
    return this.http.post(`${this.baseUrl}/users/invitations`, invite);
  }

  resendInvitation(invitationID: number) {
    if (!invitationID) {
      return throwError('[users-mngmt.service]: not invitationID provided');
    }
    return this.http.post(`${this.baseUrl}/invitations/${invitationID}/resend`, {});
  }

  deleteInvitation(invitationID: number) {
    if (!invitationID) {
      return throwError('[users-mngmt.service]: not invitationID provided');
    }
    return this.http.delete(`${this.baseUrl}/invitations/${invitationID}`);
  }
}
