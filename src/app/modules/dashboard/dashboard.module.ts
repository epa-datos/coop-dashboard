import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';

// **** Angular Material ****
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// **** COMPONENTS ****
import { DashboardComponent } from './dashboard.component';
import { GeneralFiltersComponent } from './components/general-filters/general-filters.component';
import { RetailFiltersComponent } from './components/retail-filters/retail-filters.component';
import { CardStatComponent } from './components/card-stat/card-stat.component';
import { CampaignsTablesComponent } from './components/campaigns-tables/campaigns-tables.component';
import { GoogleBusinessComponent } from './components/google-business/google-business.component';
import { CampaignComparatorComponent } from './pages/campaign-comparator/campaign-comparator.component';
import { SentimentAnalysisComponent } from './pages/sentiment-analysis/sentiment-analysis.component';
import { DashboardRoutes } from './dashboard.routing';

// pages
import { CountryComponent } from './pages/country/country.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { OtherToolsComponent } from './pages/other-tools/other-tools.component';
import { OverviewLatamComponent } from './pages/overview-latam/overview-latam.component';

// wrappers
import { OverviewWrapperComponent } from './components/overview-wrapper/overview-wrapper.component';
import { AudiencesWrapperComponent } from './components/audiences-wrapper/audiences-wrapper.component';
import { AcquisitionWrapperComponent } from './components/acquisition-wrapper/acquisition-wrapper.component';
import { BehaviourWrapperComponent } from './components/behaviour-wrapper/behaviour-wrapper.component';
import { ConversionWrapperComponent } from './components/conversion-wrapper/conversion-wrapper.component';

// charts
import { ChartBarComponent } from './components/charts/chart-bar/chart-bar.component';
import { ChartBarHorizontalComponent } from './components/charts/chart-bar-horizontal/chart-bar-horizontal.component';
import { ChartHeatMapComponent } from './components/charts/chart-heat-map/chart-heat-map.component';
import { ChartLineComponent } from './components/charts/chart-line/chart-line.component';
import { ChartLineComparisonComponent } from './components/charts/chart-line-comparison/chart-line-comparison.component';
import { ChartLineSeriesComponent } from './components/charts/chart-line-series/chart-line-series.component';
import { ChartLollipopComponent } from './components/charts/chart-lollipop/chart-lollipop.component';
import { ChartPieComponent } from './components/charts/chart-pie/chart-pie.component';
import { ChartColumnLineMixComponent } from './components/charts/chart-column-line-mix/chart-column-line-mix.component';
import { ChartPictorialComponent } from './components/charts/chart-pictorial/chart-pictorial.component';
import { ChartPyramidComponent } from './components/charts/chart-pyramid/chart-pyramid.component';
import { ChartMultipleAxesComponent } from './components/charts/chart-multiple-axes/chart-multiple-axes.component';
import { ChartLoaderComponent } from './components/charts/chart-loader/chart-loader.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CountryComponent,
    RetailerComponent,
    OtherToolsComponent,
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
    OverviewWrapperComponent,
    CampaignsTablesComponent,
    ChartPyramidComponent,
    GoogleBusinessComponent,
    ChartMultipleAxesComponent,
    ChartLoaderComponent,
    CampaignComparatorComponent,
    SentimentAnalysisComponent,
    OverviewLatamComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatRippleModule,
    MatSelectModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NgbModule,
    SharedModule
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'never' } }]
})
export class DashboardModule { }
