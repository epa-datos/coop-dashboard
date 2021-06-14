import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  focus;
  listTitles: any[] = [];
  location: Location;
  user: User;
  customTitle: string;
  customSubtitle: string;
  routes: any[] = [];
  currentRoute;

  sidebarSub: Subscription;
  routeSub: Subscription;

  mainRegionSub: Subscription;
  countrySub: Subscription;
  retailerSub: Subscription;

  newMainRegion;
  newCountry;
  newRetailer;

  mainRegionInit: boolean = true;
  countryInit: boolean = true;
  retailerInit: boolean = true;

  lang;

  constructor(
    location: Location,
    private userService: UserService,
    private appStateService: AppStateService,
    private router: Router,
    private translate: TranslateService,
    private localService: LocaleService
  ) {
    this.location = location;

    const selectedLang = localStorage.getItem('lang') || 'es';

    translate.setDefaultLang('es');
    translate.use(selectedLang);

    this.appStateService.selectLang(selectedLang);
  }

  ngOnInit() {
    this.lang = localStorage.getItem('lang') || 'es';
    this.user = this.userService.user;

    this.newRetailer = this.appStateService.selectedRetailer;
    this.newCountry = this.appStateService.selectedCountry;
    this.newMainRegion = this.appStateService.selectedMainRegion;

    // sidebar titles
    this.sidebarSub = this.appStateService.sidebarData$.subscribe(resp => {
      this.routes = resp;
      this.listTitles = this.routes.filter(listTitle => listTitle);
      this.loadCustomTitles(this.router.url);
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    })

    // custom title
    this.mainRegionSub = this.appStateService.selectedMainRegion$.subscribe(resp => {
      this.newMainRegion = resp;
      this.mainRegionInit && this.loadCustomTitles(this.router.url);
      this.mainRegionInit = false;
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });

    // custom title
    this.countrySub = this.appStateService.selectedCountry$.subscribe(resp => {
      this.newCountry = resp;
      this.countryInit && this.loadCustomTitles(this.router.url);
      this.countryInit = false;
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });

    // custom subtitle
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(resp => {
      this.newRetailer = resp;
      this.retailerInit && this.loadCustomTitles(this.router.url);
      this.retailerInit = false;
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loadCustomTitles(event.url);
        }
      });
  }

  loadCustomTitles(currentUrl: string) {
    const newMenuItem = this.listTitles.find(title => title.path === currentUrl);

    if (newMenuItem) {
      // applies for simple options of menu (without submenu property)
      this.customTitle = newMenuItem.title;
      this.customSubtitle && delete this.customSubtitle;
    } else {

      // applies for menu options with submenus
      for (let item of this.listTitles) {
        if (item.submenu) {
          const newSubMenuItem = item.submenu.find(title => title.path === currentUrl);
          if (newSubMenuItem) {
            this.customTitle = item.title;
            this.customSubtitle && delete this.customSubtitle;
          }
        }
      }

      if (this.newRetailer?.id) {
        if (this.userService.user.role_name === 'retailer') {
          this.customTitle = this.newRetailer?.name;
        } else {
          this.customTitle = this.newCountry?.name;
          this.customSubtitle = this.newRetailer?.name;
        }
      } else if (this.newCountry?.id) {
        this.customTitle = this.newCountry?.name;
        this.customSubtitle && delete this.customSubtitle;
      } else if (this.newMainRegion?.name) {
        this.customTitle = this.newMainRegion?.name;
        this.customSubtitle && delete this.customSubtitle;
      } else {
        this.customTitle && delete this.customTitle;
        this.customSubtitle && delete this.customSubtitle;
      }
    }
  }

  getTitleByRoute() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === title) {
        return this.listTitles[item].title;
      }

      if (title.includes(this.listTitles[item].path)) {
        return this.listTitles[item].title
      }
    }
    return 'dashboard';
  }

  customizeTitle() {
    // useful for retailer role
    if (!this.customTitle && this.customSubtitle) {
      this.customTitle = this.customSubtitle;
      delete this.customSubtitle;
    }
  }

  logout() {
    this.userService.logout();
  }

  changeLang(lang) {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    const selectedLang = localStorage.getItem('lang') || 'es';

    this.translate.use(selectedLang);
    this.appStateService.selectLang(lang);

    this.localService.registerCulture(selectedLang);
    window.location.reload();
  }

  ngOnDestroy() {
    this.sidebarSub?.unsubscribe();
    this.mainRegionSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }
}
