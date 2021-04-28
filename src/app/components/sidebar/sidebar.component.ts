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
  paramName?: string;
}

export const ROUTES = [
  {
    path: '/dashboard/investment',
    title: 'Google Investment',
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
  public selectedItemL1: RouteInfo;
  public selectedItemL2: RouteInfo;
  public selectedItemL3: RouteInfo;
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
    console.log('route', this.router.url)

    if (params['country'] || params['retailer']) {
      const country = params['country'];
      const retailer = params['retailer'];

      if (country) {
        const itemL1 = this.menuItems.find(item => item.paramName === 'country' && item.title.toLowerCase() === country);
        this.selectedItemL1 = itemL1;
        this.appStateService.selectCountry({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });

        if (retailer) {
          this.selectedItemL1.submenu = await this.getAvailableRetailers(this.selectedItemL1.id);
          this.selectedItemL1.submenuOpen = !this.selectedItemL1.submenuOpen;

          const itemL2 = this.selectedItemL1.submenu.find(item => item.paramName === 'retailer' && item.title.toLocaleLowerCase() === retailer);
          this.selectedItemL2 = itemL2;
          this.appStateService.selectRetailer({ id: this.selectedItemL2.id, name: this.selectedItemL2.title });

          const currentPath = this.router.url.split('?')[0];
          const itemL3 = this.selectedItemL2.submenu.find(item => item.paramName === 'retailer' && item.path === currentPath);
          if (itemL3) {
            this.selectedItemL2.submenuOpen = true;
            this.selectedItemL3 = itemL3;
          }
        }

      } else if (retailer) {
        const item = this.menuItems.find(item => item.paramName === 'retailer' && item.title.toLowerCase() === retailer);
        this.selectedItemL1 = item;
        this.appStateService.selectRetailer({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
      }
    }
    else {
      const item = this.menuItems.find(item => item.path == this.router.url);
      this.selectedItemL1 = item;
      this.appStateService.selectCountry();
      this.appStateService.selectRetailer();
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
            paramName: 'country',
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
          const submenu = [
            {
              id: 1,
              path: '/dashboard/retailer',
              param: item.name.toLowerCase(),
              title: 'Proyecto CO-OP',
              isForAdmin: false,
              paramName: 'retailer'
            },
            {
              id: 2,
              path: '/dashboard/tools',
              param: item.name.toLowerCase(),
              title: 'Otras herramientas',
              isForAdmin: false,
              paramName: 'retailer'
            }
          ]
          return {
            id: item.id,
            param: item.name.toLowerCase(),
            title: item.name,
            isForAdmin: false,
            submenu,
            submenuOpen: false,
            paramName: 'retailer',
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

  async selectItem(item, parent?, grandparent?, keepMenuOpen?: boolean) {
    if (item.submenu) {
      if (item.submenu.length < 1 && item.paramName === 'country') {
        item.submenu = await this.getAvailableRetailers(item.id);
      }

      if (!keepMenuOpen) {
        item.submenuOpen = !item.submenuOpen;
      }
    }

    let queryParams;

    if (grandparent || parent) {
      if (grandparent) {
        // Ej. para "proyecto co-op" y "otras herramientas" (item) de un retail (parent) en un país (grandparent)
        this.selectedItemL1 = grandparent;
        this.selectedItemL2 = parent;
        this.selectedItemL3 = item;
      } else if (parent) {
        // Ej. para un retailer (item) en un país (parent)
        // this.selectedItemL1 = parent;
        // se se hace una seleccion aqui puede pasar un bug en el mmomento que se selecciona nombre del retailer de otro pais
      }

      queryParams = {
        [this.selectedItemL1.paramName]: this.selectedItemL1.param,
        [this.selectedItemL2?.paramName]: this.selectedItemL2?.param
      };
    } else {
      // Para opciones que no tienen padre

      // close submenus if item is closed with a click
      if (item.submenu && !item?.submenuOpen) {
        this.closeAllSubMenus(item.submenu);
      }

      // delete all sub sellections 
      // a) if another item is selected
      // b) if item is closed with a click

      if (this.selectedItemL1 !== item || (!this.selectedItemL1.submenuOpen && this.selectedItemL2)) {
        delete this.selectedItemL2;
        delete this.selectedItemL3;
      }

      // save selected item
      this.selectedItemL1 = item;

      queryParams = { [this.selectedItemL1.paramName]: this.selectedItemL1.param };
    }

    if (item.path) {
      if (item.param) {
        this.router.navigate([item.path], { queryParams });
      } else {
        this.router.navigate([item.path]);
      }
    }

    switch (item.paramName) {
      case 'country':
        this.appStateService.selectCountry({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
        this.appStateService.selectRetailer();
        break;

      case 'retailer':
        if (this.userRole === 'retailer') {
          this.appStateService.selectCountry();
          this.appStateService.selectRetailer({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
        } else {
          this.appStateService.selectCountry({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
          this.appStateService.selectRetailer({ id: this.selectedItemL2?.id, name: this.selectedItemL2?.title });
        }
        break;

      default:
        this.appStateService.selectCountry();
        this.appStateService.selectRetailer();
    }
  }

  closeAllSubMenus(submenu: RouteInfo[]) {
    submenu.forEach(element => {
      element.submenuOpen = false;
    });
  }

  logout() {
    this.userService.logout();
  }
}
