import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// components
import { CreateAccessComponent } from 'src/app/modules/auth/pages/create-access/create-access.component';
import { LoginComponent } from 'src/app/modules/auth/pages/login/login.component';
import { ForgotPswComponent } from 'src/app/modules/auth/pages/forgot-psw/forgot-psw.component';
import { ResetPswComponent } from 'src/app/modules/auth/pages/reset-psw/reset-psw.component';
import { SetPswComponent } from 'src/app/modules/auth/components/set-psw/set-psw.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule
    // NgbModule
  ],
  declarations: [
    CreateAccessComponent,
    LoginComponent,
    ForgotPswComponent,
    ResetPswComponent,
    SetPswComponent
  ]
})
export class AuthLayoutModule { }
