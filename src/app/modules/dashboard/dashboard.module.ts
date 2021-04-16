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
import { GraphLineComparisonComponent } from './components/graphics/graph-line-comparison/graph-line-comparison.component';
import { GraphLineSeriesComponent } from './components/graphics/graph-line-series/graph-line-series.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ReactiveFormsModule } from '@angular/forms';
import { RetailFiltersComponent } from './components/retail-filters/retail-filters.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AudiencesWrapperComponent } from './components/audiences-wrapper/audiences-wrapper.component';
import { GraphLineComponent } from './components/graphics/graph-line/graph-line.component';
import { GraphBarComponent } from './components/graphics/graph-bar/graph-bar.component';
import { GraphHeatMapComponent } from './components/graphics/graph-heat-map/graph-heat-map.component';
import { GraphBarHorizontalComponent } from './components/graphics/graph-bar-horizontal/graph-bar-horizontal.component';
import { GraphLollipopComponent } from './components/graphics/graph-lollipop/graph-lollipop.component';
import { BehaviourWrapperComponent } from './components/behaviour-wrapper/behaviour-wrapper.component';
import { AcquisitionWrapperComponent } from './components/acquisition-wrapper/acquisition-wrapper.component';



@NgModule({
  declarations: [
    DashboardComponent,
    CountryComponent,
    RetailerComponent,
    GeneralFiltersComponent,
    CardStatComponent,
    GraphPieComponent,
    GraphLineComparisonComponent,
    GraphLineSeriesComponent,
    RetailFiltersComponent,
    AudiencesWrapperComponent,
    GraphLineComponent,
    GraphBarComponent,
    GraphHeatMapComponent,
    GraphBarHorizontalComponent,
    GraphLollipopComponent,
    BehaviourWrapperComponent,
    AcquisitionWrapperComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRippleModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatExpansionModule
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }]
})
export class DashboardModule { }
