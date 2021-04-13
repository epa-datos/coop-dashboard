import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersMngmtModule } from 'src/app/modules/users-mngmt/users-mngmt.module';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { UsersMngmtGuard } from 'src/app/modules/users-mngmt/users-mngmt.guard';
import { DashboardModule } from 'src/app/modules/dashboard/dashboard.module';

// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    NgbModule,
    ClipboardModule,
    UsersMngmtModule,
    DashboardModule
  ],
  declarations: [
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent
  ],
  providers: [
    UsersMngmtGuard
  ]
})

export class AdminLayoutModule { }
