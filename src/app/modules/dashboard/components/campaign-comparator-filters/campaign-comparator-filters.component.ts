import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersMngmtService } from 'src/app/modules/users-mngmt/services/users-mngmt.service';
import { CampaignComparatorService } from '../../services/campaign-comparator.service';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-campaign-comparator-filters',
  templateUrl: './campaign-comparator-filters.component.html',
  styleUrls: ['./campaign-comparator-filters.component.scss']
})
export class CampaignComparatorFiltersComponent implements OnInit {

  @Output() selectedFiltersChange = new EventEmitter<{ retailer: any, campaign: any }>();
  @Output() validFiltersChange = new EventEmitter<boolean>();

  retailerList: any[];
  campaignList: any[];

  filteredRetailerList: any[];
  filteredRetailer: boolean; // flag to know is filteredRetailerList is the result of a search filter
  retailerFilter: string; // filtered value in filteredRetailerList

  filteredCampaignList: any[];
  filteredCampaign: boolean; // flag to know is campaignsList is the result of a search filter
  campaignFilter: string; // filtered value in campaignsList

  selectedRetailer: any;
  selectedCampaign: any;

  form: FormGroup;
  retailer: AbstractControl;
  campaign: AbstractControl;

  retailersReqStatus: number = 2;
  campaignsReqStatus: number = 0;

  constructor(
    private fb: FormBuilder,
    private usersMngmtService: UsersMngmtService,
    private campaignCompService: CampaignComparatorService,
    private filtersStateService: FiltersStateService
  ) { }

  async ngOnInit() {
    this.form = this.fb.group({
      retailer: ['', [Validators.required]],
      campaign: ['', [Validators.required]],
    });

    this.retailer = this.form.controls['retailer'];
    this.campaign = this.form.controls['campaign'];


    const savedRetailers = this.filtersStateService.retailersInitial;
    if (savedRetailers?.length > 0) {
      this.retailerList = savedRetailers;
      this.filteredRetailerList = savedRetailers;
    } else {
      this.getRetailers();
    }
  }

  getRetailers() {
    this.retailersReqStatus = 1;
    return this.usersMngmtService.getRetailers()
      .toPromise()
      .then((resp: any[]) => {
        const retailers = resp.map(retailer => {
          return { id: retailer.id, name: `${retailer.country_code} - ${retailer.name}` }
        })

        retailers.sort((a, b) => a.name.localeCompare(b.name));

        this.retailerList = retailers;
        this.filteredRetailerList = retailers;
        this.filtersStateService.retailersInitial = retailers;

        this.retailersReqStatus = 2;
      })
      .catch((error) => {
        this.retailerList = [];
        this.selectedRetailer && delete this.selectedRetailer;
        this.retailer.reset();

        console.error(`[campaign-comparator-filter.component]: ${error}`);
        this.retailersReqStatus = 3;
      });
  }

  getCampaigns() {
    this.campaignsReqStatus = 1;

    return this.campaignCompService.getCampaigns(this.selectedRetailer.id)
      .toPromise()
      .then((res: any[]) => {
        this.campaignList = res;
        this.filteredCampaignList = res;

        this.campaignsReqStatus = 2;
      })
      .catch(error => {
        this.campaignList = [];
        this.selectedCampaign && delete this.selectedCampaign;
        this.campaign.reset();

        console.error(`[campaign-comparator-filter.component]: ${error}`);
        this.campaignsReqStatus = 3;
      });
  }

  filterFromList(elementRef: string, value: string) {
    if (!value) {
      return;
    }
    const pascalCaseRef = `${elementRef.charAt(0).toUpperCase()}${elementRef.slice(1)}`;

    const arrayReference = `${elementRef}List`;
    const filteredArrayRef = `filtered${pascalCaseRef}List`;

    this[arrayReference] = this[filteredArrayRef].filter(item => {

      return item.name.toLowerCase().includes(value.toLowerCase());
    });
  }

  openedChange(elementRef: string, opened: boolean) {
    // reset search without results if select is closed
    const listRefPascalCase = `${elementRef.charAt(0).toUpperCase()}${elementRef.slice(1)}`;

    const arrayReference = `${elementRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;
    const filterRef = `${elementRef}Filter`

    if (!opened && this[elementRef] && this[arrayReference].length < 1) {
      this[arrayReference] = [... this[filteredArrayRef]];
      delete this[filterRef];
    }
  }

  async retailerChange() {
    this.retailerFilter && delete this.retailerFilter;

    await this.getCampaigns();
    this.validFiltersChange.emit(this.form.valid);
  }

  campaignChange() {
    this.campaignFilter && delete this.campaignFilter;

    this.selectedFiltersChange.emit({ retailer: this.selectedRetailer, campaign: this.selectedCampaign });
    this.validFiltersChange.emit(this.form.valid);
  }

}
