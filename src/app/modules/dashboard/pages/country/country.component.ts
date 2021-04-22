import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  countryName;
  countryID: number;

  constructor(
    private route: ActivatedRoute,
    private appStateServ: AppStateService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.countryName = params['country'];
    });

    this.appStateServ.selectedCountry$
      .subscribe(
        country => {
          this.countryID = country?.id;
        },
        error => {
          console.error(`[country.component]: ${error}`);
        }
      )
  }
}
