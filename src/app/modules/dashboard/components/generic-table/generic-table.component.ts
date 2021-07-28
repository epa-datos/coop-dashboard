import { AfterViewInit, Component, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() errorMsg = 'Error al consultar datos';
  @Input() emptyDataMsg = 'No se encontraron datos';
  @Input() reducedPadding: boolean;

  private _displayedColumns: TableItem[];
  get displayedColumns() {
    return this._displayedColumns;
  }

  @Input() set displayedColumns(value) {
    this._displayedColumns = value;
    this.displayedColumnsHeaders = this.displayedColumns?.map(item => item.name);
  }

  private _tableData: any; // object with any properties but "data" and "reqStatus" are required 
  get tableData() {
    return this._tableData;
  }

  @Input() set tableData(value) {
    this._tableData = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData?.data);
    this.dataSource.sort = this.sort;
  }

  @Input() set tableDataChange(value) {
    this.tableData.data = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData?.data);
    this.dataSource.sort = this.sort;
    this.loadPaginator();
  }

  dataSource;
  displayedColumnsHeaders;
  langSub: Subscription;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.langSub = this.translate.stream('general').subscribe(() => {
      this.errorMsg = this.translate.instant('general.errorData');
      this.emptyDataMsg = this.translate.instant('general.withoutData3');
      this.loadPaginator();
    });
  }

  ngAfterViewInit() {
    this.loadPaginator();
    this.dataSource.sort = this.sort;
  }

  loadPaginator() {
    this.dataSource.paginator = this.paginator.toArray()[0];
    // this.dataSource2.paginator = this.paginator.toArray()[1];
    // this.dataSource3.paginator = this.paginator.toArray()[2];

    for (let i = 0; i < this.paginator.toArray().length; i++) {
      this.paginator.toArray()[i]._intl.itemsPerPageLabel = this.translate.instant('paginator.itemsPerPage');
      this.paginator.toArray()[i]._intl.nextPageLabel = this.translate.instant('paginator.nextPage');
      this.paginator.toArray()[i]._intl.previousPageLabel = this.translate.instant('paginator.previousPage');
      this.paginator.toArray()[i]._intl.firstPageLabel = this.translate.instant('paginator.firstPage');
      this.paginator.toArray()[i]._intl.lastPageLabel = this.translate.instant('paginator.lastPage');


      this.paginator.toArray()[i]._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length == 0 || pageSize == 0) { return `0 ${this.translate.instant('paginator.ofCounter')} ${length}`; }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} ${this.translate.instant('paginator.ofCounter')} ${length}`;
      }
    }
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}


export interface TableItem {
  name: string, // object property to show in column
  title: string, // object property title for column header
  textAlign?: string, // valid css property (left, right, center)
  formatValue?: string, // currency | integer | decimal | percentage to applie pipes
  comparativeName?: string, // to compare "name" object property and show arrows with colors
  comparativeOrder?: string, // originalOverComparative | comparativeOverOriginal
  comparativeLowIsBetter?: boolean // to show arrow up or down
  maxWidthColumn?: number, //max-width (in vw) property for column (td)
  tooltip?: boolean, // to show tooltip in hover
  emptyLine?: boolean // to show a "-" when there isn't data
}
