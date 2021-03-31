import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersMngmtComponent } from './users-mngmt.component';
import { UsersComponent } from './pages/users/users.component';
import { RouterModule } from '@angular/router';
import { UsersMngmtRoutes } from './users-mngmt.routing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';



@NgModule({
  declarations: [
    UsersMngmtComponent,
    UsersListComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersMngmtRoutes),
    MatTableModule,
    MatPaginatorModule
  ]
})
export class UsersMngmtModule { }
