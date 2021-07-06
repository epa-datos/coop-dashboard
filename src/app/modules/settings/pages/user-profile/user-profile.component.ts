import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { EmailValidator } from 'src/app/tools/validators/email.validator';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  form: FormGroup;
  name: AbstractControl;
  lastName: AbstractControl;
  email: AbstractControl;

  imageValidators = {
    fileType: [
      'JPG',
      'JPEG',
      'PNG',
    ]
  };

  file;
  avatarUrl;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, EmailValidator.validate])],
    });

    this.name = this.form.controls['name'];
    this.lastName = this.form.controls['lastName'];
    this.email = this.form.controls['email'];

    if (this.userService.user) {
      this.name.setValue(this.userService.user.first_name);
      this.lastName.setValue(this.userService.user.last_name);
      this.email.setValue(this.userService.user.email);
      this.avatarUrl = this.userService.user.avatar_url;
    }
  }

  onFileSelected(fileList) {
    this.file = fileList[0];
    const fileType = this.file.type.substring(this.file.type.indexOf('/') + 1, this.file.type.length).toUpperCase();

    if (!this.imageValidators.fileType.includes(fileType)) {
      this.file.status = 'invalid';
    }
  }

  uploadImage() {
    this.file.status = 'loading';
    let formData: any = new FormData();
    formData.append('file', this.file);

    this.userService.uploadProfileImage(formData).subscribe(
      (res: any) => {
        this.avatarUrl = res.url;
        this.userService.userAvatarUrl = res.url;
        this.file.status = 'loaded';

        // in order to clear generated legends
        setTimeout(() => {
          delete this.file;
        }, 6000);
      },
      error => {
        this.file.status = 'failed';

        const errorMsg = error?.error?.message
          ? error.error.message :
          error?.message
            ? error?.message
            : error;
        console.error(`[user-profile.component]: ${errorMsg}`);
      });
  }
}
