import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { AppStateService } from 'src/app/services/app-state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[] = [];
  public location: Location;
  public user: User;
  public customTitle: string;
  public customSubtitle: string;
  public routes: any[] = [];


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

    this.getTitlesByParams();

    // sidebar titles
    this.appStateService.sidebarData$.subscribe(resp => {
      this.routes = resp;
      this.listTitles = this.routes.filter(listTitle => listTitle);
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    })

    // custom title
    this.appStateService.selectedCountry$.subscribe(resp => {
      this.customTitle = resp?.name;
      this.customizeTitle();
    }, error => {
      console.error(`[navbar.component]: ${error}`);
    });

    // custom subtitle
    this.appStateService.selectedRetailer$.subscribe(resp => {
      this.customSubtitle = resp?.name;
      this.customizeTitle();
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
    if (!this.customTitle && this.customSubtitle) {
      this.customTitle = this.customSubtitle;
      delete this.customSubtitle;
    }
  }

  logout() {
    this.userService.logout();
  }
}
