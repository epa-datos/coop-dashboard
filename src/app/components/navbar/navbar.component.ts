import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { AppStateService } from 'src/app/services/app-state.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public focus;
  public listTitles: any[] = [];
  public location: Location;
  public user: User;
  public customTitle: string;
  public customSubtitle: string;
  public routes: any[] = [];

  public sidebarSub: Subscription;
  public countrySub: Subscription;
  public retailerSub: Subscription;

  constructor(
    location: Location,
    private userService: UserService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.user = this.userService.user;

    if (this.appStateService.selectedCountry) {
      this.customTitle = this.appStateService.selectedCountry.name;
    }
    if (this.appStateService.selectedRetailer && this.user.role_name !== 'retailer') {
      this.customSubtitle = this.appStateService.selectedRetailer.name;
    } else if (this.appStateService.selectedRetailer) {
      this.customTitle = this.appStateService.selectedRetailer.name;
    }

    // sidebar titles
    this.sidebarSub = this.appStateService.sidebarData$.subscribe(resp => {
      this.routes = resp;
      this.listTitles = this.routes.filter(listTitle => listTitle);
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    })

    // custom title
    this.countrySub = this.appStateService.selectedCountry$.subscribe(resp => {
      this.customTitle = resp?.name ? resp?.name : undefined;
      // this.customizeTitle();
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });

    // custom subtitle
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(resp => {
      if (this.userService.user.role_name === 'retailer') {
        this.customTitle = resp?.name ? resp?.name : undefined;
      } else {
        this.customSubtitle = resp?.name ? resp?.name : undefined;
      }
      // this.customizeTitle();
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });
  }

  getTitlesByParams() {
    const params = this.route.snapshot.queryParams;
    if (params['country'] || params['retailer']) {
      this.customTitle = params['country'];
      this.customSubtitle = params['retailer'];
      this.customizeTitle();
    }
  }

  getTitleByRoute() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }

      if (titlee.includes(this.listTitles[item].path)) {
        return this.listTitles[item].title
      }
    }
    return 'Dashboard';
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

  ngOnDestroy() {
    this.sidebarSub.unsubscribe();
    this.countrySub.unsubscribe();
    this.retailerSub.unsubscribe();
  }
}
