import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder) { }

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
    if (this.form.valid) {
      console.log('valid form')
    }

  }
}
