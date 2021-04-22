import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// **** Angular Material ****
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// **** COMPONENTS ****
import { DashboardComponent } from './dashboard.component';
import { CountryComponent } from './pages/country/country.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { GeneralFiltersComponent } from './components/general-filters/general-filters.component';
import { RetailFiltersComponent } from './components/retail-filters/retail-filters.component';
import { CardStatComponent } from './components/card-stat/card-stat.component';
import { DashboardRoutes } from './dashboard.routing';

// wrappers
import { AudiencesWrapperComponent } from './components/audiences-wrapper/audiences-wrapper.component';
import { AcquisitionWrapperComponent } from './components/acquisition-wrapper/acquisition-wrapper.component';
import { BehaviourWrapperComponent } from './components/behaviour-wrapper/behaviour-wrapper.component';

// charts
import { ChartBarComponent } from './components/charts/chart-bar/chart-bar.component';
import { ChartBarHorizontalComponent } from './components/charts/chart-bar-horizontal/chart-bar-horizontal.component';
import { ChartHeatMapComponent } from './components/charts/chart-heat-map/chart-heat-map.component';
import { ChartLineComponent } from './components/charts/chart-line/chart-line.component';
import { ChartLineComparisonComponent } from './components/charts/chart-line-comparison/chart-line-comparison.component';
import { ChartLineSeriesComponent } from './components/charts/chart-line-series/chart-line-series.component';
import { ChartLollipopComponent } from './components/charts/chart-lollipop/chart-lollipop.component';
import { ChartPieComponent } from './components/charts/chart-pie/chart-pie.component';
import { ConversionWrapperComponent } from './components/conversion-wrapper/conversion-wrapper.component';
import { ChartColumnLineMixComponent } from './components/charts/chart-column-line-mix/chart-column-line-mix.component';
import { ChartPictorialComponent } from './components/charts/chart-pictorial/chart-pictorial.component';
import { OverviewWrapperComponent } from './components/overview-wrapper/overview-wrapper.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CountryComponent,
    RetailerComponent,
    GeneralFiltersComponent,
    RetailFiltersComponent,
    CardStatComponent,
    AudiencesWrapperComponent,
    AcquisitionWrapperComponent,
    BehaviourWrapperComponent,
    ChartBarComponent,
    ChartBarHorizontalComponent,
    ChartHeatMapComponent,
    ChartLineComponent,
    ChartLineComparisonComponent,
    ChartLineSeriesComponent,
    ChartLollipopComponent,
    ChartPieComponent,
    ConversionWrapperComponent,
    ChartColumnLineMixComponent,
    ChartPictorialComponent,
    OverviewWrapperComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    ReactiveFormsModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }]
})
export class DashboardModule { }
