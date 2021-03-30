import { Routes } from '@angular/router';
import { AuthComponent } from 'src/app/modules/auth/auth.component';
import { AuthModule } from 'src/app/modules/auth/auth.module';

export const AuthLayoutRoutes: Routes = [
    {
        path: '',
        component: AuthComponent,
        loadChildren: () =>
            import("src/app/modules/auth/auth.module").then(
                m => AuthModule
            )
    }
];
