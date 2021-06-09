import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsAr);

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
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
    HttpClient,
    ConfigurationProvider,
    { provide: LOCALE_ID, useValue: 'es-Ar' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
