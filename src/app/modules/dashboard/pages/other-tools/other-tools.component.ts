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

  constructor(
    private appStateService: AppStateService,
    private filtersStateService: FiltersStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.levelPage.latam = this.router.url.includes('latam') ? true : false;

    // restore init filters
    if (this.filtersStateService.period && this.filtersStateService.categories) {
      this.filtersStateService.restoreFilters();
    }

    if (this.countryID || this.retailerID || this.levelPage.latam) {
      this.getActiveView();
    }

    // catch if the route changes
    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.filtersStateService.restoreFilters();

        this.levelPage.latam = this.router.url.includes('latam') ? true : false;
        this.getActiveView();
      }
    });

    // catch if its country  view
    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      if (country?.id !== this.countryID) {
        this.countryID = country?.id;
        this.getActiveView();

        this.emitSelectedSection('indexed');
      }
    });

    // catch if its retailer view
    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      if (retailer?.id !== this.retailerID) {
        this.retailerID = retailer?.id;
        this.getActiveView();

        this.emitSelectedSection('indexed');
      }
    });

    // catch a change in general filters
    this.filtersSub = this.filtersStateService.filtersChange$.subscribe((manualChange: boolean) => {
      // this.getActiveView();
      this.emitRequestInfo();
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

  emitRequestInfo() {
    if (this.countryID || this.retailerID || this.levelPage?.latam) {
      this.requestInfoSource.next();

    } else {
      // Since this component is reused in the 3 levels (latam, country or retailer) 
      // when the application starts on this page (for example after refresh or a redirection) 
      // it is necessary to have the value of the variables countryID, the retailer ID or be on the latam page 
      // to emit the new value of the requestInfoSource observable otherwise the requests to the API 
      // would have an undefined when referring to the countryID or retailerID variables.

      // If the emission of the requestInfoSource value were done in the contry or retailer subscriptions, 
      // repeated emissions could be generated, so it was chosen to use a setTimeOut function recursively,
      // the tests that were made were never repeated more than once, for what so far is the most feasible option.

      setTimeout(() => {
        this.emitRequestInfo();
      }, 500);
    }
  }

  emitSelectedSection(section: string) {
    switch (section) {
      case 'indexed':
        this.activeTabView = 1;
        this.filtersStateService.hideCategories(false);
        break;

      case 'omnichat':
        this.activeTabView = 2;
        this.filtersStateService.hideCategories(false);
        break;

      case 'pc-selector':
        this.activeTabView = 3;
        this.filtersStateService.hideCategories(true);
        break;
    }
  }

  ngOnDestroy() {
    this.filtersStateService.hideCategories(false);

    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
    this.filtersSub?.unsubscribe();
  }
}
