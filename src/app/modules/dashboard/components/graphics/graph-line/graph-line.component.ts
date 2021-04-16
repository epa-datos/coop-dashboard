import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.scss']
})
export class GraphLineComponent implements OnInit, AfterViewInit {

  @Input() data;
  @Input() value;
  @Input() date;
  graphID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.graphID = `chart-line${this.name}`
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadGraph();
  }

  loadGraph() {
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    let chart = am4core.create(this.graphID, am4charts.XYChart);

    // Add data
    chart.data = this.data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = this.value;
    series.dataFields.dateX = this.date;
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = '{valueY}';
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12)

    // Add scrollbar
    // chart.scrollbarX = new am4charts.XYChartScrollbar();
    // chart.scrollbarX.series.push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

  }
}
