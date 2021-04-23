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

  @Input() categoryX = 'weekday'; // property name in object inside array input data
  @Input() categoryY = 'hour'; // property name in object inside array input data
  @Input() value;
  @Input() height = '350px' // valid css height to chart container
  @Input() showTooltipValue: boolean = true; // show the value in tooltip
  @Input() showGridBorders: boolean = false;
  @Input() showHeatLegend: boolean = true; // lower legend with average values triggering by column hover

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-heat-map-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart)
  }

  chart;
  chartID;
  loadStatus: number = 0;

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
    chart.responsive.enabled = true;

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    let yAxis = chart.yAxes.push(new am4charts.CategoryAxis());

    xAxis.dataFields.category = this.categoryX;
    yAxis.dataFields.category = this.categoryY;

    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.minGridDistance = 40;

    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.inversed = true;
    yAxis.renderer.minGridDistance = 30;

    xAxis.renderer.labels.template.fontSize = 12;
    yAxis.renderer.labels.template.fontSize = 12;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = this.categoryX;
    series.dataFields.categoryY = this.categoryY;
    series.dataFields.value = 'value';
    series.sequencedInterpolation = true;
    series.defaultState.transitionDuration = 3000;

    let bgColor = new am4core.InterfaceColorSet().getFor('background');
    let bgColor2 = am4core.color('#adb5bd');

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 1;
    columnTemplate.strokeOpacity = 0.2;

    if (this.showGridBorders) {
      columnTemplate.stroke = bgColor2;
    } else {
      columnTemplate.stroke = bgColor
    }

    let tooltipLegend = this.showTooltipValue
      ? `{${this.categoryX}}, {${this.categoryY}}: {value.workingValue.formatNumber('#.')}`
      : `{${this.categoryX}} - {${this.categoryY}}`;

    columnTemplate.tooltipText = tooltipLegend;

    columnTemplate.width = am4core.percent(100);
    columnTemplate.height = am4core.percent(100);

    series.heatRules.push({
      target: columnTemplate,
      property: 'fill',
      min: am4core.color(bgColor),
      max: chart.colors.getIndex(0)
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
}
