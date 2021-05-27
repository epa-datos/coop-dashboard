import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';



@NgModule({
  declarations: [
    ModalComponent,
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    ModalComponent,
    MaintenanceComponent
  ]
})
export class SharedModule { }
