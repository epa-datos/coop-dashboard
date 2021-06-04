import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-campaigns-tables',
  templateUrl: './campaigns-tables.component.html',
  styleUrls: ['./campaigns-tables.component.scss']
})
export class CampaignsTablesComponent implements OnInit, AfterViewInit {


  private _campList;
  get campList() {
    return this._campList;
  }
  @Input() set campList(value) {
    this._campList = value;
    this.dataSource = new MatTableDataSource<any>(this.campList['campaigns']);
  }

  private _campListChange;
  get campListChange() {
    return this._campList;
  }
  @Input() set campListChange(value) {
    this.campList.campaigns = value;
    this.dataSource = new MatTableDataSource<any>(this.campList['campaigns']);
    this.loadPaginator();
  }

  dataSource;
  displayedColumns: string[] = ['name', 'investment', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc', 'roas'];

  loadedPaginator: boolean;

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

    this.loadedPaginator = true;
  }
}
