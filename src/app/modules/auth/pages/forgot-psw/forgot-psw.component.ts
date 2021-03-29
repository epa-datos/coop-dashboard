import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { EmailValidator } from 'src/app/tools/validators/email.validator';

@Component({
  selector: 'app-forgot-psw',
  templateUrl: './forgot-psw.component.html',
  styleUrls: ['./forgot-psw.component.scss']
})
export class ForgotPswComponent implements OnInit {
  usermail: string;
  email: AbstractControl;

  form: FormGroup;
  reqStatus: number = 0;
  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.validate])
      ]
    });
    this.email = this.form.controls['email'];
  }

  sendPswResetEmail(email) {
    this.reqStatus = 1;
    this.userService.pswRecoveryRequest(email)
      .subscribe(
        () => {
          delete this.errorMsg;
          this.reqStatus = 2;
        },
        error => {
          this.errorMsg = error?.error?.message ? error.error.message : error?.message
          console.error(`[forgot-psw.component]: ${this.errorMsg}`);
          this.reqStatus = 3;
        }
      )
  }
}
