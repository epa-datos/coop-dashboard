import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-campaigns-tables',
  templateUrl: './campaigns-tables.component.html',
  styleUrls: ['./campaigns-tables.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CampaignsTablesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'investment', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc', 'roas'];
  private campaigns1 = [
    { name: 'Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact_Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50, roas: 40 },
    { name: 'Liverpool_MX_BRA_PS_CPS_Spectre_Premium_Local_Intel_CCF_Google_All_SEM_ROAS_HP_Exact', investment: 7000, impressions: 150000, clicks: 8000, ctr: 25.55, ctr_benchmark: 22.12, cpm: 450, cpc: 30, roas: 50 },
    { name: 'MX_Q1_FY21_PS_CPS_CPS-Gaming_OMEN_OMG_Local__Omen____', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80, roas: 250 },
    { name: 'Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact_Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50, roas: 40 },
    { name: 'Liverpool_MX_BRA_PS_CPS_Spectre_Premium_Local_Intel_CCF_Google_All_SEM_ROAS_HP_Exact', investment: 7000, impressions: 150000, clicks: 8000, ctr: 25.55, ctr_benchmark: 22.12, cpm: 450, cpc: 30, roas: 50 },
    { name: 'MX_Q1_FY21_PS_CPS_CPS-Gaming_OMEN_OMG_Local__Omen____', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80, roas: 250 }
  ];
  private campaigns2 = [
    { name: 'Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50 },
    { name: 'Liverpool_MX_BRA_PS_CPS_Spectre_Premium', investment: 7000, impressions: 150000, clicks: 8000, ctr: 25.55, ctr_benchmark: 22.12, cpm: 450, cpc: 30, roas: undefined },
    { name: 'MX_Q1_FY21_PS_CPS_CPS-Gaming_OMEN_OMG', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80, roas: undefined },
    { name: 'Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact_Liverpool_MX_BRA_PS_CPS_Laptops_Omen_Gaming_Local_AMD_Google_All_SEM_ROAS_HP_Exact', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50, roas: 40 },
    { name: 'Liverpool_MX_BRA_PS_CPS_Spectre_Premium_Local_Intel_CCF_Google_All_SEM_ROAS_HP_Exact', investment: 7000, impressions: 150000, clicks: 8000, ctr: 25.55, ctr_benchmark: 22.12, cpm: 450, cpc: 30, roas: 50 },
    { name: 'MX_Q1_FY21_PS_CPS_CPS-Gaming_OMEN_OMG_Local__Omen____', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80, roas: 250 },
    { name: 'Liverpool_MX_BRA_PS_CPS', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50, roas: null },
    { name: 'MX_Q1_FY21_PS', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80 }
  ];
  private campaigns3 = [
    { name: 'Liverpool_MX_BRA_PS_CPS', investment: 5000, impressions: 130000, clicks: 7000, ctr: 0.55, ctr_benchmark: 0.12, cpm: 750, cpc: 50, roas: null },
    { name: 'MX_Q1_FY21_PS', investment: 2000, impressions: 80000, clicks: 4000, ctr: 10.30, ctr_benchmark: 11.20, cpm: 120, cpc: 80 },
  ];

  dataSource1 = new MatTableDataSource<any>(this.campaigns1);
  dataSource2 = new MatTableDataSource<any>(this.campaigns2);
  dataSource3 = new MatTableDataSource<any>(this.campaigns3);

  loadedPaginator: boolean;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadPaginator();
  }

  loadPaginator() {
    this.dataSource1.paginator = this.paginator.toArray()[0];
    this.dataSource2.paginator = this.paginator.toArray()[1];
    this.dataSource3.paginator = this.paginator.toArray()[2];

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
