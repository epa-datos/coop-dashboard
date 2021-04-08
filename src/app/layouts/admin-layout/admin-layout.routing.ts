import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ChartJsComponent } from 'src/app/pages/chart-js/chart-js.component';
import { AmchartsComponent } from 'src/app/pages/amcharts/amcharts.component';
import { UsersMngmtComponent } from 'src/app/modules/users-mngmt/users-mngmt.component';
import { UsersMngmtGuard } from 'src/app/modules/users-mngmt/users-mngmt.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'investment', component: DashboardComponent },
    { path: 'chart-js', component: ChartJsComponent },
    { path: 'amcharts', component: AmchartsComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'argentina', component: ChartJsComponent },
    { path: 'colombia', component: AmchartsComponent },
    { path: 'mexico', component: ChartJsComponent },
    {
        path: 'users',
        component: UsersMngmtComponent,
        loadChildren: () =>
            import('src/app/modules/users-mngmt/users-mngmt.module').then(
                m => m.UsersMngmtModule
            ),
        canActivate: [UsersMngmtGuard]
    }
];
