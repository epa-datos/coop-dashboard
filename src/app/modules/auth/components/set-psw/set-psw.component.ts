import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-set-psw',
  templateUrl: './set-psw.component.html',
  styleUrls: ['./set-psw.component.scss']
})
export class SetPswComponent implements OnInit {
  @Input() submitBtnLegend = 'Change password';
  @Input() submitting: boolean = false;
  @Input() submitErrorLegend: string;
  @Output() passwordChange = new EventEmitter<string>();

  password: AbstractControl;
  validate_password: AbstractControl;
  form: FormGroup;
  pwdsNotMatch: boolean;
  pwdModeOn: boolean;
  validate_pwdModeOn: boolean;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(1)])
      ],
      validate_password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(1)])
      ]
    });

    this.password = this.form.controls['password'];
    this.validate_password = this.form.controls['validate_password'];
  }

  sendFormInfo(password: string, validate_password: string) {
    this.pwdsNotMatch = password !== validate_password ? true : false;
    if (!this.pwdsNotMatch) {
      this.passwordChange.emit(password);
    }
  }
}
