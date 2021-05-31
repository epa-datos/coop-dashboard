import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersMngmtComponent } from './users-mngmt.component';
import { UsersComponent } from './pages/users/users.component';
import { RouterModule } from '@angular/router';
import { UsersMngmtRoutes } from './users-mngmt.routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InviteUserComponent } from './pages/invite-user/invite-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersMngmtService } from './services/users-mngmt.service';
import { InvitationComponent } from './components/invitation/invitation.component';
import { ActivityRegisterComponent } from './pages/activity-register/activity-register.component';



@NgModule({
  declarations: [
    UsersMngmtComponent,
    UsersListComponent,
    UsersComponent,
    InviteUserComponent,
    InvitationComponent,
    ActivityRegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(UsersMngmtRoutes),
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  providers: [
    UsersMngmtService
  ]
})
export class UsersMngmtModule { }
