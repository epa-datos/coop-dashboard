import { Routes } from '@angular/router';
import { CreateAccessComponent } from 'src/app/pages/create-access/create-access.component';
import { ForgotPswComponent } from 'src/app/pages/forgot-psw/forgot-psw.component';
import { ResetPswComponent } from 'src/app/pages/reset-psw/reset-psw.component';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPswComponent },
    { path: 'reset-password', component: ResetPswComponent },
    { path: 'create-access', component: CreateAccessComponent }
];
