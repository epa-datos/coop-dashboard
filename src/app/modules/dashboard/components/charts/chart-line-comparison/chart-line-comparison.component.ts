import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';

@Component({
  selector: 'app-chart-line-comparison',
  templateUrl: './chart-line-comparison.component.html',
  styleUrls: ['./chart-line-comparison.component.scss']
})
export class ChartLineComparisonComponent implements OnInit, AfterViewInit {
  @Input() category: string = 'date';
  @Input() value1: string = 'value1';
  @Input() value2: string = 'value2';

  chart;
  chartID;
  series;
  loadStatus: number = 0;

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-line-comparison-${this.name}`
  }

  private _valueName1: string; // Property name shown in tooltip
  get valueName1() {
    return this._valueName1;
  }
  @Input() set valueName1(value) {
    this._valueName1 = value;
    this.series && this.loadNamesAndFormats();
  }

  private _valueName2: string; // Property name shown in tooltip
  get valueName2() {
    return this._valueName2;
  }
  @Input() set valueName2(value) {
    this._valueName2 = value;
    this.series && this.loadNamesAndFormats();
  }

  private _valueFormat1: string; // USD MXN Copy shown in tooltip
  get valueFormat1() {
    return this._valueFormat1;
  }
  @Input() set valueFormat1(value) {
    this._valueFormat1 = value;
    this.series && this.loadNamesAndFormats();
  }

  private _valueFormat2: string; // USD MXN Copy shown in tooltip
  get valueFormat2() {
    return this._valueFormat2;
  }
  @Input() set valueFormat2(value) {
    this._valueFormat2 = value;
    this.series && this.loadNamesAndFormats();
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    this.loadStatus = 1;
    // Create chart instance
    let chart = am4core.create(this.chartID, am4charts.XYChart);


    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.renderer.labels.template.fontSize = 12;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.labels.template.fontSize = 12;

    // serie 1
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = this.value1;
    series.dataFields.dateX = this.category;
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltip.pointerOrientation = 'vertical';
    series.tensionX = 0.85;

    // serie 2
    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = this.value2;
    series2.dataFields.dateX = this.category;
    series2.strokeWidth = 2;
    series2.strokeDasharray = '3,4';
    series2.stroke = series.stroke;
    series2.tensionX = 0.85; 1

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.responsive.enabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';

    this.series = { series1: series, series2: series2 };

    this.loadChartData(chart);
    this.loadNamesAndFormats();
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  loadNamesAndFormats() {
    const serieName1 = this.valueName1 ? this.valueName1 : this.value1;
    const serieName2 = this.valueName2 ? this.valueName2 : this.value2;

    this.series.series1.tooltipText = `${serieName1}: [bold]{${this.value1}} ${this.valueFormat1 ? this.valueFormat1 : ''} [/]\n ${serieName2}: [bold]{${this.value2}} ${this.valueFormat2 ? this.valueFormat2 : ''}[/]`;
    this.series.series1.name = serieName1;

    this.series.series2.name = serieName2;
  }
}
