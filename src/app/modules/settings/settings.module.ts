import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { SettingsRoutes } from './settings.routing';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';



@NgModule({
  declarations: [
    SettingsComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(SettingsRoutes),
  ]
})
export class SettingsModule { }
