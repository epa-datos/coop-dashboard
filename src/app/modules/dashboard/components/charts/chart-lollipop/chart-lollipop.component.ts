import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-lollipop',
  templateUrl: './chart-lollipop.component.html',
  styleUrls: ['./chart-lollipop.component.scss']
})
export class ChartLollipopComponent implements OnInit, AfterViewInit {

  @Input() value: string = 'value';
  @Input() category: string = 'category';
  @Input() height: string = '350px'; // height property value valid in css

  graphID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.graphID = `chart-lollipop-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  private _valueFormat;
  get valueFormat() {
    return this._valueFormat;
  }
  @Input() set valueFormat(value) {
    this._valueFormat = value;
    if (this.series) {
      this.loadValueFormat();
    }
  }

  chart;
  series;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create(this.graphID, am4charts.XYChart);
    this.loadChartData(chart);

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.minGridDistance = 15;
    categoryAxis.renderer.grid.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeDasharray = '1,3';
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = 'left';
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.labels.template.fontSize = 12;

    categoryAxis.renderer.labels.template.adapter.add('dx', function (dx, target) {
      return -target.maxRight / 2;
    })

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.labels.template.fontSize = 12;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = this.category;
    series.dataFields.valueY = this.value;
    series.sequencedInterpolation = true;
    series.fillOpacity = 0;
    series.strokeOpacity = 1;
    series.strokeDasharray = '1,3';
    series.columns.template.width = 0.01;
    series.tooltip.pointerOrientation = 'horizontal';

    this.series = series;
    this.loadValueFormat();

    let bullet = series.bullets.create(am4charts.CircleBullet);

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  loadValueFormat() {
    this.series.tooltipText = `{valueY.value} ${this.valueFormat ? this.valueFormat : ''}`;
  }
}
