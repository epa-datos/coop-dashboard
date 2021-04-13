import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { CountryComponent } from './pages/country/country.component';
import { RetailerComponent } from './pages/retailer/retailer.component';

export const DashboardRoutes: Routes = [
    { path: 'investment', component: DashboardComponent },
    { path: 'country', component: CountryComponent },
    { path: 'retailer', component: RetailerComponent },
];
