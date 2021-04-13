import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { ChartJsComponent } from 'src/app/pages/chart-js/chart-js.component';
import { AmchartsComponent } from 'src/app/pages/amcharts/amcharts.component';
import { UsersMngmtComponent } from 'src/app/modules/users-mngmt/users-mngmt.component';
import { UsersMngmtGuard } from 'src/app/modules/users-mngmt/users-mngmt.guard';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { InvestmentComponent } from 'src/app/pages/investment/investment.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'chart-js', component: ChartJsComponent },
    { path: 'amcharts', component: AmchartsComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'tables', component: TablesComponent },
    { path: 'icons', component: IconsComponent },
    { path: 'maps', component: MapsComponent },
    { path: 'argentina', component: AmchartsComponent },
    { path: 'brasil', component: ChartJsComponent },
    { path: 'colombia', component: ChartJsComponent },
    { path: 'mexico', component: ChartJsComponent },
    { path: 'panama', component: ChartJsComponent },
    { path: 'dashboard/investment', component: InvestmentComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        loadChildren: () =>
            import('src/app/modules/dashboard/dashboard.module').then(
                m => m.DashboardModule
            )
    },
    {
        path: 'dashboard/users',
        component: UsersMngmtComponent,
        loadChildren: () =>
            import('src/app/modules/users-mngmt/users-mngmt.module').then(
                m => m.UsersMngmtModule
            ),
        canActivate: [UsersMngmtGuard]
    }
];
