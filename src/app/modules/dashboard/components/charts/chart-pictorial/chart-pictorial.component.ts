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
  @Input() iconType: string;
  @Input() height: string = '350px'; // height property value valid in css
  @Input() uniqueDimensionConf: OneDimensionPictorial;
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  chart;
  chartID;

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

    chart.responsive.enabled = true;
    this.loadChartData(chart);
  }

  getIconPath(): string {
    let iconPath;
    switch (this.iconType) {
      case 'man':
        iconPath = 'M682.7,243.8c-4.4-29.2-32-52.8-61.6-52.8c-32.4,0-64.7,0-97.1,0c35.1-9.4,60.8-41.2,60.9-79.2c0.1-45-36.5-81.9-80.4-82.9   c-45.9-1-85.1,36.3-84.7,82.5c0,38.2,25.5,70.1,60.5,79.6c-32.8,0-64.5,0-97.3-0.1c-11.7,0-22.5,2.6-32.5,8.2   c-20.8,11.6-32.4,29.2-32.4,53.5c0,27.7,0,115.3,0,263c0,16.7,9,27.8,24.1,30c17.8,2.6,31.8-5.6,36.2-21.6   c1.1-4.1,1.5-8.5,1.5-12.8c0.1-50.5,0.1-161,0.1-211.5c0-1.7-0.1-3.3,0.1-5c0.6-5.6,4.2-9.2,9.6-9.8c5.7-0.7,9.7,2,11.4,7.1   c0.8,2.5,0.9,5.2,0.9,7.8c0,190.8,0,441.6,0.1,632.5c0,3.6,0.5,7.4,1.8,10.7c8,20.2,26.4,30.4,47.9,27.8   c21.7-2.7,36.6-24.1,36.5-41.5c-0.7-113.3-0.3-226.6-0.3-340c0-11.3,1.8-13.3,12.9-13.8c7.5-0.4,10.7,2.4,11.2,10   c0.1,2,0.1,4,0.1,6c0,113.8,0,227.6,0.1,341.5c0,4.6,1.3,9.6,3.3,13.8c8.2,17,27.4,25.3,48.1,22.8c19-2.3,34.8-16.3,34.6-40.1   c-0.6-94.2-0.3-188.3-0.3-282.5c0-95.5,0-251,0-346.5c0-1.7-0.1-3.3,0.1-5c0.5-6.2,4.9-10.4,11.1-10.6c7.6-0.3,11.8,4.2,11.8,12.7   c0,43.3,0,146.7,0,190c0,9.5-0.3,19,0.1,28.5c0.7,19,13.8,30.3,34,29.8c17.1-0.4,27.7-12,27.7-30.5c0-148.7,0-237.3,0-266   C682.8,247.5,682.9,245.6,682.7,243.8z';
        break;

      case 'woman':
        iconPath = 'M722.3,489.9c-40.9-113.8-70.7-195.5-90.3-249.6c-4.1-11.2-9.6-21.6-17.8-30.4c-9.4-10.1-20.4-15.7-34.7-15.6  c-19.6,0.1-39.1,0.2-58.7,0.3c34.5-9.6,59.9-41.1,59.6-78.5C580,65,537.1,33.2,498.7,34.8c-38.4-1.7-81.3,30.2-81.7,81.3  c-0.3,37.4,25.1,68.9,59.5,78.5c-18.7,0-37.4-0.1-56.1-0.2c-14.2-0.1-25.1,5.3-34.4,15.3c-8.9,9.6-14.5,21-18.9,33.2  c-16,44-41.8,114.8-79,217.6c-4.6,12.6-9.4,25.3-12.2,38.4c-2.6,11.7-1.1,23.7,6.6,33.8c5.6,7.4,13.2,11.3,22.6,10.2  c10-1.2,17-6.4,20.8-16.2c20.6-52.5,51.3-134.9,72.3-187.3c2-4.9,5.7-9.3,9.3-13.4c2.5-2.9,5.4-1.7,6.2,1.9c0.7,3,1,6.3,0.6,9.4  c-13.5,99.4-41.4,200.5-71.2,296.2c-3.7,12-7.7,24-11.8,36.8c25.3,0,50,0,74.9,0c0,2.9,0,5.1,0,7.2c0,83.7,0,167.3,0,251  c0,31.7,26.4,51.8,57,43.4c17.5-4.8,28.9-20.8,28.9-40.9c0-83.2,0-166.3,0-249.5c0-2.3,0-4.5,0-7.1c5.7,0,10.6,0,16.5,0  c0,2.7,0,5,0,7.3c0,81.8,0.1,163.7-0.1,245.5c0,10.6,3,20.1,8.5,28.8c10.9,17,25.6,20.6,42.2,17.7c19.3-3.3,35.5-24,35.5-44.1  c0-83,0-166,0-249c0-2.1,0-4.1,0-6.6c25.7,0,50.4,0,75.9,0c-2.2-7.1-4.2-13.5-6.1-20c-27.1-89.5-61.2-210.2-75-303  c-1-6.9-1.4-13.9-1.5-20.9c0-2.1,1.8-4.3,2.8-6.5c2.1,1.1,4.8,1.8,6.1,3.5c2.8,3.5,5.4,7.2,7.1,11.3  c21.2,53.2,50.2,137.4,71.1,190.6c3,7.6,8,12.5,16,14.3c12.5,2.8,25.6-4.8,30.8-18.2C726.3,513.6,726.4,501.5,722.3,489.9z';
        break;

      case 'monitor':
        iconPath = 'M119.93405,7.625H8.06595a5.646,5.646,0,0,0-5.55912,4.70525V93.53014a4.51389,4.51389,0,0,0,4.53957,4.3H53.68847l-.09043,3.6052a4.06956,4.06956,0,0,1-1.2809,2.7904l-5.45487,5.119a5.12215,5.12215,0,0,1-3.50509,1.38708h0A6.10922,6.10922,0,0,0,37.248,116.841v3.534H90.752v-3.534a6.10922,6.10922,0,0,0-6.10922-6.10922h0a5.12216,5.12216,0,0,1-3.50509-1.38708l-5.45487-5.119a4.06956,4.06956,0,0,1-1.2809-2.7904l-.09043-3.6052h46.64208a4.51389,4.51389,0,0,0,4.53957-4.3V12.33025A5.646,5.646,0,0,0,119.93405,7.625Zm-4.537,71.92959H12.603V17.74408H115.397Z'
        break;

      case 'cellphone':
        iconPath = 'M22.507,0H9.175C7.9,0,6.87,1.034,6.87,2.309v27.07c0,1.271,1.03,2.306,2.305,2.306h13.332   c1.273,0,2.307-1.034,2.307-2.306V2.309C24.813,1.034,23.78,0,22.507,0z M23.085,25.672H8.599V3.895h14.486V25.672z M18.932,2.343   h-6.181V1.669h6.182L18.932,2.343L18.932,2.343z M21.577,2.035c0,0.326-0.266,0.59-0.591,0.59c-0.326,0-0.591-0.265-0.591-0.59   s0.265-0.59,0.591-0.59C21.312,1.444,21.577,1.709,21.577,2.035z M18.655,29.225h-5.629v-1.732h5.629V29.225z';
        break;

      default:
        iconPath = 'M682.7,243.8c-4.4-29.2-32-52.8-61.6-52.8c-32.4,0-64.7,0-97.1,0c35.1-9.4,60.8-41.2,60.9-79.2c0.1-45-36.5-81.9-80.4-82.9   c-45.9-1-85.1,36.3-84.7,82.5c0,38.2,25.5,70.1,60.5,79.6c-32.8,0-64.5,0-97.3-0.1c-11.7,0-22.5,2.6-32.5,8.2   c-20.8,11.6-32.4,29.2-32.4,53.5c0,27.7,0,115.3,0,263c0,16.7,9,27.8,24.1,30c17.8,2.6,31.8-5.6,36.2-21.6   c1.1-4.1,1.5-8.5,1.5-12.8c0.1-50.5,0.1-161,0.1-211.5c0-1.7-0.1-3.3,0.1-5c0.6-5.6,4.2-9.2,9.6-9.8c5.7-0.7,9.7,2,11.4,7.1   c0.8,2.5,0.9,5.2,0.9,7.8c0,190.8,0,441.6,0.1,632.5c0,3.6,0.5,7.4,1.8,10.7c8,20.2,26.4,30.4,47.9,27.8   c21.7-2.7,36.6-24.1,36.5-41.5c-0.7-113.3-0.3-226.6-0.3-340c0-11.3,1.8-13.3,12.9-13.8c7.5-0.4,10.7,2.4,11.2,10   c0.1,2,0.1,4,0.1,6c0,113.8,0,227.6,0.1,341.5c0,4.6,1.3,9.6,3.3,13.8c8.2,17,27.4,25.3,48.1,22.8c19-2.3,34.8-16.3,34.6-40.1   c-0.6-94.2-0.3-188.3-0.3-282.5c0-95.5,0-251,0-346.5c0-1.7-0.1-3.3,0.1-5c0.5-6.2,4.9-10.4,11.1-10.6c7.6-0.3,11.8,4.2,11.8,12.7   c0,43.3,0,146.7,0,190c0,9.5-0.3,19,0.1,28.5c0.7,19,13.8,30.3,34,29.8c17.1-0.4,27.7-12,27.7-30.5c0-148.7,0-237.3,0-266   C682.8,247.5,682.9,245.6,682.7,243.8z';
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
