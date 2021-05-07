import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserService } from 'src/app/services/user.service';

declare interface RouteInfo {
  id?: number,
  title: string;
  path?: string;
  paramName?: string;
  param?: string | number;
  submenu?: RouteInfo[];
  submenuOpen?: boolean;
  class?: string;
  icon?: string;
  isParentOf?: string;
  isForAdmin: boolean;
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
  public selectedItemL4: RouteInfo;

  public menuReqStatus: number = 0;
  public submenuReqStatus: number = 0;
  public isCollapsed = true;

  public selectedCountryID;
  public selectedRetailerID;

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

    this.appStateService.selectedCountry$.subscribe(country => {
      this.selectedCountryID = country?.id ? country.id : undefined;
    });
    this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.selectedRetailerID = retailer?.id ? retailer.id : undefined;
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


    // Other routes
    const menuItem1 = {
      // path: '',
      title: 'Comparador de campaña',
      isForAdmin: false
    }
    this.menuItems.push(menuItem1);
    this.appStateService.updateSidebarData(this.menuItems);

    // Admin routes
    const menuItem2 = {
      title: 'Administrar usuarios',
      path: '/dashboard/users',
      isForAdmin: true
    }
    this.menuItems.push(menuItem2);
    this.appStateService.updateSidebarData(this.menuItems);


