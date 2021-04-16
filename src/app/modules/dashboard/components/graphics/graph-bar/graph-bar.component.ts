import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-graph-bar',
  templateUrl: './graph-bar.component.html',
  styleUrls: ['./graph-bar.component.scss']
})
export class GraphBarComponent implements OnInit, AfterViewInit {

  @Input() data;
  @Input() value: string;
  @Input() category: string;
  graphID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.graphID = `chart-bar${this.name}`
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
    // chart.scrollbarX = new am4core.Scrollbar();

    chart.data = this.data;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    // categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    categoryAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    // series.sequencedInterpolation = true;
    series.dataFields.valueY = this.value;
    series.dataFields.categoryX = this.category;
    series.tooltipText = '[{categoryX}: bold]{valueY}[/]';
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'vertical';

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

  }
}
