import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-bar-horizontal',
  templateUrl: './chart-bar-horizontal.component.html',
  styleUrls: ['./chart-bar-horizontal.component.scss']
})
export class ChartBarHorizontalComponent implements OnInit, AfterViewInit {

  @Input() data;
  @Input() value: string;
  @Input() category: string;
  @Input() height: string = '350px'; // height property value valid in css

  chartID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-bar-horizontal-${this.name}`
  }
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);
    chart.data = this.data;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = this.category;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 5;
    categoryAxis.renderer.labels.template.horizontalCenter = 'middle';
    categoryAxis.renderer.labels.template.verticalCenter = 'middle';
    categoryAxis.tooltip.disabled = true;


    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

    categoryAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = this.value;
    series.dataFields.categoryY = this.category;
    series.tooltipText = '[{categoryY}: bold]{valueX}[/]';
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = 'left';

    // series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.cornerRadiusBottomRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    let hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.cornerRadiusBottomRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add('fill', function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();
  }
}
