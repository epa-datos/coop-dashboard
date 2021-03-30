import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { CreateAccessComponent } from './pages/create-access/create-access.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPswComponent } from './pages/forgot-psw/forgot-psw.component';
import { ResetPswComponent } from './pages/reset-psw/reset-psw.component';
import { SetPswComponent } from './components/set-psw/set-psw.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from './auth.routing';



@NgModule({
  declarations: [
    AuthComponent,
    CreateAccessComponent,
    LoginComponent,
    ForgotPswComponent,
    ResetPswComponent,
    SetPswComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthRoutes),
  ]
})
export class AuthModule { }
