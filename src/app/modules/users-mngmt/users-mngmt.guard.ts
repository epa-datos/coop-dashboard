import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class UsersMngmtGuard implements CanActivate {
    constructor(
        private userService: UserService
    ) { }

    canActivate() {
        if (this.userService.isAdmin()) {
            return true;
        } else {
            this.userService.redirectToDefaultPage();
            return false;
        }
    }
}
