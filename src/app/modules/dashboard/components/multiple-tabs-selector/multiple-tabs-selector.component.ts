import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiple-tabs-selector',
  templateUrl: './multiple-tabs-selector.component.html',
  styleUrls: ['./multiple-tabs-selector.component.scss']
})
export class MultipleTabsSelectorComponent implements OnInit {

  // tab list
  private _tabList: TabItem[];
  get tabList() {
    return this._tabList;
  }
  @Input() set tabList(value) {
    this._tabList = value;

    if (!this.prevTabList) {
      this.prevTabList = this._tabList;
    }

    // for dynamic tabs is necessary to select 'select all' tab when previous selected tab disappears
    this.updateAllSelectedTabValue();
  }

  // selected tab list
  private _selectedTabs: (number | string)[];
  get selectedTabs() {
    return this._selectedTabs;
  }
  @Input() set selectedTabs(value) {
    this._selectedTabs = value;
  }

  @Input() showAllSelectedTab: boolean = true; // to show 'select all' tab
  @Input() allSelectedTabText: string = 'male'; // male | female
  @Input() adjustTabsRow: boolean; // to apply pills-container class style to tabs container
  @Output() private selectedTabsChange = new EventEmitter<(number | string)[]>();

  prevTabList // previous tabList value to use for comparison (dynamic tabs);
  allSelectedTab: boolean; // 'select all' tab value (on/off tab)
  selectionWasAllTab: boolean; // to catch if previous selected tab was 'select all'

  constructor() { }

  ngOnInit(): void {
    this.getAllSelectTabValue();
  }

  getAllSelectTabValue() {
    if (this.showAllSelectedTab && (!this.selectedTabs || this.selectedTabs?.length < 1)) {
      this.allSelectedTab = true;

    } else {
      this.allSelectedTab = false;
    }
  }

  updateAllSelectedTabValue() {
    if (JSON.stringify(this._tabList) !== JSON.stringify(this.prevTabList)) {
      this.prevTabList = this._tabList;

      const prevSelectedTab = this._tabList.some(r => this.selectedTabs.indexOf(r.id) >= 0);

      if (!prevSelectedTab) {
        this.allSelectedTab = true;
      }
    }
  }

  selectedTab(ev, item: TabItem) {
    // unique selection (click over one tab except 'select all' tab)
    if (!ev?.ctrlKey && item?.id) {
      this.selectedTabs = [item.id];
    }

    // unique selection (ctrl + click after 'select all' tab)
    else if (ev?.ctrlKey && item?.id && (!this.selectedTabs || this.selectionWasAllTab)) {
      this.selectedTabs = [item.id];
    }

    // multiple selection ('select all' tab)
    else if (!item) {
      this.selectedTabs = this.tabList.map((item: any) => item.id);
    }

    // multiple selection (any tab except 'select all' tab)
    else if (ev?.ctrlKey) {
      const repeatedItemIndex = this.selectedTabs.findIndex((i: any) => i === item.id);

      if (repeatedItemIndex >= 0) {
        // avoid repeated items
        this.selectedTabs.splice(repeatedItemIndex, 1)
      } else {
        !this.selectedTabs.some((i: any) => i === item.id) && this.selectedTabs.push(item.id);
      }
    }

    this.selectionWasAllTab = !item ? true : false;

    this.selectedTabsChange.emit(this.selectedTabs)
  }
}

export interface TabItem {
  id: number | string,
  name: string
}
