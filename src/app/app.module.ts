import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { UserService } from './services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionInterceptor } from './services/interceptor.service';
import { LoginGuard } from './login.guard';
import { ConfigurationProvider } from './app.constants';
import { SharedModule } from './modules/shared/shared.module';
import { AppStateService } from './services/app-state.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    SharedModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    ChartJsComponent,
    AmchartsComponent
  ],
  providers: [
    DatasetsService,
    UserService,
    CookieService,
    LoginGuard,
    AppStateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionInterceptor,
      multi: true
    },
    ConfigurationProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
