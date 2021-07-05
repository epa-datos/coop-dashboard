import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Configuration } from 'src/app/app.constants';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private baseUrl: string;

  private httpbypass: HttpClient; // this is to bypass the interceptor

  constructor(
    private config: Configuration,
    private http: HttpClient,
    private userService: UserService,
    private handler: HttpBackend
  ) {

    this.baseUrl = this.config.endpoint;
    this.httpbypass = new HttpClient(handler);
  }

  uploadProfileImage(file: FormData) {
    if (!this.userService.user.id) {
      return throwError('[user-profile.service]: not user ID provided');
    }

    if (!file) {
      return throwError('[user-profile.service]: not file provided');
    }

    const endpoint = `${this.baseUrl}/users/${this.userService.user.id}/images`;
    return this.http.put(endpoint, file);
  }
}
