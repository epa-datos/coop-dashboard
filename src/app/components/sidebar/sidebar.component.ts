import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Country, MainRegion, Retailer } from 'src/app/models/access-levels';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { AppStateService } from 'src/app/services/app-state.service';
import { UserService } from 'src/app/services/user.service';

declare interface RouteInfo {
  id?: number,
  title: string;
  path?: string;
  paramName?: string;
  param?: any;
  submenu?: RouteInfo[];
  submenuOpen?: boolean;
  class?: string;
  icon?: string;
  isParentOf?: string;
  isForAdmin?: boolean;
}

export const ROUTES = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

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

  public selectedMainRegionName;
  public selectedCountryID;
  public selectedRetailerID;

  public countries: Country[] = [];
  public retailers: Retailer[] = [];

  public mainRegionSub: Subscription;
  public countrySub: Subscription;
  public retailerSub: Subscription;
  public translateSub: Subscription;
  public routeSub: Subscription;
  public userAvatarSub: Subscription;

  public userAvatarUrl: string;
  public userAvatarUrlBroken: boolean;

  // NOTE: Country and Retailer selection
  // When a retailer is selected, the country its belong to is also selected
  // for that reason, whenever a new selection is emitted involving both, 
  // the retailer's selection is emitted first followed by the country's selection
  // in order that the observables in the components first listen to the changes of the selected retailer 
  // and if there isn't a retailer, listen to the changes of the selected country

  constructor(
    private router: Router,
    private userService: UserService,
    private usersMngmtService: UsersMngmtService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {

    this.translateSub = translate.stream('dashboard').subscribe(() => {
      this.loadI18nMenuItems(this.menuItems);
    });
  }

  async ngOnInit() {
    this.userIsAdmin = this.userService.isAdmin();
    this.userRole = this.userService.user.role_name;

    // user avatar url
    this.userAvatarUrl = this.userService.user.avatar_url;

    this.userAvatarSub = this.userService.userAvatarUrl$.subscribe((newUrl: string) => {
      this.userAvatarUrlBroken = this.userAvatarUrlBroken && false;
      this.userAvatarUrl = newUrl;
    });

    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });

    this.mainRegionSub = this.appStateService.selectedMainRegion$.subscribe(mainRegion => {
      this.selectedMainRegionName = mainRegion?.name ? mainRegion.name : undefined;
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.selectedCountryID = country?.id ? country.id : undefined;
    });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.selectedRetailerID = retailer?.id ? retailer.id : undefined;
    });

    // clear all selections for /dashboard/home
    this.routeSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // clear selections
        if (event.url === '/dashboard/home') {
          this.selectedItemL1 && delete this.selectedItemL1;
          this.selectedItemL2 && delete this.selectedItemL2;
          this.selectedItemL3 && delete this.selectedItemL3;
          this.selectedItemL4 && delete this.selectedItemL4;

          this.appStateService.selectRetailer();
          this.appStateService.selectCountry();
          this.appStateService.selectMainRegion();

          this.closeAllSubmenus(this.menuItems);
        }
      }
    });

    try {
      this.menuReqStatus = 1;
      if (this.userRole === 'admin' || this.userRole === 'hp' || this.userRole === 'country') {

        // load LATAM menu items
        this.userService.viewLevel === 'latam' && this.loadLatamSubmenu();

        // load countries menu items
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
      title: this.translate.instant('dashboard.campaignComparator'),
      path: '/dashboard/campaign-comparator',
    }
    this.menuItems.push(menuItem1);

    // Admin routes
    const menuItem2 = {
      id: 'admin',
      title: this.translate.instant('dashboard.manager'),
      submenu: [
        {
          title: this.translate.instant('general.users'),
          path: '/dashboard/users',
        },
        {
          title: this.translate.instant('dashboard.activityRegister'),
          path: '/dashboard/users/activity-register',
        }
      ],
      isForAdmin: true
    }
    this.menuItems.push(menuItem2);

    this.appStateService.updateSidebarData(this.menuItems);

    this.getPrevSelection();
  }

  loadLatamSubmenu() {
    const menuItem = {
      title: 'LATAM',
      submenu: [
        {
          title: 'Programa COOP',
          path: '/dashboard/main-region',
          paramName: 'main-region',
          param: 'latam'
        },
        {
          title: 'Otras herramientas',
          path: '/dashboard/tools',
          paramName: 'main-region',
          param: 'latam'
        },
        {
          title: 'Análisis de sentimientos OmniChat',
          path: '/dashboard/omnichat',
          paramName: 'main-region',
          param: 'latam'
        }
      ],
      submenuOpen: false
    }
    this.menuItems.push(menuItem);
  }

  async getPrevSelection() {
    const baseUrl = this.router.url.split('?')[0];
    this.appStateService.selectedPage = this.getPageUsingRoute(baseUrl);

    const params = this.route.snapshot.queryParams;

    const mainRegion = params['main-region'];
    const region = params['region'];
    const country = params['country'];
    const retailer = params['retailer'];

    if (region) {
      const itemL1 = this.menuItems.find(item => item.title.toLowerCase() === region);
      this.selectedItemL1 = itemL1;
      this.selectedItemL1.submenuOpen = true;

      let itemL2 = this.selectedItemL1.submenu.find(item => item.param === country);
      this.selectedItemL2 = itemL2;
      this.selectedItemL2.submenuOpen = true;

      !retailer && this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL2, 'country'));

      const retailersList = await this.getAvailableRetailers(this.selectedItemL2.id);
      this.selectedItemL2.submenu = [... this.selectedItemL2.submenu, ...retailersList];

      if (retailer) {
        this.selectedItemL3 = this.selectedItemL2.submenu.find(item => item.title.toLocaleLowerCase() === retailer.replaceAll('-', ' '));
        this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL3, 'retailer'));
        this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL2, 'country'));
        this.selectedItemL3.submenuOpen = true;

        this.selectedItemL4 = this.getSelectionUsingRoute(this.selectedItemL3);


      } else {
        this.selectedItemL3 = this.getSelectionUsingRoute(this.selectedItemL2);
      }

      // country && country !== 'latam'
    } else if (country) {
      this.selectedItemL1 = this.menuItems.find(item => item.param === country);

      const defaultSubmenu = this.addDefaultSubmenuToCountry({ name: this.selectedItemL1.param.replaceAll('-', ' ') });
      const retailersList = await this.getAvailableRetailers(this.selectedItemL1.id);

      this.selectedItemL1.submenu = [...defaultSubmenu, ...retailersList];
      this.selectedItemL1.submenuOpen = true;
      !retailer && this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL1, 'country'));

      if (retailer) {
        const itemL2 = this.selectedItemL1.submenu.find(item => item.title.toLocaleLowerCase() === retailer.replaceAll('-', ' '));
        this.selectedItemL2 = itemL2;
        this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL2, 'retailer'));
        this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL1, 'country'));

        const itemL3 = this.getSelectionUsingRoute(this.selectedItemL2);
        if (itemL3) {
          this.selectedItemL2.submenuOpen = true;
          this.selectedItemL3 = itemL3;
        }
      } else {
        const itemL2 = this.getSelectionUsingRoute(this.selectedItemL1);
        this.selectedItemL2 = itemL2;
      }

    } else if (mainRegion && mainRegion === 'latam') {
      this.selectedItemL1 = this.menuItems.find(item => item.title.toLowerCase() === mainRegion);
      this.selectedItemL1.submenuOpen = true;
      this.selectedItemL2 = this.getSelectionUsingRoute(this.selectedItemL1);
      this.appStateService.selectMainRegion({ id: this.selectedItemL1.id, name: this.selectedItemL1.title });

    } else if (retailer) {
      const item = this.menuItems.find(item => item.title.toLowerCase() === retailer.replaceAll('-', ' '));
      this.selectedItemL1 = item;
      this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL1, 'retailer'));
      this.appStateService.selectCountry();

      const itemL2 = this.getSelectionUsingRoute(this.selectedItemL1);
      if (itemL2) {
        this.selectedItemL1.submenuOpen = true;
        this.selectedItemL2 = itemL2;
      }

    } else {
      const item = this.menuItems.find(item => item.path == this.router.url);
      if (item) {
        this.selectedItemL1 = item;
      } else {
        // applies for menu options with submenus
        for (let item of this.menuItems) {
          if (item.submenu) {
            let newSubMenuItem = item.submenu.find(title => title.path === this.router.url);
            if (newSubMenuItem) {
              this.selectedItemL1 = item;
              this.selectedItemL1.submenuOpen = true;

              this.selectedItemL2 = newSubMenuItem;
            }
          }
        }
      }

      this.appStateService.selectRetailer();
      this.appStateService.selectCountry();
    }
  }

  getSelectionUsingRoute(selectedItem): RouteInfo {
    const currentPath = this.router.url.split('?')[0];
    const selectedSubItem = selectedItem.submenu.find(item => item.path === currentPath);
    return selectedSubItem;
  }

  getPageUsingRoute(url: string): 'overview' | 'other-tools' | 'other' {
    const path = url.replace('/dashboard/', '');

    let page;

    switch (path) {
      case 'main-region':
      case 'country':
      case 'retailer':
        page = 'overview';
        break;

      case 'tools':
        page = 'other-tools';
        break

      default:
        page = 'others';
        break;
    }

    return page;
  }

  getAvailableCountries() {
    return this.usersMngmtService.getCountries()
      .toPromise()
      .then((countries: any[]) => {

        this.countries = countries;

        let menuItems = [];
        const countriesWithoutRegion = countries.filter(c => !c.region);
        const countriesWithRegion = countries.filter(c => c.region);

        const { regionsNames, regions } = this.groupCountriesByRegion(countriesWithRegion);

        // menu items for countriesWithoutRegion
        for (let country of countriesWithoutRegion) {
          const submenu = this.addDefaultSubmenuToCountry(country);
          const menuItem = {
            id: country.id,
            title: country.name,
            paramName: 'country',
            param: country.name.toLowerCase().replaceAll(' ', '-'),
            submenu: submenu,
            submenuOpen: false,
            isParentOf: 'countries'
          }

          menuItems.push(menuItem);
        }

        // menu items for countriesWithRegion
        for (let region of regionsNames) {
          const submenuCountries = [];
          for (let country of regions[region]) {
            const submenu = this.addDefaultSubmenuToCountry(country);
            const menuItem = {
              id: country.id,
              title: country.name,
              param: country.name.toLowerCase().replaceAll(' ', '-'),
              paramName: 'country',
              submenu: submenu,
              submenuOpen: false,
              isParentOf: 'countries'
            }

            submenuCountries.push(menuItem);
          }

          const menuItem = {
            title: region,
            param: region.toLowerCase().replaceAll(' ', '-'),
            paramName: 'region',
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
        // this.appStateService.updateSidebarData(this.menuItems);
      })
      .catch(error => {
        const errMsg = error?.error?.message ? error.error.message : error?.message;
        console.error(`[sidebar.component]: ${errMsg}`);
        throw (new Error(errMsg));
      });
  }

  addDefaultSubmenuToCountry(country): RouteInfo[] {
    const submenu = [
      {
        title: this.translate.instant('general.coop'),
        path: '/dashboard/country',
        paramName: 'country',
        param: country.name.toLowerCase().replaceAll(' ', '-')
      },
      {
        title: this.translate.instant('dashboard.otherTools'),
        path: '/dashboard/tools',
        paramName: 'country',
        param: country.name.toLowerCase().replaceAll(' ', '-')
      }
    ]

    return submenu;
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

        if (!countryID) {
          this.retailers = retailers;
        } else {
          this.updateRetailersList(retailers);
        }

        let menuItems: RouteInfo[];
        menuItems = retailers.map(item => {
          const submenu = [
            {
              title: this.translate.instant('general.coop'),
              path: '/dashboard/retailer',
              paramName: 'retailer',
              param: item.name.toLowerCase().replaceAll(' ', '-')
            }
          ];

          if (item.indexed || item.omnichat || item.pc_selector) {
            submenu.push({
              title: this.translate.instant('dashboard.otherTools'),
              path: '/dashboard/tools',
              paramName: 'retailer',
              param: item.name.toLowerCase().replaceAll(' ', '-')
            });
          }
          return {
            id: item.id,
            title: item.name,
            submenu,
            submenuOpen: false,
            isParentOf: 'retailers'
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

  updateRetailersList(newRetailers: any[]) {
    for (let newRetailer of newRetailers) {
      if (!this.retailers.find(retailer => retailer.id === newRetailer.id)) {
        this.retailers.push(newRetailer);
      }
    }
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
      if (!item.isParentOf) {
        this.selectedItemL1 = grandparent;
        this.selectedItemL2 = parent;
      }
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
        if (item.isParentOf !== 'countries' && item.isParentOf !== 'countriesByRegion' && item.title.toLowerCase() !== 'latam') {
          this.selectedItemL1 = item;
        }
      }
    }

    item.path && this.redirectToSelectedItem(item);

    if (!item.isParentOf && item.title.toLowerCase() !== 'latam' && item.id !== 'admin') {
      this.emitNewSelection(item);
    }
  }

  redirectToSelectedItem(item) {
    let queryParams;

    if (item.paramName == 'retailer') {
      if (this.selectedItemL1.param) {
        // if a retailer (item) inside a country (selectedItemL2) inside a region (selectedItemL1) is selected
        // add region, country and retailer queries param if region exists
        if (this.selectedItemL1.paramName === 'region') {
          queryParams = {
            [this.selectedItemL1.paramName]: this.selectedItemL1.param,
            [this.selectedItemL2.paramName]: this.selectedItemL2.param,
            [item.paramName]: item.param
          };
        } else {
          // if region not exists
          // add country and retailer query param
          queryParams = {
            [this.selectedItemL1.paramName]: this.selectedItemL1.param,
            [item.paramName]: item.param
          };
        }

      } else if (this.selectedItemL2.param) {
        // if a option inside a retailer (selectedItemL2) is selected (users with retailer role)
        // add region as query param
        queryParams = {
          [this.selectedItemL2.paramName]: this.selectedItemL2.param
        };
      }
    } else {
      // if an country option (item) inside a region (selectedItemL1) is selected
      // add region and country as query params
      if (this.selectedItemL1.paramName === 'region') {
        queryParams = {
          [this.selectedItemL1.paramName]: this.selectedItemL1.param,
          [item.paramName]: item.param
        };
      } else {
        // if other option is selected
        queryParams = { [item.paramName]: item.param };
      }
    }

    if (item.param) {
      this.router.navigate([item.path], { queryParams });
    } else {
      this.router.navigate([item.path]);
    }
  }

  emitNewSelection(item) {
    if (item?.path) {
      this.appStateService.selectedPage = this.getPageUsingRoute(item?.path);
    }

    switch (item.paramName) {
      case 'main-region':
        if (this.selectedItemL2.param && item.param === 'latam' && this.selectedMainRegionName !== this.selectedItemL1.title) {
          this.appStateService.selectRetailer();
          this.appStateService.selectCountry();
          this.appStateService.selectMainRegion(this.createSelectedItem(this.selectedItemL1, 'main-region'));
        }
        break;
      case 'country':
        if (this.userRole !== 'retailer') {
          this.appStateService.selectRetailer();

          if (this.selectedItemL1.param && this.selectedItemL1.paramName !== 'region') {
            // When a country is selectedItemL1
            if (this.selectedCountryID !== this.selectedItemL1.id)
              this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL1, 'country'));
          } else if (this.selectedItemL2.param) {
            // When a country is selectedItemL2 (There is a region value in selectedItemL1)

            if (this.selectedCountryID !== this.selectedItemL2.id)
              this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL2, 'country'));
          }
          this.appStateService.selectMainRegion();
        }
        break;

      case 'retailer':
        if (this.userRole === 'retailer') {
          if (this.selectedRetailerID !== this.selectedItemL1.id) {
            this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL1, 'retailer'));
          }
          this.appStateService.selectCountry();

        } else {
          if (this.selectedItemL1.param && this.selectedItemL1.paramName !== 'region') {
            // When a country is selectedItemL1
            if (this.selectedRetailerID !== this.selectedItemL2.id) {
              this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL2, 'retailer'));
            }

            if (this.selectedCountryID !== this.selectedItemL1.id) {
              this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL1, 'country'));
            }
          } else if (this.selectedItemL2.param) {
            if (this.selectedRetailerID !== this.selectedItemL3.id) {
              this.appStateService.selectRetailer(this.createSelectedItem(this.selectedItemL3, 'retailer'));
            }

            // When a country is selectedItemL2 (There is a region value in selectedItemL1)
            if (this.selectedCountryID !== this.selectedItemL2.id) {
              this.appStateService.selectCountry(this.createSelectedItem(this.selectedItemL2, 'country'));
            }
          }
          this.appStateService.selectMainRegion();
        }
        break;

      default:
        this.appStateService.selectRetailer();
        this.appStateService.selectCountry();
        this.appStateService.selectMainRegion();
    }
  }

  createSelectedItem(item: RouteInfo, itemType: 'main-region' | 'country' | 'retailer') {
    if (itemType === 'main-region') {
      return { id: item.id, name: item.title };
    }

    if (itemType === 'country') {
      const selectedCountry: any = { ...this.countries.find(country => country.id === item.id) };
      return selectedCountry;
    }

    if (itemType === 'retailer') {
      const selectedRetailer: any = { ...this.retailers.find(retailer => retailer.id === item.id) };
      return selectedRetailer;
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

  loadI18nMenuItems(menuItems) {
    if (!menuItems) {
      return;
    }
    for (let item of menuItems) {
      this.loadTitles(item);
      if (item.submenu) {
        this.loadI18nMenuItems(item.submenu)
      }

      if (item.id === 'admin') {
        item.title = this.translate.instant('dashboard.manager');
      }
    }
  }

  loadTitles(item) {
    const path = item.path?.split('/dashboard/')[1];

    if (!path) {
      return;
    }

    switch (path) {
      case 'main-region':
      case 'country':
      case 'retailer':
        item.title = this.translate.instant('general.coop');
        break;
      case 'tools':
        item.title = this.translate.instant('dashboard.otherTools');
        break;
      case 'omnichat':
        item.title = this.translate.instant('dashboard.feelingsAnalysis');
        break;
      case 'campaign-comparator':
        item.title = this.translate.instant('dashboard.campaignComparator');
        break;
      case 'users':
        item.title = this.translate.instant('general.users');
        break;
      case 'users/activity-register':
        item.title = this.translate.instant('dashboard.activityRegister');
        break;
    }
  }

  closeAllSubmenus(menu) {
    for (let item of menu) {
      if (item.submenu && item.submenuOpen) {
        item.submenuOpen = false;
        this.closeAllSubmenus(item.submenu);
      }
    }
  }

  ngOnDestroy() {
    this.translateSub?.unsubscribe();
    this.mainRegionSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.routeSub?.unsubscribe();
    this.userAvatarSub?.unsubscribe();

    this.appStateService.selectCountry();
    this.appStateService.selectRetailer();
  }
}
