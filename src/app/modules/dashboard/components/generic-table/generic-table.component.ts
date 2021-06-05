import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit, AfterViewInit {

  @Input() errorMsg = 'Error al consultar datos';
  @Input() emptyDataMsg = 'No se encontraron datos';

  private _displayedColumns: TableItem[];
  get displayedColumns() {
    return this._displayedColumns;
  }

  @Input() set displayedColumns(value) {
    this._displayedColumns = value;
    this.displayedColumnsHeaders = this.displayedColumns.map(item => item.name);
  }

  private _tableData: any; // object with any properties but "data" and "reqStatus" are required 
  get tableData() {
    return this._tableData;
  }

  @Input() set tableData(value) {
    this._tableData = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData.data);
  }

  @Input() set tableDataChange(value) {
    this.tableData.campaigns = value;
    this.dataSource = new MatTableDataSource<any>(this.tableData.data);
    this.loadPaginator();
  }

  dataSource;
  displayedColumnsHeaders;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadPaginator();
  }

  loadPaginator() {
    this.dataSource.paginator = this.paginator.toArray()[0];
    // this.dataSource2.paginator = this.paginator.toArray()[1];
    // this.dataSource3.paginator = this.paginator.toArray()[2];

    for (let i = 0; i < this.paginator.toArray().length; i++) {
      this.paginator.toArray()[i]._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator.toArray()[i]._intl.nextPageLabel = 'Siguiente';
      this.paginator.toArray()[i]._intl.previousPageLabel = 'Anterior';

      this.paginator.toArray()[i]._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

        length = Math.max(length, 0);

        const startIndex = page * pageSize;

        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} de ${length}`;
      }
    }
  }
}


export interface TableItem {
  name: string, // object property to show in column
  title: string, // object property title for column header
  textAlign?: string, // valid css property (left, right, center)
  formatValue?: string, // currency | integer | decimal | percentage to applie pipes
  comparativeName?: string, // to compare "name" object property and show arrows with colors
  maxWidthTdPercentage?: number, //max-width in % property for column (td)
  maxWidthSpan?: string, // valid css max-width property for text inside column (td > span)
  tooltip?: boolean, // to show tooltip in hover
  emptyLine?: boolean // to show a "-" when there isn't data
}
