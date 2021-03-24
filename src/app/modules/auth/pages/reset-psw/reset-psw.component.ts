import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-psw',
  templateUrl: './reset-psw.component.html',
  styleUrls: ['./reset-psw.component.scss']
})
export class ResetPswComponent implements OnInit {
  code: string;
  reqStatus: number = 0;
  errorMsg: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.queryParamMap.get('code')
      ? this.route.snapshot.queryParamMap.get('code')
      : 'ac337071eed387a1';
  }

  resetPsw(newPassword) {
    this.reqStatus = 1;
    this.userService.pswUpdateRequest(this.code, newPassword)
      .subscribe(
        () => {
          this.reqStatus = 2;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 6000);
        },
        error => {
          this.errorMsg = 'Request failed. Please try again';
          console.error(`[reset-psw.component]: ${error?.error?.message ? error.error.message : error?.message}`);
          this.reqStatus = 3;
        }
      )
  }
}
