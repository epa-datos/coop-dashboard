import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';
import { EmailValidator } from 'src/app/tools/validators/email.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;
  usermail: string;

  email: AbstractControl;
  password: AbstractControl;
  remember_password: AbstractControl;

  form: FormGroup;
  pwdModeOn: boolean;
  reqStatus: number = 0;
  errorMsg: string;

  redirect: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    const islogged = this.userService.isLoggedIn();
    this.redirect = this.userService.redirectUrl ?? '/dashboard/investment'
    if (islogged) {
      this.router.navigate(['/dashboard/investment']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.validate])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(1)])
      ],
      remember_password: false
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    this.remember_password = this.form.controls['remember_password'];

    this.getSavedUserData();
    if (this.usermail) {
      this.email.setValue(this.usermail);
    }
  }

  getSavedUserData() {
    const un = !!localStorage.getItem('username')
      ? localStorage.getItem('username')
      : '';
    this.username = un === 'null' ? '' : un;
    const um = !!localStorage.getItem('usermail')
      ? localStorage.getItem('usermail')
      : '';
    this.usermail = um === 'null' ? '' : um;
  }


  login(email: string, password: string) {
    this.reqStatus = 1;
    if (this.form.valid) {
      this.userService.login(email, password).subscribe(
        () => {
          delete this.errorMsg;
          if (this.remember_password.value) {
            this.rememberPsw();
          } else {
            this.userService.deleteUserCookieIfExists();
          }
          this.reqStatus = 2;
          this.router.navigate([this.redirect]);
        },
        error => {
          this.errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[login.component]: ${this.errorMsg}`);
          this.reqStatus = 3;
        }
      )
    }
  }

  rememberPsw() {
    const user = {
      email: this.email.value,
      // anonymous_id: this.userService.hashPsw(this.password.value)
      anonymous_id: this.password.value
    }
    this.cookieService.set('coop_user', JSON.stringify(user), 365);
  }
}
