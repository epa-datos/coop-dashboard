import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { AppStateService } from 'src/app/services/app-state.service';
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
  levelName?: string;
}

export const ROUTES = [
  {
    path: '/dashboard/investment',
    title: 'Inversión',
    isForAdmin: false
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

  userRole: string;
  selectedItem: RouteInfo;
  selectedSubItem: RouteInfo;

  constructor(
    private router: Router,
    private userService: UserService,
    private usersMngmtService: UsersMngmtService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
  ) { }

  async ngAfterViewInit() {
    this.userIsAdmin = this.userService.isAdmin();
    this.userRole = this.userService.user.role_name;

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    if (this.userRole === 'admin' || this.userRole === 'hp' || this.userRole === 'country') {
      await this.getAvailableCountries();
    } else if (this.userRole === 'retailer') {
      const newMenuItems = await this.getAvailableRetailers();
      this.menuItems = [... this.menuItems, ...newMenuItems];
    }

    // Admin routes
    const menuItem = {
      path: '/dashboard/users',
      title: 'Administrar usuarios',
      isForAdmin: true
    }
    this.menuItems.push(menuItem);
    this.appStateService.updateSidebarData(this.menuItems);

    this.getPrevSelection();
  }

  ngOnInit() { }

  async getPrevSelection() {
    const params = this.route.snapshot.queryParams;

    if (params['country'] || params['retailer']) {
      const country = params['country'];
      const retailer = params['retailer'];

      if (country) {
        const item = this.menuItems.find(item => item.levelName === 'country' && item.title.toLowerCase() === country);
        this.selectedItem = item;

        if (retailer) {
          this.selectedItem.submenu = await this.getAvailableRetailers();
          this.selectedItem.submenuOpen = !this.selectedItem.submenuOpen;

          const subItem = this.selectedItem.submenu.find(item => item.levelName === 'retailer' && item.title.toLocaleLowerCase() === retailer);
          this.selectedSubItem = subItem;
        }

      } else if (retailer) {
        const item = this.menuItems.find(item => item.levelName === 'retailer' && item.title.toLowerCase() === retailer);
        this.selectedItem = item;
      }
    }
    else {
      const item = this.menuItems.find(item => item.path == this.router.url);
      this.selectedItem = item;
    }
  }

  getAvailableCountries() {
    this.menuReqStatus = 1;

    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((resp: any[]) => {
        for (let country of resp) {
          const menuItem = {
            path: `/dashboard/country`,
            title: country.name,
            param: country.name.toLowerCase(),
            isForAdmin: false,
            submenu: [],
            submenuOpen: false,
            levelName: 'country',
          }

          this.menuItems.push(menuItem);
        }
        this.appStateService.updateSidebarData(this.menuItems);
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

  getAvailableRetailers() {
    this.menuReqStatus = 1;
    // add country as a param in the requests sería opcional
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((retailers: any[]) => {
        let menuItems: RouteInfo[];
        menuItems = retailers.map(item => {
          return {
            path: '/dashboard/retailer',
            param: item.name.toLowerCase(),
            title: item.name,
            isForAdmin: false,
            levelName: 'retailer',
          }
        })

        this.menuReqStatus = 2;
        return menuItems;
      })
      .catch(error => {
        console.error(`[sidebar.component]: ${error}`);
        this.menuReqStatus = 3;
        throw (new Error(error));
      });
  }

  async selectItem(item, parent?) {
    if (item.submenu && item.levelName === 'country') {
      // if country already has a a submenu.lenght>1 avoid this requests
      item.submenu = await this.getAvailableRetailers();
      item.submenuOpen = !item.submenuOpen;
    }

    let queryParams;

    if (!parent) {
      this.selectedItem !== item && delete this.selectedSubItem;
      this.selectedItem = item;

      queryParams = { [this.selectedItem.levelName]: this.selectedItem.param };

    } else {
      this.selectedItem = parent;
      this.selectedSubItem = item;

      queryParams = {
        [this.selectedItem.levelName]: this.selectedItem.param,
        [this.selectedSubItem.levelName]: this.selectedSubItem.param
      };
    }

    if (item.path) {
      if (item.param) {
        this.router.navigate([item.path], { queryParams: queryParams });
      } else {
        this.router.navigate([item.path]);
      }
    }

    // consider the possibility to add id property
    switch (item.levelName) {
      case 'country':
        this.appStateService.selectCountry(this.selectedItem.title);
        this.appStateService.selectRetailer();
        break;

      case 'retailer':
        if (this.userRole === 'retailer') {
          this.appStateService.selectCountry();
          this.appStateService.selectRetailer(this.selectedItem.title);
        } else {
          this.appStateService.selectCountry(this.selectedItem.title);
          this.appStateService.selectRetailer(this.selectedSubItem.title);
        }
        break;

      default:
        this.appStateService.selectCountry();
        this.appStateService.selectRetailer();
    }
  }

  logout() {
    this.userService.logout();
  }
}
