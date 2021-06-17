import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-other-tools',
  templateUrl: './other-tools.component.html',
  styleUrls: ['./other-tools.component.scss']
})
export class OtherToolsComponent implements OnInit, OnDestroy {

  activeTabView = 1;

  countryID: number;
  retailerID: number;
  latamView: boolean;

  routeSub: Subscription;
  countrySub: Subscription;
  retailerSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.latamView = this.router.url.includes('latam') ? true : false;

    this.routeSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        if (event instanceof NavigationEnd)
          this.latamView = this.router.url.includes('latam') ? true : false;
      });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
    });

  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.countrySub?.unsubscribe();
    this.retailerSub?.unsubscribe();
  }

}
