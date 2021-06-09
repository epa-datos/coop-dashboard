import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  title: string;
  routeSub: Subscription;
  translateSub: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService
  ) {
    this.routeSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadTitle(event.url);
      }
    })

    this.translateSub = translate.stream('dashboard').subscribe(() => {
      this.loadTitle(this.router.url);
    });
  }

  ngOnInit(): void { }

  loadTitle(route: string) {
    if (route.includes('/dashboard/main-region')) {
      this.title = this.translate.instant('dashboard.overview');
    } else if (route.includes('/dashboard/country')) {
      this.title = this.translate.instant('dashboard.overviewCountry');
    } else if (route.includes('/dashboard/retailer')) {
      this.title = this.translate.instant('dashboard.overviewRetailer');
    } else if (route.includes('/dashboard/tools')) {
      this.title = this.translate.instant('dashboard.otherTools');
    } else if (route.includes('/dashboard/omnichat')) {
      this.title = this.translate.instant('dashboard.feelingsAnalysis');
    } else {
      delete this.title;
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
