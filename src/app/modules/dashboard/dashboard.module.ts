import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryComponent } from './pages/country/country.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';



@NgModule({
  declarations: [CountryComponent, RetailerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
  ]
})
export class DashboardModule { }
