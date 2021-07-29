import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-stacked-bar',
  templateUrl: './chart-stacked-bar.component.html',
  styleUrls: ['./chart-stacked-bar.component.scss']
})
export class ChartStackedBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() category: string = 'category'
  @Input() valueFormat: string; // USD MXN Copy shown in tooltip
  @Input() height: string = '350px'; // height property value valid in css
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;
  @Input() series: { id: string, name: string }[]; // properties list added in "data" objects id (property name), name (copy used in chart)

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-stacked-bar-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    if (this.chart) {
      this.loadChartData(this.chart);
    }
  }

  private chart: am4charts.XYChart;
  chartID;
  langSub: Subscription;

  constructor(
    private appStateService: AppStateService
  ) { }

  ngOnInit(): void {
    this.langSub = this.appStateService.selectedLang$.subscribe((lang: string) => {
      this.loadChart(lang);
    });
  }

  ngAfterViewInit() {
    const defaultLang = this.appStateService.selectedLang;
    this.loadChart(defaultLang);
  }

  loadChart(lang?: string) {

    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    this.loadChartData(chart);
    loadLanguage(chart, lang);

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top'
    chart.legend.contentAlign = 'center';
    chart.legend.fontSize = 14;
    chart.legend.marginBottom = 16;

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.grid.template.opacity = 0;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.labels.template.fontSize = 12;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.grid.template.opacity = 0;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
    valueAxis.renderer.ticks.template.stroke = am4core.color('#495C43');
    valueAxis.renderer.ticks.template.length = 10;
    valueAxis.renderer.line.strokeOpacity = 0.5;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.renderer.labels.template.fontSize = 12;

    // Create series
    const categoryValue = this.category;
    const valueFormat = this.valueFormat;
    function createSeries(field, name) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.categoryY = categoryValue;

      series.dataFields.valueX = field;
      series.dataFields.valueXShow = "totalPercent";
      series.stacked = true;
      series.name = name;
      series.columns.template.tooltipText = `{categoryY}\n{name}: [font-size: 14px bold]{valueX.formatNumber('#.00')}${valueFormat ? valueFormat : ''} ({valueX.totalPercent.formatNumber('#.00')}%)[/]`;

      // use if is necessary to show the value inside stacked bars
      // let labelBullet = series.bullets.push(new am4charts.LabelBullet());
      // labelBullet.locationX = 0.5;
      // labelBullet.label.text = '{valueX}';
      // labelBullet.label.fill = am4core.color('#fff');
    }

    this.series.forEach((item: { id: string, name: string }) => {
      createSeries(item.id, item.name);
    });
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

}
