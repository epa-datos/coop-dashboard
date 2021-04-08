import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersMngmtService } from '../../services/users-mngmt.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent implements OnInit {
  @Input() invitation: any;
  @Output() invitationDeleted = new EventEmitter<boolean>();

  reqStatus: number = 0;
  errorMsg: string;

  constructor(private usersMngmtService: UsersMngmtService) { }

  ngOnInit(): void {
  }

  cancelInvitation() {
    this.reqStatus = 1;
    this.usersMngmtService.deleteInvitation(this.invitation.id)
      .subscribe(
        () => {
          this.invitationDeleted.emit(true);
          this.errorMsg && delete this.errorMsg;
          this.reqStatus = 2;
        },
        error => {
          const errorDetails = error?.error?.message ? error.error.message : error?.message;
          this.errorMsg = `Ocurrió un error al cancelar la invitación: ${errorDetails}.`
          console.error(`[invitation.component]: ${error}`);
          this.reqStatus = 3;
        }
      );
  }

  resendInvitation() {
    this.reqStatus = 1;
    this.usersMngmtService.resendInvitation(this.invitation.id)
      .subscribe(
        () => {
          this.errorMsg && delete this.errorMsg;
          this.reqStatus = 2;

          setTimeout(() => {
            this.reqStatus = 0;
          }, 5000)
        },
        error => {
          const errorDetails = error?.error?.message ? error.error.message : error?.message;
          this.errorMsg = `Ocurrió un reenviar la invitación: ${errorDetails}.`
          console.error(`[invitation.component]: ${error}`);
          this.reqStatus = 3;
        }
      );
  }
}
