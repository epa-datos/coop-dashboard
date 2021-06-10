import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';

@Component({
  selector: 'app-chart-funnel',
  templateUrl: './chart-funnel.component.html',
  styleUrls: ['./chart-funnel.component.scss']
})
export class ChartFunnelComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() category: string = 'category';
  @Input() value: string = 'value';
  @Input() height: string = '350px' // height property value valid in css
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-funnel-${this.name}`
  }

  private _data;
  get data() {
    return this._data;
  }
  @Input() set data(value) {
    this._data = value;
    this.chart && this.loadChartData(this.chart);
  }

  chart;
  chartID;
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
    let chart = am4core.create(this.chartID, am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0;

    this.loadChartData(chart);
    loadLanguage(chart, lang);

    let series = chart.series.push(new am4charts.FunnelSeries());
    series.colors.step = 2;
    series.dataFields.value = 'value';
    series.dataFields.category = 'name';
    series.alignLabels = true;
    series.orientation = 'horizontal';
    series.bottomRatio = 1;
    series.labels.template.fontSize = 14;
    series.labels.template.text = `{category}: [bold]{value}[/]`

    chart.legend = new am4charts.Legend();
    chart.legend.marginTop = 30;
    chart.legend.position = 'bottom';
    chart.legend.fontSize = 12;

    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.height = 15;
    marker.width = 15;
  }

  loadChartData(chart) {
    chart.data = this.data;
    this.chart = chart;
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
