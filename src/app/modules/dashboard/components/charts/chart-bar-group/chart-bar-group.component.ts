import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chart-bar-group',
  templateUrl: './chart-bar-group.component.html',
  styleUrls: ['./chart-bar-group.component.scss']
})
export class ChartBarGroupComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() height: string = '350px'; // height property value valid in css
  @Input() valueBar1: string = 'value1'; // object property represented as first bar
  @Input() valueBar2: string = 'value2'; // object property represented as second bar
  @Input() valueLine1: string = 'value3'; // object property represented as valueAxis2 (right axis)
  @Input() valueNameBar1: string = 'Value 1'; // for labels and tooltips text
  @Input() valueNameBar2: string = 'Value 2'; // for labels and tooltips text
  @Input() valueNameLine1: string = 'Value 3'; // for labels and tooltips text
  @Input() valueFormatBar1: string;
  @Input() valueFormatBar2: string;
  @Input() valueFormatLine1: string;
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-bar-group-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChart();
  }

  chartID;
  chart;

  langSub: Subscription;

  constructor(
    private appStateService: AppStateService
  ) { }

  ngOnInit(): void {
    this.langSub = this.appStateService.selectedLang$.subscribe((lang: string) => {
      this.loadChart(lang);
    });
  }

  ngAfterViewInit() {
    const defaultLang = this.appStateService.selectedLang;
    this.loadChart(defaultLang);
  }

  /**
 * Load chart 
 * @param [lang] 'es': Spanish | 'en': English | 'pt': Portuguese
 */
  loadChart(lang?: string) {
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create(this.chartID, am4charts.XYChart);
    chart.paddingBottom = 50;
    chart.cursor = new am4charts.XYCursor();

    // will use this to store colors of the same items
    let colors = {};

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataItems.template.text = '';
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.marginTop = -25;
    categoryAxis.adapter.add('tooltipText', (tooltipText, target) => {
      return categoryAxis.tooltipDataItem.dataContext['realName'];
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.min = 0;
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.grid.template.strokeWidth = 0;

    // single column series for all data
    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.columns.template.width = am4core.percent(80);
    columnSeries.tooltipText = '{provider}: {realName}, {valueY}';
    columnSeries.dataFields.categoryX = 'category';
    columnSeries.dataFields.valueY = 'value';
    columnSeries.columns.template.fillOpacity = 0.8;
    columnSeries.columns.template.strokeWidth = 0;
    columnSeries.columns.template.column.cornerRadiusTopLeft = 10;
    columnSeries.columns.template.column.cornerRadiusTopRight = 10;

    // on hover, make corner radiuses bigger
    let hoverState = columnSeries.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    // second value axis for valueLine1
    if (this.valueLine1) {
      let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis2.renderer.opposite = true;
      valueAxis2.syncWithAxis = valueAxis;
      valueAxis2.tooltip.disabled = true;
      valueAxis2.renderer.labels.template.fontSize = 12;
      valueAxis2.renderer.labels.template.adapter.add('text', (text) => {
        return `${text}${this.valueFormatLine1 ? this.valueFormatLine1 : ''}`;
      });

      // valueLine1 line series
      let lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.tooltipText = `{valueY}${this.valueFormatLine1 ? this.valueFormatLine1 : ''}`;
      lineSeries.dataFields.categoryX = 'category';
      lineSeries.dataFields.valueY = this.valueLine1;
      lineSeries.yAxis = valueAxis2;
      lineSeries.bullets.push(new am4charts.CircleBullet());
      lineSeries.stroke = am4core.color('#FCD713');
      lineSeries.strokeOpacity = 0.8;
      lineSeries.fill = lineSeries.stroke;
      lineSeries.strokeWidth = 2;
      lineSeries.snapTooltip = true;
    }

    // fill adapter, here we save color value to colors object so that each time the item has the same name, the same color is used
    columnSeries.columns.template.adapter.add('fill', ((fill, target) => {
      let name = target.dataItem.dataContext['realName'];

      if (name === this.valueNameBar1) {
        return am4core.color('#71B9DA');
      }

      if (name === this.valueNameBar2) {
        return am4core.color('#DE72D0');
      }

      // if (!colors[name]) {
      //   colors[name] = chart.colors.next();
      // }
      // return colors[name];
    }));

    let rangeTemplate = categoryAxis.axisRanges.template;
    rangeTemplate.tick.disabled = false;
    rangeTemplate.tick.location = 0;
    rangeTemplate.tick.strokeOpacity = 0.4;
    rangeTemplate.tick.length = 25;
    rangeTemplate.grid.strokeOpacity = 0.3;
    rangeTemplate.label.tooltip = new am4core.Tooltip();
    rangeTemplate.label.tooltip.dy = -10;
    rangeTemplate.label.cloneTooltip = false;

    ///// DATA
    let chartData = [];
    // process data ant prepare it for the chart
    for (let serieName in this.data) {
      let serieData = this.data[serieName];

      // add data of one provider to temp array
      let tempArray = [];
      let count = 0;
      // add items
      for (let itemName in serieData) {
        if (itemName != this.valueLine1) {
          count++;
          // we generate unique category for each column (serieName + '_' + itemName) and store realName

          let custonName = itemName === this.valueBar1
            ? this.valueNameBar1
            : itemName === this.valueBar2
              ? this.valueNameBar2
              : itemName

          tempArray.push({
            category: serieName + '_' + itemName,
            realName: custonName,
            value: serieData[itemName],
            provider: serieName
          })
        }
      }

      // add quantity and count to middle data item (line series uses it)
      if (this.valueLine1) {
        let lineSeriesDataIndex = Math.floor(count / 2);
        tempArray[lineSeriesDataIndex][this.valueLine1] = serieData[this.valueLine1];
        tempArray[lineSeriesDataIndex].count = count;
        // push to the final data
        am4core.array.each(tempArray, function (item) {
          chartData.push(item);
        })
      }

      // create range (the additional label at the bottom)
      let range = categoryAxis.axisRanges.create();
      range.category = tempArray[0].category;
      range.endCategory = tempArray[tempArray.length - 1].category;
      range.label.text = tempArray[0].provider;
      range.label.dy = 30;
      range.label.truncate = true;
      // range.label.fontWeight = 'bold';
      range.label.tooltipText = tempArray[0].provider;

      range.label.adapter.add('maxWidth', (maxWidth, target) => {
        let range = target.dataItem;
        let startPosition = categoryAxis.categoryToPosition(range['category'], 0);
        let endPosition = categoryAxis.categoryToPosition(range['endCategory'], 1);
        let startX = categoryAxis.positionToCoordinate(startPosition);
        let endX = categoryAxis.positionToCoordinate(endPosition);
        return endX - startX;
      });
    }

    chart.data = chartData;
    this.chart = chart;
    loadLanguage(chart, lang);

    if (chart.data.length > 0) {
      // last tick
      let range = categoryAxis.axisRanges.create();
      range.category = chart.data[chart.data.length - 1].category;
      range.label.disabled = true;
      range.tick.strokeOpacity = 0.4;
      range.tick.location = 1;
      range.grid.location = 1;
    }
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
