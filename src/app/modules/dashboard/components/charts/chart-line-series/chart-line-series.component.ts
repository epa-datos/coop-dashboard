import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-chart-line-series',
  templateUrl: './chart-line-series.component.html',
  styleUrls: ['./chart-line-series.component.scss']
})
export class ChartLineSeriesComponent implements OnInit, AfterViewInit {

  @Input() series;
  chartID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-m-line${this.name}`
  }

  chart;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    this.loadStatus = 1;
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    for (var i = 0; i < this.series.length; i++) {
      createSeries('value' + i, this.series[i].name, this.series[i].serie);
    }

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';
    chart.legend.scrollable = true;

    chart.legend.itemContainers.template.events.on('over', function (event) {
      processOver(chart, event.target.dataItem.dataContext);
    })

    chart.legend.itemContainers.template.events.on('out', function (event) {
      processOut(chart, event.target.dataItem.dataContext);
    })

    function createSeries(s, name, serie) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value' + s;
      series.dataFields.dateX = 'date';
      series.name = name;
      series.tensionX = 0.85;

      let segment = series.segments.template;
      segment.interactionsEnabled = true;

      let hoverState = segment.states.create('hover');
      hoverState.properties.strokeWidth = 3;

      let dimmed = segment.states.create('dimmed');
      dimmed.properties.stroke = am4core.color('#dadada');

      segment.events.on('over', function (event) {
        processOver(chart, event.target.parent.parent.parent);
      });

      segment.events.on('out', function (event) {
        processOut(chart, event.target.parent.parent.parent);
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

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
  }


}

function processOver(chart, hoveredSeries) {
  hoveredSeries.toFront();

  hoveredSeries.segments.each(function (segment) {
    segment.setState('hover');
  })

  chart.series.each(function (series) {
    if (series != hoveredSeries) {
      series.segments.each(function (segment) {
        segment.setState('dimmed');
      })
      series.bulletsContainer.setState('dimmed');
    }
  });
}

function processOut(chart, hoveredSeries) {
  chart.series.each(function (series) {
    series.segments.each(function (segment) {
      segment.setState('default');
    })
    series.bulletsContainer.setState('default');
  });
}