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
  printWindowTitle: string;
  showFilters: boolean;
  currentPath: string;

  routeSub: Subscription;
  translateSub: Subscription;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private appStateService: AppStateService
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

    this.currentPath = route.replace('/dashboard/', '').split('?')[0];
    switch (this.currentPath) {
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

    setTimeout(() => {
      this.getPrintTitle();
    }, 1000);
  }


  getPrintTitle() {
    let mainRegionName = this.appStateService.selectedMainRegion?.name;
    let countryName = this.appStateService.selectedCountry?.name;
    let retailerName = this.appStateService.selectedRetailer?.name;

    if (mainRegionName || countryName || retailerName) {
      this.printWindowTitle = `${this.title} - ${mainRegionName ? `${mainRegionName} ` : ''}${countryName ? `${countryName} ` : ''}${retailerName ? `- ${retailerName} ` : ''}`;
    } else {
      this.printWindowTitle = this.currentPath === 'campaign-comparator' ? 'Comparador de campaña' : this.title;
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.translateSub?.unsubscribe();
  }
}
