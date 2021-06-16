import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss']
})
export class ChartBarComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() category: string = 'category';
  @Input() value: string = 'value';
  @Input() valueFormat: string; // USD MXN Copy shown in tooltip
  @Input() height: string = '350px'; // height property value valid in css
  @Input() legendsByCategory: boolean; // show a legend (category + value + value format) per category only recommended for a small number of categories
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  chartID;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-bar-${this.name}`
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

  chart;
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

  /**
   * Load chart 
   * @param [lang] 'es': Spanish | 'en': English | 'pt': Portuguese
   */
  loadChart(lang?: string) {
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    let chart = am4core.create(this.chartID, am4charts.XYChart);
    // chart.scrollbarX = new am4core.Scrollbar();

    this.loadChartData(chart);
    loadLanguage(chart, lang);

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    // categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    categoryAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    // series.sequencedInterpolation = true;
    series.dataFields.valueY = this.value;
    series.dataFields.categoryX = this.category;
    series.tooltipText = `[{categoryX}: bold]{valueY} ${this.valueFormat ? this.valueFormat : ''}[/]`;
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'vertical';

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

    if (this.legendsByCategory) {
      var legend = new am4charts.Legend();
      legend.parent = chart.chartContainer;
      legend.itemContainers.template.togglable = false;
      legend.fontSize = 12;

      let valueFormat = this.valueFormat;

      series.events.on('ready', function (ev) {
        var legenddata = [];
        series.columns.each(function (column) {
          legenddata.push({
            // name: `${column.dataItem['categoryX']} ${column.dataItem['valueY']} ${valueFormat ? valueFormat : ''}`,
            name: `${column.dataItem['categoryX']}`,
            fill: column.fill
          });
        });
        legend.data = legenddata;
      });

    }

    // chart.responsive.enabled = true;
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
