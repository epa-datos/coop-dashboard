import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-pyramid',
  templateUrl: './chart-pyramid.component.html',
  styleUrls: ['./chart-pyramid.component.scss']
})
export class ChartPyramidComponent implements OnInit, AfterViewInit {

  @Input() category: string = 'age';
  @Input() value1: string = 'male';
  @Input() value2: string = 'female';
  @Input() valueName1: string = 'Hombres';
  @Input() valueName2: string = 'Mujeres';
  @Input() height: string = '350px'; // height property value valid in css

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-pyramid-${this.name}`
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
    if (this.labels && this.valueAxis) {
      this.loadValueFormat(value);
    }
  }

  chartID;
  chart;
  labels: any;
  valueAxis: any;
  columns: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);

    this.loadChartData(chart);

    // Use only absolute numbers
    chart.numberFormatter.numberFormat = '#.#s';

    // Create axes
    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.labels.template.fontSize = 12;

    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.extraMin = 0.1;
    valueAxis.extraMax = 0.1;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.labels.template.fontSize = 12;
    this.valueFormat;

    valueAxis.renderer.grid.template.strokeWidth = 0;
    valueAxis.renderer.grid.template.disabled = true;
    this.valueAxis = valueAxis;

    chart.legend = new am4charts.Legend();
    chart.legend.contentAlign = 'right';

    // Create series
    let male = chart.series.push(new am4charts.ColumnSeries());
    male.dataFields.valueX = this.value1;
    male.dataFields.categoryY = this.category;
    male.clustered = false;
    male.columns.template.column.fillOpacity = 0.8;
    male.name = this.valueName1;

    let maleLabel = male.bullets.push(new am4charts.LabelBullet());
    maleLabel.label.hideOversized = false;
    maleLabel.label.truncate = false;
    maleLabel.label.horizontalCenter = 'right';
    maleLabel.label.dx = -10;
    maleLabel.label.fontSize = 12;


    let female = chart.series.push(new am4charts.ColumnSeries());
    female.dataFields.valueX = this.value2;
    female.dataFields.categoryY = this.category;
    female.clustered = false;
    female.columns.template.column.fillOpacity = 0.8;
    female.columns.template.tooltipText = '{categoryY} años';
    female.name = this.valueName2;

    this.columns = { male, female }

    let femaleLabel = female.bullets.push(new am4charts.LabelBullet());
    femaleLabel.label.hideOversized = false;
    femaleLabel.label.truncate = false;
    femaleLabel.label.horizontalCenter = 'left';
    femaleLabel.label.dx = 10;
    femaleLabel.label.fontSize = 12;

    let maleRange = valueAxis.axisRanges.create();
    maleRange.value = -100;
    maleRange.endValue = 0;
    maleRange.label.fill = chart.colors.list[0];
    maleRange.label.dy = 20;
    maleRange.label.fontWeight = '600';
    maleRange.grid.strokeOpacity = 1;

    let femaleRange = valueAxis.axisRanges.create();
    femaleRange.value = 0;
    femaleRange.endValue = 100;
    femaleRange.label.align = 'right'
    femaleRange.label.fill = chart.colors.list[1];
    femaleRange.label.dy = 20;
    femaleRange.label.fontWeight = '600';
    femaleRange.grid.strokeOpacity = 1;


    this.labels = { labelLeft: maleLabel, labelRight: femaleLabel };
    this.loadValueFormat(this.valueFormat);
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  loadValueFormat(valueFormat) {
    this.columns.male.columns.template.tooltipText = `{categoryY} años: [bold]{valueX} ${this.valueFormat ? this.valueFormat : ''}[/]`;
    this.columns.female.columns.template.tooltipText = `{categoryY} años: [bold]{valueX} ${this.valueFormat ? this.valueFormat : ''}[/]`;
    // this.labels.labelLeft.label.text = `{valueX} ${valueFormat ? valueFormat : ''}`;
    // this.labels.labelRight.label.text = `{valueX} ${valueFormat ? valueFormat : ''}`;

    this.labels.labelLeft.label.truncate = true;
    this.valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return `${text} ${valueFormat !== false && valueFormat?.length === 1 ? valueFormat : ''}`;
    })
  }
}
