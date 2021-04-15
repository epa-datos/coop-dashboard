import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserService } from 'src/app/services/user.service';

declare interface RouteInfo {
  id?: number,
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
export class SidebarComponent implements OnInit {

  public userRole: string;
  public userIsAdmin: boolean;

  public menuItems: any[];
  public selectedItem: RouteInfo;
  public selectedSubItem: RouteInfo;
  public menuReqStatus: number = 0;
  public submenuReqStatus: number = 0;
  public isCollapsed = true;


  constructor(
    private router: Router,
    private userService: UserService,
    private usersMngmtService: UsersMngmtService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit() {
    this.userIsAdmin = this.userService.isAdmin();
    this.userRole = this.userService.user.role_name;

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    try {
      this.menuReqStatus = 1;
      if (this.userRole === 'admin' || this.userRole === 'hp' || this.userRole === 'country') {
        await this.getAvailableCountries();
      } else if (this.userRole === 'retailer') {
        const newMenuItems = await this.getAvailableRetailers();
        this.menuItems = [... this.menuItems, ...newMenuItems];
      }
      this.menuReqStatus = 2;

    } catch (error) {
      this.menuReqStatus = 3;
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

  async getPrevSelection() {
    const params = this.route.snapshot.queryParams;

    if (params['country'] || params['retailer']) {
      const country = params['country'];
      const retailer = params['retailer'];

      if (country) {
        const item = this.menuItems.find(item => item.levelName === 'country' && item.title.toLowerCase() === country);
        this.selectedItem = item;

        if (retailer) {
          this.selectedItem.submenu = await this.getAvailableRetailers(this.selectedItem.id);
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
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((resp: any[]) => {
        for (let country of resp) {
          const menuItem = {
            id: country.id,
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
      })
      .catch(error => {
        const errMsg = error?.error?.message ? error.error.message : error?.message;
        this.router.navigate(['dashboard/investment']);
        console.error(`[sidebar.component]: ${errMsg}`);
        throw (new Error(errMsg));
      });
  }

  getAvailableRetailers(countryID?: number) {
    this.submenuReqStatus = 1;

    return this.usersMngmtService.getRetailers(countryID)
      .toPromise()
      .then((retailers: any[]) => {
        let menuItems: RouteInfo[];
        menuItems = retailers.map(item => {
          return {
            id: item.id,
            path: '/dashboard/retailer',
            param: item.name.toLowerCase(),
            title: item.name,
            isForAdmin: false,
            levelName: 'retailer',
          }
        })

        this.submenuReqStatus = 2;
        return menuItems;
      })
      .catch(error => {
        const errMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[sidebar.component]: ${errMsg}`);
        this.submenuReqStatus = 3;
        throw (new Error(errMsg));
      });
  }

  async selectItem(item, parent?) {
    if (item.submenu && item.levelName === 'country') {
      if (item.submenu.length < 1) {
        item.submenu = await this.getAvailableRetailers(item.id);
      }
      item.submenuOpen = !item.submenuOpen;
    }

    let queryParams;

    if (!parent) {
      // delete subitem if another item is selected
      this.selectedItem !== item && delete this.selectedSubItem;

      // save selected item
      this.selectedItem = item;

      // delete subitem if item is closed with a click
      (!this.selectedItem.submenuOpen && this.selectedSubItem) && delete this.selectedSubItem;

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

    switch (item.levelName) {
      case 'country':
        this.appStateService.selectCountry({ id: this.selectedItem.id, name: this.selectedItem.title });
        this.appStateService.selectRetailer();
        break;

      case 'retailer':
        if (this.userRole === 'retailer') {
          this.appStateService.selectCountry();
          this.appStateService.selectRetailer({ id: this.selectedItem.id, name: this.selectedItem.title });
        } else {
          this.appStateService.selectCountry({ id: this.selectedItem.id, name: this.selectedItem.title });
          this.appStateService.selectRetailer({ id: this.selectedSubItem.id, name: this.selectedSubItem.title });
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
