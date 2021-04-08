import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class UsersMngmtGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate() {
        if (this.userService.isAdmin()) {
            return true;
        } else {
            this.router.navigate(['/dashboard/investment']);
            return false;
        }
    }
}