    this.getPrevSelection();
  }

  async getPrevSelection() {
    const params = this.route.snapshot.queryParams;

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

          const itemL3 = this.getSelectionUsingRoute(this.selectedItemL2);
          if (itemL3) {
            this.selectedItemL2.submenuOpen = true;
            this.selectedItemL3 = itemL3;
          }
        }

      } else if (retailer) {
        const item = this.menuItems.find(item => item.paramName === 'retailer' && item.title.toLowerCase() === retailer);
        this.selectedItemL1 = item;
        this.appStateService.selectCountry();
        this.appStateService.selectRetailer({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });

        const itemL2 = this.getSelectionUsingRoute(this.selectedItemL1);
        if (itemL2) {
          this.selectedItemL1.submenuOpen = true;
          this.selectedItemL2 = itemL2;
        }
      }
    }
    else {
      const item = this.menuItems.find(item => item.path == this.router.url);
      this.selectedItemL1 = item;
      this.appStateService.selectCountry();
      this.appStateService.selectRetailer();
    }
  }


  getSelectionUsingRoute(selectedItem): RouteInfo {
    const currentPath = this.router.url.split('?')[0];
    const selectedSubItem = selectedItem.submenu.find(item => item.paramName === 'retailer' && item.path === currentPath);
    return selectedSubItem;
  }

  getAvailableCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((countries: any[]) => {

        let menuItems = [];
        const countriesWithoutRegion = countries.filter(c => !c.region);
        const countriesWithRegion = countries.filter(c => c.region);

        const { regionsNames, regions } = this.groupCountriesByRegion(countriesWithRegion);

        // menu items for countriesWithoutRegion
        for (let country of countriesWithoutRegion) {
          const submenu = [
            {
              id: 1,
              title: 'Programa COOP',
              path: '/dashboard/country',
              paramName: 'country',
              param: country.name.toLowerCase().replaceAll(' ', '-'),
              isForAdmin: false
            },
            {
              id: 2,
              title: 'Otras herramientas',
              path: '/dashboard/tools',
              paramName: 'country',
              param: country.name.toLowerCase().replaceAll(' ', '-'),
              isForAdmin: false
            }
          ]
          const menuItem = {
            id: country.id,
            title: country.name,
            paramName: 'country',
            param: country.name.toLowerCase().replaceAll(' ', '-'),
            submenu: submenu,
            submenuOpen: false,
            isParentOf: 'countries',
            isForAdmin: false
          }

          menuItems.push(menuItem);
        }

        // menu items for countriesWithRegion
        for (let region of regionsNames) {
          const submenuCountries = [];
          for (let country of regions[region]) {
            const submenu = [
              {
                id: 1,
                title: 'Programa COOP',
                path: '/dashboard/country',
                paramName: 'country',
                param: country.name.toLowerCase().replaceAll(' ', '-'),
                isForAdmin: false,
              },
              {
                id: 2,
                title: 'Otras herramientas',
                path: '/dashboard/tools',
                paramName: 'country',
                param: country.name.toLowerCase().replaceAll(' ', '-'),
                isForAdmin: false,
              }
            ]

            const menuItem = {
              id: country.id,
              title: country.name,
              param: country.name.toLowerCase().replaceAll(' ', '-'),
              paramName: 'country',
              submenu: submenu,
              submenuOpen: false,
              isParentOf: 'countries',
              isForAdmin: false,
            }

            submenuCountries.push(menuItem);
          }

          const menuItem = {
            title: region,
            submenu: submenuCountries,
            submenuOpen: false,
            isParentOf: 'countriesByRegion',
          }
          menuItems.push(menuItem);
        }

        // order regions by name as if they were a country 
        if (regionsNames.length > 0) {
          menuItems = menuItems.sort((a, b) => (a.title < b.title ? -1 : 1));
        }

        this.menuItems = [...this.menuItems, ...menuItems];
        this.appStateService.updateSidebarData(this.menuItems);
      })
      .catch(error => {
        const errMsg = error?.error?.message ? error.error.message : error?.message;
        this.router.navigate(['dashboard/investment']);
        console.error(`[sidebar.component]: ${errMsg}`);
        throw (new Error(errMsg));
      });
  }

  groupCountriesByRegion(countries) {
    const regionsNames = [];
    const regions = countries.reduce((regions, item) => {

      if (!regionsNames.includes(item.region)) {
        regionsNames.push(item.region);
      }

      const region = (regions[item.region] || []);
      region.push(item);
      regions[item.region] = region;
      return regions;
    }, {});

    return {
      regionsNames,
      regions
    }
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
              title: 'Programa COOP',
              path: '/dashboard/retailer',
              paramName: 'retailer',
              param: item.name.toLowerCase().replaceAll(' ', '-'),
              isForAdmin: false
            },
            {
              id: 2,
              title: 'Otras herramientas',
              path: '/dashboard/tools',
              paramName: 'retailer',
              param: item.name.toLowerCase().replaceAll(' ', '-'),
              isForAdmin: false
            }
          ]
          return {
            id: item.id,
            title: item.name,
            submenu,
            submenuOpen: false,
            isParentOf: 'retailers',
            isForAdmin: false,
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

  async selectItem(item, parent?, grandparent?, ggrandparent?, keepMenuOpen?: boolean) {
    if (item.submenu) {
      if (item.submenu.length < 3 && item.isParentOf === 'countries') {
        const newItems = await this.getAvailableRetailers(item.id);
        item.submenu = [...item.submenu, ...newItems];
      }

      if (!keepMenuOpen) {
        item.submenuOpen = !item.submenuOpen;
      }
    }

    if (ggrandparent) {
      // ex. a retailer option (item) inside a retailer (parent) inside a country (grandparent) inside a region (ggrandparent)
      this.selectedItemL1 = ggrandparent;
      this.selectedItemL2 = grandparent;
      this.selectedItemL3 = parent;
      this.selectedItemL4 = item;
    } else if (grandparent) {
      // ex. a retailer option (item) inside a retailer (parent) inside a country (grandparent)
      this.selectedItemL1 = grandparent;
      this.selectedItemL2 = parent;
      if (!item.submenu) {
        this.selectedItemL3 = item;
        this.selectedItemL4 && delete this.selectedItemL4;
      }
    } else if (parent) {
      // ex. a retailer option (item) inside retailer (parent) - view for users with 'retailer' role
      if (this.userRole == 'retailer') {
        this.selectedItemL1 = parent;
        this.selectedItemL2 = item;
      }

      // ex. a country option (item) inside country (parent) - view for users without 'retailer' role
      if (this.userRole !== 'retailer' && !item.submenu) {
        this.selectedItemL1 = parent;
        this.selectedItemL2 = item;
        this.selectedItemL3 && delete this.selectedItemL3;
      }
    } else {
      // options without parent
      if (this.userRole !== 'retailer') {

        // close submenus if item is closed with a click
        if (item.submenu && !item?.submenuOpen) {
          this.closeAllSubMenus(item.submenu);
        }
      }

      // delete all sub sellections
      if (this.selectedItemL1 !== item && !item.submenu) {
        this.selectedItemL2 && delete this.selectedItemL2;
        this.selectedItemL3 && delete this.selectedItemL3;
        this.selectedItemL4 && delete this.selectedItemL4;
      }

      // save selected item
      if (this.userRole !== 'retailer' || (this.userRole === 'retailer' && !item.submenu)) {
        if (item.isParentOf !== 'countries' && item.isParentOf !== 'countriesByRegion') {
          this.selectedItemL1 = item;
        }
      }
    }

    item.path && this.redirectTosSelectedItem(item);

    if (!item.isParentOf) {
      this.emitNewSelection(item);
    }
  }

  redirectTosSelectedItem(item) {
    let queryParams;

    if (item.paramName == 'retailer') {
      if (this.selectedItemL1.param) {
        // When a country is selectedItemL1
        queryParams = {
          [this.selectedItemL1.paramName]: this.selectedItemL1.param,
          [item.paramName]: item.param
        };
      } else if (this.selectedItemL2.param) {
        // When a country is selectedItemL2 (There is a region value in selectedItemL1)
        queryParams = {
          [this.selectedItemL2.paramName]: this.selectedItemL2.param,
          [item.paramName]: item.param
        };
      }
    } else {
      queryParams = { [item.paramName]: item.param };
    }

    if (item.param) {
      this.router.navigate([item.path], { queryParams });
    } else {
      this.router.navigate([item.path]);
    }
  }

  emitNewSelection(item) {
    switch (item.paramName) {
      case 'country':
        if (this.userRole !== 'retailer') {
          // if (this.selectedCountryID !== this.selectedItemL1.id)
          this.appStateService.selectCountry({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
          this.appStateService.selectRetailer();
        }
        break;

      case 'retailer':
        if (this.userRole === 'retailer') {
          this.appStateService.selectCountry();
          // if (this.selectedRetailerID !== this.selectedItemL1.id)
          this.appStateService.selectRetailer({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
        } else {
          // if (this.selectedCountryID !== this.selectedItemL1.id || this.selectedRetailerID !== this.selectedItemL2?.id) {
          this.appStateService.selectCountry({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });
          this.appStateService.selectRetailer({ id: this.selectedItemL2?.id, name: this.selectedItemL2?.title });
          // }
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
