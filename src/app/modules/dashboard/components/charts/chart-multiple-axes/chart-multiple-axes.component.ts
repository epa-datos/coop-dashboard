import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-multiple-axes',
  templateUrl: './chart-multiple-axes.component.html',
  styleUrls: ['./chart-multiple-axes.component.scss']
})
export class ChartMultipleAxesComponent implements OnInit, AfterViewInit {
  @Input() height: string = '350px'; // height property value valid in css
  @Input() value1: string = 'value1'; // object property represented as valueAxis1 (left axis)
  @Input() value2: string = 'value2'; // object property represented as valueAxis2 (right axis)
  @Input() valueName1: string = 'Value 1';
  @Input() valueName2: string = 'Value 2';
  @Input() valueFormat1: string;
  @Input() valueFormat2: string;
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-multiple-axes-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  chartID;
  chart;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);
    chart.numberFormatter.numberFormat = '#,###.##';

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.labels.template.fontSize = 12;

    let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis1.title.text = this.valueName1;
    valueAxis1.renderer.labels.template.fontSize = 12;

    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.title.text = this.valueName2;
    valueAxis2.renderer.opposite = true;
    valueAxis2.renderer.grid.template.disabled = true;
    valueAxis2.renderer.labels.template.fontSize = 12;

    // Create series
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = this.value1;
    series1.dataFields.dateX = 'date';
    series1.name = this.valueName1;
    series1.yAxis = valueAxis1;
    series1.strokeWidth = 2;
    series1.tensionX = 0.85;
    // {name}\n[bold font-size: 20]{valueY}
    series1.tooltipText = `{name}: [bold]{valueY} ${this.valueFormat1 ? this.valueFormat1 : ''}[/]`;
    series1.tooltip.autoTextColor = false;
    series1.tooltip.label.fill = am4core.color('#fff');

    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = this.value2;
    series2.dataFields.dateX = 'date';
    series2.name = this.valueName2;
    series2.yAxis = valueAxis2;
    series2.strokeWidth = 2;
    series2.strokeDasharray = '3,4';
    series2.stroke = series2.stroke;
    series2.tensionX = 0.85;
    series2.tooltipText = `{name}: [bold]{valueY} ${this.valueFormat2 ? this.valueFormat2 : ''}[/]`;
    series2.tooltip.autoTextColor = false;
    series2.tooltip.label.fill = am4core.color('#fff');

    // let bullet3 = series2.bullets.push(new am4charts.CircleBullet());
    // bullet3.circle.radius = 3;
    // bullet3.circle.strokeWidth = 2;
    // bullet3.circle.fill = am4core.color('#fff');

    // Add cursor
    chart.cursor = new am4charts.XYCursor();

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';

    this.loadChartData(chart);
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }
}
