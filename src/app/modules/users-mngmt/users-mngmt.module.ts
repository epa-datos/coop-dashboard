import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersMngmtComponent } from './users-mngmt.component';
import { UsersComponent } from './pages/users/users.component';
import { RouterModule } from '@angular/router';
import { UsersMngmtRoutes } from './users-mngmt.routing';



@NgModule({
  declarations: [
    UsersMngmtComponent,
    UsersListComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersMngmtRoutes),
  ]
})
export class UsersMngmtModule { }
