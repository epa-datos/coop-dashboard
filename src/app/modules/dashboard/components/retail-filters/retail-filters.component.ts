import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { AUDIENCES, MEDIUMS, SOURCES } from 'src/app/tools/constants/filters';
import { FiltersStateService } from '../../services/filters-state.service';

@Component({
  selector: 'app-retail-filters',
  templateUrl: './retail-filters.component.html',
  styleUrls: ['./retail-filters.component.scss']
})
export class RetailFiltersComponent implements OnInit {

  sourceList: any[] = SOURCES.filter(item => item.id !== 'banner' && item.id !== 'institucional');
  mediumList: any[] = MEDIUMS;
  audienceList: any[] = AUDIENCES;

  filteredSourceList: any[] = this.sourceList;
  filteredMediumList: any[] = this.mediumList;
  filteredAudiencesList: any[] = this.audienceList;

  sourcesCounter: number = 0;
  mediumsCounter: number = 0;
  audiencesCounter: number = 0;

  sourceFilter: string
  mediumFilter: string;
  audienceFilter: string;

  selectedSources: any[] = [];
  selectedMediums: any[] = [];
  selectedAudiences: any[] = [];

  form: FormGroup;
  sources: AbstractControl;
  mediums: AbstractControl;
  audiences: AbstractControl;

  @ViewChild('allSelectedSources') private allSelectedSources: MatOption;
  @ViewChild('allSelectedMediums') private allSelectedMediums: MatOption;
  @ViewChild('allSelectedAudiences') private allSelectedAudiences: MatOption;

  constructor(
    private fb: FormBuilder,
    private filtersStateService: FiltersStateService
  ) { }

  async ngOnInit() {
    this.form = this.fb.group({
      sources: new FormControl([...this.sourceList.map(item => item), 0]),
      mediums: new FormControl([...this.mediumList.map(item => item), 0]),
      audiences: new FormControl([...this.audienceList.map(item => item), 0]),
    });

    this.sources = this.form.controls['sources'];
    this.mediums = this.form.controls['mediums'];
    this.audiences = this.form.controls['audiences'];

    this.sourcesCounter = this.sourceList.length;
    this.mediumsCounter = this.mediumList.length;
    this.audiencesCounter = this.audienceList.length;

    this.applyFilters();
  }

  toggleAllSelection(controlRef: string, listRef: string) {
    const controlRefPascalCase = `${controlRef.charAt(0).toUpperCase()}${controlRef.slice(1)}`;
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;
    const matOptionRef = `allSelected${controlRefPascalCase}`;

    const allSelected = this[matOptionRef].selected;
    const shownElements = this[arrayReference].filter(item => !item.hidden);

    const initialArrayRef = this[filteredArrayRef] ? filteredArrayRef : arrayReference;
    this[controlRef].patchValue(this[initialArrayRef].filter(item => {
      const isSelectedElement = this[controlRef].value.includes(item);
      const isShownElement = shownElements.includes(item);

      if (isShownElement) {
        // change selection depending on allSelect new value
        if (allSelected) {
          return shownElements.includes(item)

        } else {
          return shownElements.includes(item), 0
        }

      } else {
        // preserve the original selection
        if (isSelectedElement) {
          return this[controlRef].value.includes(item)
        } else {
          return this[controlRef].value.includes(item), 0
        }
      }
    }));

    this.allAreItemsSelected(controlRef, arrayReference, matOptionRef);
    this.updateSelectionCounter(controlRef);
  }

  allAreItemsSelected(controlRef: string, arrayReference: string, matOptionRef: string) {
    const shownElements = this[arrayReference].filter(item => !item.hidden);
    let allAreSelected = true;
    for (let item of shownElements) {
      if (this[controlRef].value.includes(item)) {
      } else {
        allAreSelected = false;
        break;
      }
    };

    if (allAreSelected) {
      this[matOptionRef].select();
    } else {
      this[matOptionRef].deselect();
    }
  }

  updateSelectionCounter(controlRef: string) {
    const counterRef = `${controlRef}Counter`;

    const selectionCounter = this[controlRef].value.filter(item => item.name);
    this[counterRef] = selectionCounter.length;
  }

  tosslePerOne(matOptionRef: string, controlRef: string, listRef: string) {
    this.updateSelectionCounter(controlRef);

    if (this[matOptionRef].selected) {
      this[matOptionRef].deselect();
      return false;
    }

    if (this[controlRef].value.length == this[listRef].length) {
      this[matOptionRef].select();
    }
  }

  uniqueSelection(controlRef: string, listRef: string, value) {
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;

    const initialArrayRef = this[filteredArrayRef] ? filteredArrayRef : arrayReference;
    this[controlRef].patchValue(this[initialArrayRef].filter(item => {
      item === value;
    }));
  }

  /**
* filterFromList
* Generic function to be used for sarch filter
* @param controlRef // associated form control name
* @param listRef // associated elementList name
* @param value // filtered value
*/

  filterFromList(controlRef: string, listRef: string, value: string) {
    const controlRefPascalCase = `${controlRef.charAt(0).toUpperCase()}${controlRef.slice(1)}`;
    const listRefPascalCase = `${listRef.charAt(0).toUpperCase()}${listRef.slice(1)}`;

    const arrayReference = `${listRef}List`;
    const filteredArrayRef = `filtered${listRefPascalCase}List`;
    const matOptionRef = `allSelected${controlRefPascalCase}`;
    const filteredFlagReference = `filtered${listRefPascalCase}`;

    if (value) {
      this[controlRef].patchValue(this[filteredArrayRef].filter(item => {
        const isSelected = this[controlRef].value.includes(item);

        if (isSelected) {
          return this[controlRef].value.includes(item)
        } else {
          return this[controlRef].value.includes(item), 0
        }
      }));
    }

    this[arrayReference].forEach(item => {
      delete item.hidden;
      if (!item.name.toLowerCase().includes(value.toLowerCase())) {
        item.hidden = true;
      }
    });

    this.allAreItemsSelected(controlRef, arrayReference, matOptionRef);
    this[filteredFlagReference] = value.length > 0 ? true : false;
  }

  applyFilters() {
    this.selectedSources = this.sources.value.filter(item => item.id);
    this.selectedMediums = this.mediums.value.filter(item => item.id);
    this.selectedAudiences = this.audiences.value.filter(item => item.id);

    this.selectedSources = this.selectedSources.map(item => item.id);
    this.selectedMediums = this.selectedMediums.map(item => item.id);
    this.selectedAudiences = this.selectedAudiences.map(item => item.id);

    this.filtersStateService.selectRetailSources(this.sources.value.filter(item => item.id));
    this.filtersStateService.selectRetailMediums(this.mediums.value.filter(item => item.id));
    this.filtersStateService.selectRetailAudiences(this.audiences.value.filter(item => item.id));


    this.filtersStateService.retailFiltersChange();
  }

}
