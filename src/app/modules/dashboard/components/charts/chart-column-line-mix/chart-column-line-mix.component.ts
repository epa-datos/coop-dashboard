import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart-column-line-mix',
  templateUrl: './chart-column-line-mix.component.html',
  styleUrls: ['./chart-column-line-mix.component.scss']
})
export class ChartColumnLineMixComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() category: string = 'category';
  @Input() columnValue: string = 'column_value';
  @Input() lineValue: string = 'line_value';
  @Input() columnName: string;
  @Input() lineName: string;
  @Input() valueFormat: string; // USD MXN Copy shown in tooltip
  @Input() height: string = '350px' // height property value valid in css
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;
  @Input() joinTextInTooltip: string = this.translate.instant('others.onDay');;
  @Input() zebraBars: boolean;
  @Input() XYCursor: boolean;

  chartID;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-column-line-mix-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  chart;
  langSub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.langSub = this.appStateService.selectedLang$.subscribe((lang: string) => {
      this.loadChart(lang);

      if (this.joinTextInTooltip === 'en') {
        this.joinTextInTooltip = this.translate.instant('others.onDay');
      }
    });
  }

  ngAfterViewInit() {
    const defaultLang = this.appStateService.selectedLang;
    this.loadChart(defaultLang);
  }

  /**
 * Load chart 
 * @param [lang] 'es': Spanish | 'en': English | 'pt': Portuguese
 */
  loadChart(lang?: string) {
    am4core.useTheme(am4themes_animated);

    // Create chart instance
    var chart = am4core.create(this.chartID, am4charts.XYChart);
    // chart.data = this.data;
    this.loadChartData(chart);
    loadLanguage(chart, lang);
    // chart.exporting.menu = new am4core.ExportMenu();

    /* Create axes */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.fontSize = 12;

    /* Create value axis */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fontSize = 12;

    /* Create series */
    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = this.columnName ? this.columnName : this.columnValue;
    columnSeries.dataFields.valueY = this.columnValue;
    columnSeries.dataFields.categoryX = this.category;

    columnSeries.columns.template.tooltipText = `[#fff font-size: 15px]{name} ${this.joinTextInTooltip} {categoryX}:\n[/][#fff font-size: 17px bold]{valueY}[/] [#fff]{additional} ${this.valueFormat ? this.valueFormat : ''}[/]`
    columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity';
    columnSeries.columns.template.propertyFields.stroke = 'stroke';
    columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth';
    columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash';
    columnSeries.tooltip.label.textAlign = 'middle';
    columnSeries.columns.template.column.cornerRadiusTopLeft = 10;
    columnSeries.columns.template.column.cornerRadiusTopRight = 10;
    columnSeries.columns.template.column.fillOpacity = 0.8;

    if (this.zebraBars) {
      columnSeries.columns.template.adapter.add('fill', function (fill, target) {
        if (target.dataItem && target.dataItem._index % 2) {
          return am4core.color('#85A8E3');
        }
        else {
          return fill;
        }
      });

      columnSeries.columns.template.adapter.add('stroke', (value, target, key) => {
        if (target.dataItem && target.dataItem._index % 2) {
          return am4core.color('#85A8E3');
        }
        else {
          return value;
        }
      });
    }

    let lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = this.lineName ? this.lineName : this.lineValue;
    lineSeries.dataFields.valueY = this.lineValue;
    lineSeries.dataFields.categoryX = this.category;

    lineSeries.stroke = am4core.color('#fdd400');
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = 'lineDash';
    lineSeries.tooltip.label.textAlign = 'middle';

    let bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color('#fdd400'); // tooltips grab fill from parent by default
    bullet.tooltipText = `[#fff font-size: 15px]{name} ${this.joinTextInTooltip} {categoryX}:\n[/][#fff font-size: 17px bold]{valueY}[/] [#fff]{additional} ${this.valueFormat ? this.valueFormat : ''}[/]`
    let circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.fill = am4core.color('#fff');
    circle.strokeWidth = 3;

    // chart.responsive.enabled = true;
    if (this.XYCursor) {
      chart.cursor = new am4charts.XYCursor();
    }
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }


  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
