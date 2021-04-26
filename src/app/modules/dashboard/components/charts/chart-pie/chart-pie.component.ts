import { AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss']
})
export class ChartPieComponent implements OnInit, AfterViewInit {
  private chart: am4charts.XYChart;

  @Input() data;
  @Input() value: string = 'value';
  @Input() category: string = 'category';
  @Input() legendPosition: am4charts.LegendPosition = 'left';

  chartID;
  loadStatus: number = 0;

  private _name: string;
  get name() {
    return this._name;
  }
  @Input() set name(value) {
    this._name = value;
    this.chartID = `chart-pie-${this.name}`
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    this.browserOnly(() => {
      this.loadStatus = 1;
      // Chart code goes in here
      am4core.useTheme(am4themes_animated);
      let chart = am4core.create(this.chartID, am4charts.PieChart);
      chart.data = this.data;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = this.value;
      pieSeries.dataFields.category = this.category;

      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(50);

      // Put a thick white border around each Slice
      pieSeries.slices.template.stroke = am4core.color('#fff');
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template
        // change the cursor on hover to make it apparent the object can be interacted with
        .cursorOverStyle = [
          {
            'property': 'cursor',
            'value': 'pointer'
          }
        ];

      pieSeries.labels.template.disabled = true;
      pieSeries.ticks.template.disabled = true;
      pieSeries.slices.template.fillOpacity = 0.8;

      // Create a base filter effect (as if it's not there) for the hover to return to
      let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;

      // Create hover state
      let hoverState = pieSeries.slices.template.states.getKey('hover'); // normally we have to create the hover state, in this case it already exists

      // Slightly shift the shadow and make it more prominent on hover
      let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.opacity = 0.7;
      hoverShadow.blur = 5;

      // Add a legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = this.legendPosition;
      chart.legend.fontSize = 12;
      chart.legend.useDefaultMarker = true;
      chart.legend.maxHeight = 150;
      chart.legend.scrollable = true;

      let marker = chart.legend.markers.template.children.getIndex(0);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.height = 15;
      marker.width = 15;
      chart.responsive.enabled = true;
      chart.responsive.rules.push({
        relevant: function (target) {
          if (target.pixelWidth <= 600) {
            return true;
          }
          return false;
        },
        state: function (target, stateId) {
          if (target instanceof am4charts.PieSeries) {
            var state = target.states.create(stateId);

            var labelState = target.labels.template.states.create(stateId);
            labelState.properties.disabled = true;

            var tickState = target.ticks.template.states.create(stateId);
            tickState.properties.disabled = true;
            return state;
          }

          return null;
        }
      });

      // pieSeries.colors.list = [
      //   am4core.color('#0096d6'),
      //   am4core.color('#CA70A0'),
      //   am4core.color('#9DADBC'),
      //   am4core.color('#923C6C'),
      //   am4core.color('#394856'),
      // ]

      this.loadStatus = 2;
    })

  }

}
