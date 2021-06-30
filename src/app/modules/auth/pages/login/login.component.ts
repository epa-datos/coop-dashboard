import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AppStateService } from 'src/app/services/app-state.service';
import { LocaleService } from 'src/app/services/locale.service';
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

  languages = ['es', 'pt', 'en'];
  defaultLang: string;
  selectedLang: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private translate: TranslateService,
    private appStateService: AppStateService,
    private localService: LocaleService
  ) {
    const islogged = this.userService.isLoggedIn();

    islogged && this.router.navigate(['/dashboard/home']);

    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'es');
    }

    this.defaultLang = localStorage.getItem('lang');
    translate.setDefaultLang(this.defaultLang);
    this.selectedLang = this.defaultLang;
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
  }

  getSavedUserData() {
    const savedUser = this.cookieService.get('coop_user') && JSON.parse(this.cookieService.get('coop_user'));

    if (savedUser) {
      this.email.setValue(savedUser.email);
      this.password.setValue(savedUser.secret_key);
      this.remember_password.setValue(true);
    }
  }

  login(email: string, password: string) {
    this.reqStatus = 1;
    if (this.form.valid) {
      this.userService.login(email, password).subscribe(
        () => {
          if (this.remember_password.value) {
            this.rememberPsw();
          } else {
            this.userService.deleteUserCookieIfExists();
          }

          this.router.navigate(['/dashboard/home']);
          // default redirection deprecated
          // this.userService.redirectToDefaultPage().then(() => {
          //   this.reqStatus = 2;
          // });

          // in order to load app module again and use selected lang in setup
          if ((this.defaultLang == 'es' || this.defaultLang == 'pt') && this.selectedLang == 'en' ||
            (this.defaultLang == 'en' && this.selectedLang !== 'en')) {
            window.location.reload();
          }
        },
        error => {
          const errorMsg = error?.error?.message ? error.error.message : error?.message;
          console.error(`[login.component]: ${errorMsg}`);
          this.reqStatus = 3;
        }
      )
    }
  }

  rememberPsw() {
    const user = {
      email: this.email.value,
      // secret_key: this.userService.hashPsw(this.password.value)
      secret_key: this.password.value,
      create_at: new Date().getTime()
    }

    this.cookieService.set('coop_user', JSON.stringify(user), 365);
  }

  langChange() {
    localStorage.setItem('lang', this.selectedLang);

    this.translate.use(this.selectedLang);
    this.appStateService.selectLang(this.selectedLang);

    this.localService.registerCulture(this.selectedLang);
  }
}
