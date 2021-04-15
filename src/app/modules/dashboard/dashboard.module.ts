import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CountryComponent } from './pages/country/country.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { DashboardRoutes } from './dashboard.routing';
import { GeneralFiltersComponent } from './components/general-filters/general-filters.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CardStatComponent } from './components/card-stat/card-stat.component';
import { GraphPieComponent } from './components/graphics/graph-pie/graph-pie.component';
import { GraphLineMultipleComponent } from './components/graphics/graph-line-multiple/graph-line-multiple.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CountryComponent,
    RetailerComponent,
    GeneralFiltersComponent,
    CardStatComponent,
    GraphPieComponent,
    GraphLineMultipleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }]
})
export class DashboardModule { }
