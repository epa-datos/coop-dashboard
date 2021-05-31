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

  @Input() value = 'value'; // property name in the object to show in valueAxis
  @Input() valueName; // property to show in tooltips
  @Input() valueFormat; // USD MXN Copy shown in tooltip
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  chartID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-line-series-${this.name}`
  }

  private _series;
  get series() {
    return this._series;
  }
  @Input() set series(value) {
    this._series = value;
    this.chart && this.loadChartData(this.chart)
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
    chart.numberFormatter.numberFormat = '#,###.##';

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    dateAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontSize = 12;

    dateAxis.renderer.minGridDistance = 50;
    // dateAxis.renderer.labels.template.rotation = -90;

    this.loadChartData(chart);

    chart.legend = new am4charts.Legend();
    chart.legend.position = 'bottom';
    chart.legend.align = 'center';
    chart.legend.contentAlign = 'center';

    chart.legend.scrollable = true;

    chart.legend.itemContainers.template.events.on('over', function (event) {
      processOver(chart, event.target.dataItem.dataContext);
    })

    chart.legend.itemContainers.template.events.on('out', function (event) {
      processOut(chart, event.target.dataItem.dataContext);
    })

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    this.chart = chart;
  }

  loadChartData(chart) {
    chart.series.clear();

    const colors = [
      '#67B6DC',
      '#A367DC',
      '#DC67CE',
      '#DC6967',
      '#DCAE67',
      '#86CC78'
    ]

    for (var i = 0; i < this.series.length; i++) {
      const color = colors[i] ? colors[i] : colors[0]
      createSeries(this.value + i, this.series[i], this.value, this.valueName, this.valueFormat, color);
    }

    function createSeries(s, serieData, serieValueProp, serieValueName, serieValueFormat, color) {
      let name = serieData.name;
      let serie = serieData.serie;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = serieValueProp + s;
      series.dataFields.dateX = 'date';
      series.name = name;
      series.tensionX = 0.85;
      series.strokeWidth = 2;
      series.tooltipText = `${serieValueName ? serieValueName + ': ' : ''}[bold]${typeof serieValueFormat === 'string' ? serieValueFormat : ''} {valueY}[/]`;
      series.tooltip.getFillFromObject = false;

      if (serieData.customLineStye === 'dashed') {
        series.strokeDasharray = "3,4";
      }

      if (serieData.customLineColor) {
        series.stroke = am4core.color(serieData.customLineColor);
        series.tooltip.background.fill = am4core.color(serieData.customLineColor);
      } else {
        series.stroke = am4core.color(color);
        series.tooltip.background.fill = am4core.color(color);
      }

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
        value = serie[i][serieValueProp];
        let dataItem = { date: serie[i].date };
        dataItem[serieValueProp + s] = value;
        data.push(dataItem);
      }

      series.data = data;
      return series;
    }
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
