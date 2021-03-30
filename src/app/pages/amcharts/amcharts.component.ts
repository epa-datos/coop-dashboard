import { Component, OnInit, Inject, NgZone, PLATFORM_ID, AfterViewInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

// amCharts imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DatasetsService } from 'src/app/services/datasets.service';
import { serializeNodes } from '@angular/compiler/src/i18n/digest';

@Component({
  selector: 'app-amcharts',
  templateUrl: './amcharts.component.html',
  styleUrls: ['./amcharts.component.scss']
})
export class AmchartsComponent implements OnInit, AfterViewInit, OnDestroy {
  private chart: am4charts.XYChart;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private datasetService: DatasetsService) { }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    // this.loadChart();
  }

  ngAfterViewInit() {
    this.datasetService.getInvestment().subscribe((res: any) => {
      const { data } = res;
      this.getInvestmentByMonth(data);
      this.getInvestmentByCountry(data);
      this.getInvestmentBySector(data);
    })
  }

  getInvestmentByMonth(data) {
    const investment_by_month = [...data.investment_by_month];
    // Chart code goes in here
    this.browserOnly(() => {
      for (const month of investment_by_month) {
        // month.date = moment(month.date).format('MMM YYYY');
        month.value = ((+month.value.toString().slice(0, -2)) / 1000).toString()
      }


      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chart-inv-month", am4charts.XYChart);
      chart.data = investment_by_month;
      // Create axes

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      // dateAxis.dataFields.date = "date";
      dateAxis.renderer.labels.template.rotation = -20;
      dateAxis.renderer.labels.template.fontSize = 12;
      dateAxis.renderer.grid.template.disabled = true;
      dateAxis.renderer.grid.template.location = 0;

      // dateAxis.renderer.grid.template.location = 0;
      // dateAxis.renderer.minGridDistance = 30;
      dateAxis.dateFormatter.inputDateFormat = "yyyy-MM"
      dateAxis.dateFormatter = new am4core.DateFormatter();
      dateAxis.dateFormatter.dateFormat = "MM-dd";

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.grid.template.disabled = true;

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.name = "Value";


      series.columns.template.tooltipText = "{dateX}: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = .8;

      series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });



      let columnTemplate = series.columns.template;
      columnTemplate.strokeOpacity = 0;
      chart.colors.list = [
        am4core.color('#0096d6'),
        am4core.color('#5603ad'),
        am4core.color('#a77dcc'),
        am4core.color('#f799ff'),
        am4core.color('#cc0766'),
        am4core.color('#f89934'),
        am4core.color('#fbc001'),
        am4core.color('#288000'),
        am4core.color('#2f9998')
      ]
      // chart.responsive.enabled = true;

      // series.heatRules.push({
      //   target: columnTemplate,
      //   property: "fill",
      //   dataField: "valueY",
      //   min: am4core.color("#00003f"),
      //   max: am4core.color("#00ace6")
      // });
    });
  }

  getInvestmentByCountry(data) {
    const investment_by_country = [...data.investment_by_country];
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chart-inv-country", am4charts.PieChart);
      chart.data = investment_by_country;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "name";

      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(50);

      // Put a thick white border around each Slice
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template
        // change the cursor on hover to make it apparent the object can be interacted with
        .cursorOverStyle = [
          {
            "property": "cursor",
            "value": "pointer"
          }
        ];

      // pieSeries.alignLabels = false;
      // pieSeries.labels.template.bent = false;
      // pieSeries.labels.template.radius = 3;
      // pieSeries.labels.template.padding(0, 0, 0, 0);
      pieSeries.labels.template.disabled = true;

      // dateAxis.renderer.labels.template.fontSize = 12;

      pieSeries.ticks.template.disabled = true;

      // Create a base filter effect (as if it's not there) for the hover to return to
      let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;

      // Create hover state
      let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

      // Slightly shift the shadow and make it more prominent on hover
      let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.opacity = 0.7;
      hoverShadow.blur = 5;

      // Add a legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = "left";
      chart.legend.fontSize = 12;
      chart.legend.useDefaultMarker = true;
      let marker = chart.legend.markers.template.children.getIndex(0);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.height = 15;
      marker.width = 15;
      chart.responsive.enabled = true;

      pieSeries.colors.list = [
        am4core.color('#0096d6'),
        am4core.color('#5603ad'),
        am4core.color('#a77dcc'),
        am4core.color('#f799ff'),
        am4core.color('#cc0766'),
        am4core.color('#f89934'),
        am4core.color('#fbc001'),
        am4core.color('#288000'),
        am4core.color('#2f9998')
      ]
    });
  }

  getInvestmentBySector(data) {
    const investment_by_sector = [...data.investment_by_sector];
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      let chart = am4core.create("chart-inv-sector", am4charts.PieChart);
      chart.data = investment_by_sector;

      // Add and configure Series
      let pieSeries = chart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "value";
      pieSeries.dataFields.category = "name";

      // Let's cut a hole in our Pie chart the size of 30% the radius
      chart.innerRadius = am4core.percent(50);

      // Put a thick white border around each Slice
      pieSeries.slices.template.stroke = am4core.color("#fff");
      pieSeries.slices.template.strokeWidth = 2;
      pieSeries.slices.template.strokeOpacity = 1;
      pieSeries.slices.template
        // change the cursor on hover to make it apparent the object can be interacted with
        .cursorOverStyle = [
          {
            "property": "cursor",
            "value": "pointer"
          }
        ];

      // pieSeries.alignLabels = false;
      // pieSeries.labels.template.bent = false;
      // pieSeries.labels.template.radius = 3;
      // pieSeries.labels.template.padding(0, 0, 0, 0);
      pieSeries.labels.template.disabled = true;

      // dateAxis.renderer.labels.template.fontSize = 12;

      pieSeries.ticks.template.disabled = true;

      // Create a base filter effect (as if it's not there) for the hover to return to
      let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
      shadow.opacity = 0;

      // Create hover state
      let hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists

      // Slightly shift the shadow and make it more prominent on hover
      let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
      hoverShadow.opacity = 0.7;
      hoverShadow.blur = 5;

      // Add a legend
      chart.legend = new am4charts.Legend();
      chart.legend.position = "left";
      chart.legend.fontSize = 12;
      chart.legend.useDefaultMarker = true;

      let marker = chart.legend.markers.template.children.getIndex(0);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.height = 15;
      marker.width = 15;
      chart.responsive.enabled = true;


      pieSeries.colors.list = [
        am4core.color('#0096d6'),
        am4core.color('#5603ad'),
        am4core.color('#a77dcc'),
        am4core.color('#f799ff'),
        am4core.color('#cc0766'),
        am4core.color('#f89934'),
        am4core.color('#fbc001'),
        am4core.color('#288000'),
        am4core.color('#2f9998')
      ]
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
