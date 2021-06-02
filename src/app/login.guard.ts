import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable()
export class LoginGuard implements CanActivate {
    token: string;
    constructor(
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, rss: RouterStateSnapshot) {
        this.token = route.queryParams['token']
        if (this.token) {
            localStorage.setItem('auth_token', this.token)
            this.router.navigate([rss.url.split('?')[0]], { queryParams: {}, replaceUrl: true, state: {} });
        }
        if (this.userService.isLoggedIn()) {
            return true;
        } else {
            // Store the attempted URL for redirecting
            this.router.navigate(['/login']);
        }
        return false;
    }
}
