import { Component, OnInit } from '@angular/core';
import { UsersMngmtService } from '../../services/users-mngmt.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private invitations: any[];
  getReqSatus: number = 0;

  constructor(
    private usersMngmtService: UsersMngmtService
  ) { }

  ngOnInit(): void {
    this.getInvitations();
  }

  getInvitations() {
    this.getReqSatus = 1;
    this.usersMngmtService.getInvitations()
      .subscribe(
        (resp: any[]) => {
          this.invitations = resp;
          this.getReqSatus = 2;
        },
        error => {
          this.getReqSatus = 3;
          console.error(`[users.component]: ${error?.error?.message ? error.error.message : error?.message}`);
        }
      )
  }
}
