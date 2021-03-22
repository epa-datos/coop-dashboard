import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { ChartJsComponent } from './pages/chart-js/chart-js.component';
import { DatasetsService } from './services/datasets.service';
import { AmchartsComponent } from './pages/amcharts/amcharts.component';
import { ForgotPswComponent } from './pages/forgot-psw/forgot-psw.component';
import { ResetPswComponent } from './pages/reset-psw/reset-psw.component';
import { CreateAccessComponent } from './pages/create-access/create-access.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ChartJsComponent,
    AmchartsComponent,
    ForgotPswComponent,
    ResetPswComponent,
    CreateAccessComponent,
  ],
  providers: [DatasetsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
