import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { UserService } from 'src/app/services/user.service';

declare interface RouteInfo {
  path?: string;
  param?: string | number;
  title: string;
  icon?: string;
  class?: string;
  isForAdmin: boolean;
  submenu?: RouteInfo[];
  submenuOpen?: boolean;
  level: number;
}

export const ROUTES = [
  {
    path: '/dashboard/investment',
    title: 'Inversión',
    isForAdmin: false,
    level: 1
  }
]

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

  selectedItem: RouteInfo;
  selectedSubItem: RouteInfo;

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
      isForAdmin: true,
      level: 1
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
            title: country.name,
            param: country.name.toLowerCase(),
            path: `/dashboard/country`,
            isForAdmin: false,
            submenu: [],
            submenuOpen: false,
            level: 2
          }

          this.menuItems.push(menuItem);
        }
        this.errorMsg && delete this.errorMsg;
        this.menuReqStatus = 2;
      })
      .catch(error => {
        this.errorMsg = error?.error?.message ? error.error.message : error?.message
        console.error(this.errorMsg);
        this.menuReqStatus = 3;
        this.router.navigate(['dashboard/investment']);
      });
  }

  async selectItem(item, menuLevel, parent?) {
    if (item.submenu) {
      // if country already has a a submenu.lenght>1 avoid this requests
      item.submenu = await this.getAvailableRetailers()

      if (menuLevel === 1) {
        item.submenuOpen = !item.submenuOpen;
      }
    }

    if (menuLevel === 1) {
      this.selectedItem !== item && delete this.selectedSubItem;
      this.selectedItem = item;

    } else if (menuLevel === 2) {
      this.selectedItem = parent;
      this.selectedSubItem = item;
    }

    if (item.path) {
      if (item.param) {
        this.router.navigate([item.path, item.param]);

      } else {
        this.router.navigate([item.path]);
      }
    }
  }

  getAvailableRetailers() {
    // add country as a param in the requests
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((retailers: any[]) => {
        // console.log('retailers', retailers);
        let menuItem: RouteInfo[];
        menuItem = retailers.map(item => {
          return {
            path: '/dashboard/retailer',
            param: item.name.toLowerCase(),
            title: item.name,
            isForAdmin: false,
            level: 3
          }
        })

        return menuItem;
      })
      .catch(error => {
        console.error(`[sidebar.component]: ${error}`);
        throw (new Error(error));
      });
  }

  logout() {
    this.userService.logout();
  }
}
