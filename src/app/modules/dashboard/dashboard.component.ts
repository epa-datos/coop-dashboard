import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  title: string;
  showFilters: boolean;

  routeSub: Subscription;
  translateSub: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.routeSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadContent(event.url);
      }
    })

    this.translateSub = translate.stream('dashboard').subscribe(() => {
      this.loadContent(this.router.url);
    });
  }

  ngOnInit(): void { }

  loadContent(route: string) {
    this.showFilters = true;

    const path = route.replace('/dashboard/', '').split('?')[0];
    switch (path) {
      case 'main-region':
        this.title = this.translate.instant('dashboard.overview');
        break;

      case 'country':
        this.title = this.translate.instant('dashboard.overviewCountry');
        break;

      case 'retailer':
        this.title = this.translate.instant('dashboard.overviewRetailer');
        break;

      case 'tools':
        this.title = this.translate.instant('dashboard.otherTools');
        break;

      case 'omnichat':
        this.title = this.translate.instant('dashboard.feelingsAnalysis');
        break;

      default:
        delete this.title;
        this.showFilters = false;
        break;
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
