import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { EmailValidator } from 'src/app/tools/validators/email.validator';
import { UserProfileService } from '../../services/user-profile.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

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
  fileContent: string | ArrayBuffer;
  imgSub;
  avatarUrl;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private userProfileService: UserProfileService
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
    console.log('onFileSelected', fileList)
    this.file = fileList[0];
    console.log('file', this.file)
    const fileType = this.file.type.substring(this.file.type.indexOf('/') + 1, this.file.type.length).toUpperCase();
    console.log('fileType', fileType)

    if (!this.imageValidators.fileType.includes(fileType)) {
      this.file.status = 'invalid';
    }
  }

  uploadImage() {
    this.file.status = 'loading';
    let formData: any = new FormData();
    formData.append('file', this.file);
    console.log('formData', formData)

    this.userProfileService.uploadProfileImage(formData).subscribe(
      (res: any) => {
        console.log('res', res);
        this.avatarUrl = res.url;
        this.file.status = 'loaded';
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

    // const fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(this.file);
    // fileReader.onload = () => {
    //   this.fileContent = fileReader.result;
    //   this.imgSub = this.userProfileService.uploadProfileImage(formData).pipe(
    //     map((event) => {
    //       switch (event.response.type) {
    //         case HttpEventType.UploadProgress:
    //           this.file.progress = Math.round(event.response.loaded * 100 / event.response.total);
    //           console.log('fileProgress', this.file)
    //           break;
    //         case HttpEventType.Response:
    //           this.file.publicURL = event.publicURL;
    //           console.log('image finish!!!')
    //           return event;
    //       }

    //       this.file.status = 'loading';
    //     }),
    //     catchError((error: HttpErrorResponse) => {
    //       console.error(error);
    //       this.file.status = 'failed';
    //       this.file.error = error.statusText;
    //       console.log('error', this.file.error)
    //       // this.filesReqStatus = 3;
    //       return of(error);
    //     })).subscribe((event: any) => {
    //       if (typeof (event) === 'object') {
    //         // console.log({ event });
    //       }
    //     });
    // }
  }

  ngOnDestroy() {
    this.imgSub?.unsubscribe();
  }
}
