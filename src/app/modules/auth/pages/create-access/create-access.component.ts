import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-access',
  templateUrl: './create-access.component.html',
  styleUrls: ['./create-access.component.scss']
})
export class CreateAccessComponent implements OnInit {
  usermail: string;
  reqState: number = 0;
  errorMsg: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.usermail = this.route.snapshot.queryParamMap.get('usermail')
      ? this.route.snapshot.queryParamMap.get('usermail')
      : 'user_email@test.com';
  }

  singup(newPassword) {
    this.reqState = 1;
    this.userService.singup(this.usermail, newPassword)
      .subscribe((newUser: User) => {

        if (newUser.id) {
          this.reqState = 2;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 6000);

        } else {
          this.reqState = 3;
          this.errorMsg = 'Request failed. Please try again'
        }
      },
        error => {
          this.reqState = 3;
          this.errorMsg = error?.error?.message ? error.error.message : error?.message;
        }
      )
  }
}
