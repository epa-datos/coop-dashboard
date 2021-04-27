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
  @Input() height: string = '350px'; // height property value valid in css
  @Input() uniqueDimensionConf: OneDimensionPictorial;

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

    if (!this.uniqueDimensionConf) {
      // default settings
      chart.legend = new am4charts.Legend();
      chart.legend.position = 'left';
      chart.legend.valign = 'bottom';
      chart.legend.fontSize = 12;
      chart.responsive.enabled = true;
    } else {
      // customize the unique serie
      series.colors.list = [
        am4core.color('#d3d3d3'),
        am4core.color(this.uniqueDimensionConf.color),
      ];

      series.tooltip.label.adapter.add('text', function (text, target) {
        if (target.dataItem._index === 0) return '';
        const percent = Math.round(target.dataItem.values.value.value);
        return `${percent}%`;
      });
    }

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
        break;

      case 'cellphone':
        iconPath = 'M22.507,0H9.175C7.9,0,6.87,1.034,6.87,2.309v27.07c0,1.271,1.03,2.306,2.305,2.306h13.332   c1.273,0,2.307-1.034,2.307-2.306V2.309C24.813,1.034,23.78,0,22.507,0z M23.085,25.672H8.599V3.895h14.486V25.672z M18.932,2.343   h-6.181V1.669h6.182L18.932,2.343L18.932,2.343z M21.577,2.035c0,0.326-0.266,0.59-0.591,0.59c-0.326,0-0.591-0.265-0.591-0.59   s0.265-0.59,0.591-0.59C21.312,1.444,21.577,1.709,21.577,2.035z M18.655,29.225h-5.629v-1.732h5.629V29.225z';
        break;
    }

    return iconPath;
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }
}

export interface OneDimensionPictorial {
  color: string,
}
