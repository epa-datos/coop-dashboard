import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-heat-map',
  templateUrl: './chart-heat-map.component.html',
  styleUrls: ['./chart-heat-map.component.scss']
})
export class ChartHeatMapComponent implements OnInit, AfterViewInit {

  @Input() value;
  @Input() height = '350px' // valid css height to chart container
  @Input() showTooltipValue: boolean = true; // show the value in tooltip
  @Input() showGridBorders: boolean = false;
  @Input() gridBordersColor: string = '#ffffff';  // valid css color
  @Input() showHeatLegend: boolean = true; // lower legend with average values triggering by column hover
  @Input() initialColor: string; // valid css color
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;
  @Input() minValue: number; // optional
  @Input() maxValue: number; // optional

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-heat-map-${this.name}`;
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  private _categoryX = 'weekday'; // property name in object inside array input data
  get categoryX() {
    return this._categoryX;
  }
  @Input() set categoryX(value) {
    this._categoryX = value;
    this.axis && this.series && this.assignCategoriesNames(this.axis, this.series);
  }

  private _categoryY = 'hour'; // property name in object inside array input data
  get categoryY() {
    return this._categoryY;
  }
  @Input() set categoryY(value) {
    this._categoryY = value;
    this.axis && this.series && this.assignCategoriesNames(this.axis, this.series);
  }

  chart;
  chartID;
  axis;
  series;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create(this.chartID, am4charts.XYChart);
    chart.maskBullets = false;
    chart.numberFormatter.numberFormat = '#,###.##';

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());


    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 40;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;

    xAxis.renderer.labels.template.fontSize = 12;
    yAxis.renderer.labels.template.fontSize = 12;

    let series = chart.series.push(new am4charts.ColumnSeries());

    this.assignCategoriesNames({ xAxis, yAxis }, series);
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    let bgColor = new am4core.InterfaceColorSet().getFor('background');

    let columnTemplate = series.columns.template;

    if (this.showGridBorders) {
      let bgColor2 = am4core.color(this.gridBordersColor);
      columnTemplate.stroke = bgColor2;
      columnTemplate.strokeWidth = 2;
    } else {
      columnTemplate.stroke = bgColor
      columnTemplate.strokeWidth = 1;
      columnTemplate.strokeOpacity = 0.2;
    }


    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: this.initialColor ? am4core.color(this.initialColor) : am4core.color(bgColor),
      max: chart.colors.getIndex(0),
      minValue: this.minValue && this.minValue,
      maxValue: this.maxValue && this.maxValue
    });

    this.loadChartData(chart);

    if (!this.showHeatLegend) {
      return;
    }

    // heat legend
    let heatLegend = chart.bottomAxesContainer.createChild(am4charts.HeatLegend);
    heatLegend.width = am4core.percent(100);
    heatLegend.series = series;
    heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
    heatLegend.valueAxis.renderer.minGridDistance = 30;

    // heat legend behavior
    series.columns.template.events.on('over', function (event) {
      handleHover(event.target);
    })

    series.columns.template.events.on('hit', function (event) {
      handleHover(event.target);
    })

    series.columns.template.events.on('out', function (event) {
      heatLegend.valueAxis.hideTooltip();
    })

    function handleHover(column) {
      if (!isNaN(column.dataItem.value)) {
        heatLegend.valueAxis.showTooltipAt(column.dataItem.value)
      }
      else {
        heatLegend.valueAxis.hideTooltip();
      }
    }
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  assignCategoriesNames(axis, series) {
    axis.xAxis.dataFields.category = this.categoryX;
    axis.yAxis.dataFields.category = this.categoryY;

    series.dataFields.categoryX = this.categoryX;
    series.dataFields.categoryY = this.categoryY;
    series.dataFields.value = 'value';

    let columnTemplate = series.columns.template;
    let tooltipLegend = this.showTooltipValue
      ? `{${this.categoryX}}, {${this.categoryY}}: {value.workingValue}`
      : `{${this.categoryX}} - {${this.categoryY}}`;

    columnTemplate.tooltipText = tooltipLegend;

    this.axis = axis;
    this.series = series;
  }
}
