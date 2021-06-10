import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { loadLanguage } from 'src/app/tools/functions/chart-lang';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-chart-gauge',
  templateUrl: './chart-gauge.component.html',
  styleUrls: ['./chart-gauge.component.scss']
})
export class ChartGaugeComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() value: number = 0;
  @Input() height: string = '350px'; // height property value valid in css
  @Input() status: number = 2; // 0) initial 1) load 2) ready 3) error
  @Input() errorLegend: string;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-gauge-${this.name}`
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

    let chart = am4core.create(this.chartID, am4charts.GaugeChart);
    chart.innerRadius = am4core.percent(82);

    let axis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    axis.renderer.grid.template.stroke = new am4core.InterfaceColorSet().getFor('background');
    axis.renderer.grid.template.strokeOpacity = 0.3;
    axis.renderer.labels.template.fontSize = 12;
    axis.renderer.labels.template.adapter.add('text', function (text) {
      return text + '%';
    })


    let colorSet = new am4core.ColorSet();

    let axis2 = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    axis2.min = 0;
    axis2.max = 100;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = true;

    let range0 = axis2.axisRanges.create();
    range0.value = 0;
    range0.endValue = this.value;
    range0.axisFill.fillOpacity = 1;
    range0.axisFill.fill = colorSet.getIndex(0);

    let range1 = axis2.axisRanges.create();
    range1.value = this.value;
    range1.endValue = 100;
    range1.axisFill.fillOpacity = 1;
    range1.axisFill.fill = am4core.color('#f0f0f0');

    let label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = 25;
    label.x = am4core.percent(50);
    label.y = am4core.percent(100);
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'bottom';
    label.text = `${this.value}%`;

    loadLanguage(chart, lang);
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }
}
