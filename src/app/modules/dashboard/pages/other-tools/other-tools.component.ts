import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-other-tools',
  templateUrl: './other-tools.component.html',
  styleUrls: ['./other-tools.component.scss']
})
export class OtherToolsComponent implements OnInit, OnDestroy {

  countryID: number;
  retailerID: number;

  levelPage = {
    latam: false,
    country: false,
    retailer: false,
  }

  countrySub: Subscription;
  retailerSub: Subscription;
  routeSub: Subscription;
  filtersSub: Subscription;

  activeTabView: number = 1;

  private requestInfoSource = new Subject<boolean>();
  requestInfoChange$ = this.requestInfoSource.asObservable();

  private levelPageSource = new Subject<object>();
  levelPageChange$ = this.levelPageSource.asObservable();

  previousRoute: string;

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.previousRoute = this.router.url;
    this.levelPage.latam = this.router.url.includes('latam') ? true : false;

    // restore init filters
    if (this.filtersStateService.period && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    if (this.countryID || this.retailerID || this.levelPage.latam) {
      this.getActiveView();
    }

    // catch if its LATAM view
    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.filtersStateService.restoreFilters();

        this.levelPage.latam = this.router.url.includes('latam') ? true : false;
        if (this.getPage(this.router.url) !== this.getPage(this.previousRoute)) {
          this.getActiveView();
        }

        this.previousRoute = this.router.url;
      }
    });

    // catch if its country  view
    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      if (country?.id !== this.countryID) {
        this.countryID = country?.id;
        this.getActiveView();
        this.activeTabView = 1;
      }
    });

    // catch if its retailer view
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id;
        this.getActiveView();
        this.activeTabView = 1;
      }
    });

    // catch a change in general filters
    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      // this.getActiveView();
      this.requestInfoSource.next(manualChange);
    });
  }

  getActiveView() {
    if (this.retailerID) {
      this.levelPage = { latam: false, country: false, retailer: true };
    } else if (this.countryID) {
      this.levelPage = { latam: false, country: true, retailer: false };
    } else if (this.levelPage.latam) {
      this.levelPage = { latam: true, country: false, retailer: false };
    }

    this.levelPageSource.next(this.levelPage);
  }

  getPage(route: string): string {
    if (route.includes('main-region?') || route.includes('country?') || route.includes('retailer?')) {
      return 'overview';
    } else if (route.includes('tools?')) {
      return 'tools';
    } else {
      return;
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
