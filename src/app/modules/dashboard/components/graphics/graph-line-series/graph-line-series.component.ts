import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-graph-line-series',
  templateUrl: './graph-line-series.component.html',
  styleUrls: ['./graph-line-series.component.scss']
})
export class GraphLineSeriesComponent implements OnInit, AfterViewInit {

  @Input() series;
  graphID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.graphID = `chart-m-line${this.name}`
  }

  chart;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadGraph();
  }

  loadGraph() {
    this.loadStatus = 1;
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create(this.graphID, am4charts.XYChart);

    // Create axes
    let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    for (var i = 0; i < this.series.length; i++) {
      this.createSeries('value' + i, this.series[i].name, this.series[i].serie);
    }

    this.chart.legend = new am4charts.Legend();
    this.chart.legend.position = 'top';
    this.chart.legend.scrollable = true;

    this.chart.legend.itemContainers.template.events.on('over', function (event) {
      processOver(event.target.dataItem.dataContext);
    })

    this.chart.legend.itemContainers.template.events.on('out', function (event) {
      processOut(event.target.dataItem.dataContext);
    })

    this.loadStatus = 2;
  }

  createSeries(s, name, serie) {
    let series = this.chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value' + s;
    series.dataFields.dateX = 'date';
    series.name = name;

    let segment = series.segments.template;
    segment.interactionsEnabled = true;

    let hoverState = segment.states.create('hover');
    hoverState.properties.strokeWidth = 3;

    let dimmed = segment.states.create('dimmed');
    dimmed.properties.stroke = am4core.color('#dadada');

    segment.events.on('over', function (event) {
      processOver(event.target.parent.parent.parent);
    });

    segment.events.on('out', function (event) {
      processOut(event.target.parent.parent.parent);
    });

    let data = [];
    let value;
    for (var i = 0; i < serie.length; i++) {
      value = serie[i].value;
      let dataItem = { date: serie[i].date };
      dataItem['value' + s] = value;
      data.push(dataItem);
    }

    series.data = data;
    return series;
  }
}

function processOver(hoveredSeries) {
  hoveredSeries.toFront();

  hoveredSeries.segments.each(function (segment) {
    segment.setState('hover');
  })

  this.chart.series.each(function (series) {
    if (series != hoveredSeries) {
      series.segments.each(function (segment) {
        segment.setState('dimmed');
      })
      series.bulletsContainer.setState('dimmed');
    }
  });
}

function processOut(hoveredSeries) {
  this.chart.series.each(function (series) {
    series.segments.each(function (segment) {
      segment.setState('default');
    })
    series.bulletsContainer.setState('default');
  });
}