import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { UserService } from 'src/app/services/user.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  isForAdmin: boolean;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard/investment', title: 'Inversión', icon: 'text-primary', class: '', isForAdmin: false },
  // { path: '/chart-js', title: 'chart.js', icon: 'ni-chart-bar-32 text-primary', class: '' },
  // { path: '/amcharts', title: 'amcharts', icon: 'ni-chart-pie-35 text-primary', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'ni-planet text-blue', class: '' },
  // { path: '/maps', title: 'Maps', icon: 'ni-pin-3 text-orange', class: '' },
  // { path: '/user-profile', title: 'User profile', icon: 'ni-single-02 text-yellow', class: '' },
  // { path: '/tables', title: 'Tables', icon: 'ni-bullet-list-67 text-red', class: '' },
  // { path: '/login', title: 'Login', icon: 'ni-key-25 text-info', class: '' },
  // { path: '/register', title: 'Register', icon: 'ni-circle-08 text-pink', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  public menuItems: any[];
  public isCollapsed = true;
  public userIsAdmin: boolean;
  public menuReqStatus: number = 0;
  public errorMsg: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private usersMngmtService: UsersMngmtService
  ) { }

  async ngAfterViewInit() {
    this.userIsAdmin = this.userService.isAdmin();

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    await this.getAvailableRoutes();

    // Admin routes
    const menuItem = {
      path: '/dashboard/users',
      title: 'Administrar usuarios',
      icon: 'text-primary',
      class: '',
      isForAdmin: true
    }
    this.menuItems.push(menuItem);
  }

  ngOnInit() { }

  getAvailableRoutes() {
    this.menuReqStatus = 1;

    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((resp: any[]) => {
        for (let country of resp) {
          const menuItem = {
            path: `/dashboard/${country.name.toLowerCase()}`,
            title: country.name,
            icon: 'text-primary',
            class: '',
            isForAdmin: false
          }

          this.menuItems.push(menuItem);
          this.errorMsg && delete this.errorMsg;
          this.menuReqStatus = 2;
        }
      })
      .catch(error => {
        this.errorMsg = error?.error?.message ? error.error.message : error?.message
        console.error(this.errorMsg);
        this.menuReqStatus = 3;
        this.router.navigate(['dashboard/investment']);
      });
  }

  logout() {
    this.userService.logout();
  }
}
