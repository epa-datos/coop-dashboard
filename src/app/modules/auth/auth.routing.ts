import { Routes } from '@angular/router';
import { CreateAccessComponent } from './pages/create-access/create-access.component';
import { ForgotPswComponent } from './pages/forgot-psw/forgot-psw.component';
import { LoginComponent } from './pages/login/login.component';
import { ResetPswComponent } from './pages/reset-psw/reset-psw.component';

export const AuthRoutes: Routes = [
    { path: 'create-access', component: CreateAccessComponent },
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPswComponent },
    { path: 'reset-password', component: ResetPswComponent },
];
