import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class UsersMngmtGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router,
    ) { }

    canActivate() {
        if (this.userService.isAdmin()) {
            return true;
        } else {
            this.router.navigate(['/dashboard/home']);

            // default redirection deprecated
            // this.userService.redirectToDefaultPage();
            return false;
        }
    }
}
