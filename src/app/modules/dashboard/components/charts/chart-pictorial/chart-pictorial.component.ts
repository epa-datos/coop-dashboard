import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-pictorial',
  templateUrl: './chart-pictorial.component.html',
  styleUrls: ['./chart-pictorial.component.scss']
})
export class ChartPictorialComponent implements OnInit, AfterViewInit {

  @Input() value: string = 'value';
  @Input() category: string = 'category';
  @Input() iconPath: string; // an svg icon path. If isnt't provide is necessary to use "iconType" input
  @Input() iconType: string = 'human';

  chart;
  chartID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-pictorial-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart)
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);

    let iconPath = this.iconPath ? this.iconPath : this.getIconPath();

    let chart = am4core.create(this.chartID, am4charts.SlicedChart);

    let series = chart.series.push(new am4charts.PictorialStackedSeries());
    series.dataFields.value = this.value;
    series.dataFields.category = this.category;
    series.alignLabels = false;
    series.fillOpacity = 0.8;

    series.maskSprite.path = iconPath;
    series.ticks.template.locationX = 1;
    series.ticks.template.locationY = 0.5;

    series.labelsContainer.width = 200;
    series.labels.template.fontSize = 12;
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'left';
    chart.legend.valign = 'bottom';
    chart.legend.fontSize = 12;
    chart.responsive.enabled = true;

    // series.colors.list = [
    //   am4core.color('#0096d6'),
    //   am4core.color('#CA70A0'),
    // ];

    this.loadChartData(chart);
  }

  getIconPath(): string {
    let iconPath;
    switch (this.iconType) {
      case 'human':
        iconPath = 'M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z';
        break;

      case 'monitor':
        iconPath = 'M119.93405,7.625H8.06595a5.646,5.646,0,0,0-5.55912,4.70525V93.53014a4.51389,4.51389,0,0,0,4.53957,4.3H53.68847l-.09043,3.6052a4.06956,4.06956,0,0,1-1.2809,2.7904l-5.45487,5.119a5.12215,5.12215,0,0,1-3.50509,1.38708h0A6.10922,6.10922,0,0,0,37.248,116.841v3.534H90.752v-3.534a6.10922,6.10922,0,0,0-6.10922-6.10922h0a5.12216,5.12216,0,0,1-3.50509-1.38708l-5.45487-5.119a4.06956,4.06956,0,0,1-1.2809-2.7904l-.09043-3.6052h46.64208a4.51389,4.51389,0,0,0,4.53957-4.3V12.33025A5.646,5.646,0,0,0,119.93405,7.625Zm-4.537,71.92959H12.603V17.74408H115.397Z'
    }

    return iconPath;
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }
}
