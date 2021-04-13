import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartLineOptions,
  chartBarOptions,
  chartDoughnutOptions,
  chartPieOptions,
  addDataToChart,
  colors
} from "../../variables/charts";

import {
  dataset_1,
  dataset_2,
  dataset_3,
  dataset_4
} from "../../variables/datasets";

import * as moment from 'moment';
import { DatasetsService } from 'src/app/services/datasets.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {
  public genericChart;
  public chart1;
  public chart2;
  public chart3;
  public chart4;

  public countriesInfo = [];

  constructor(
    private datasetService: DatasetsService
  ) { }

  ngOnInit(): void {
    parseOptions(Chart, chartOptions());
    // this.loadGenericCharts();
    this.getInvestment();
  }

  loadGenericCharts() {
    const chartSales = document.getElementById('chart-sales');

    this.genericChart = new Chart(chartSales, {
      type: 'line',
      options: chartLineOptions.options,
      data: addDataToChart(chartLineOptions, dataset_1)
    });

    const chartOrders = document.getElementById('chart-orders');

    this.genericChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartBarOptions.options,
      data: addDataToChart(chartBarOptions, dataset_2, 'sales')
    });

    const chartGender = document.getElementById('chart-gender');

    this.genericChart = new Chart(chartGender, {
      type: 'doughnut',
      options: chartDoughnutOptions.options,
      data: addDataToChart(chartDoughnutOptions, dataset_3, 'gender')
    });

    const chartDevices = document.getElementById('chart-devices');

    this.genericChart = new Chart(chartDevices, {
      type: 'pie',
      options: chartPieOptions.options,
      data: addDataToChart(chartPieOptions, dataset_4, 'device')
    });
  }

  getInvestment() {
    this.datasetService.getInvestment().subscribe((res: any) => {
      const { data } = res;
      this.getInvestmentByMonth(data);
      this.getInvestmentByCountry(data);
      this.getInvestmentBySector(data);
      this.getInvestmentCountrySector(data)
    })
  }

  getInvestmentByMonth(data) {
    const { investment_by_month } = data;
    let chartLabels = [];
    let chartData = [];

    for (const month of investment_by_month) {
      chartLabels.push(moment(month.date).format('MMM YYYY'));
      const value = ((+month.value.toString().slice(0, -2)) / 1000).toString()
      chartData.push(value);
    }

    const chartInfo = {
      labels: chartLabels,
      datasets: [{ data: chartData }]
    }
    const chartInvMonth = document.getElementById('chart-inv-month');

    this.chart1 = new Chart(chartInvMonth, {
      type: 'bar',
      options: chartBarOptions.options,
      data: addDataToChart(chartBarOptions, chartInfo)
    });

    const chartInvMonthLine = document.getElementById('chart-inv-country-month');
    this.chart4 = new Chart(chartInvMonthLine, {
      type: 'line',
      options: chartLineOptions.options,
      data: addDataToChart(chartLineOptions, chartInfo)
    });
  }

  getInvestmentByCountry(data) {
    const { investment_by_country } = data;
    let chartLabels = [];
    let chartData = [];

    for (const country of investment_by_country) {
      chartLabels.push(country.name);
      const value = (+country.value.toString().slice(0, -2))
      chartData.push(value);
    }

    const chartInfo = {
      labels: chartLabels,
      datasets: [{ data: chartData, backgroundColor: colors.colorList }],
    }
    const chartInvCountry = document.getElementById('chart-inv-country');

    const datasets = [
      chartInfo
    ]
    this.chart2 = new Chart(chartInvCountry, {
      type: 'doughnut',
      options: chartDoughnutOptions.options,
      data: chartInfo
      // data: addDataToChart(chartDoughnutOptions, chartInfo),
    });
  }

  getInvestmentBySector(data) {
    const { investment_by_sector } = data;
    let chartLabels = [];
    let chartData = [];

    for (const sector of investment_by_sector) {
      chartLabels.push(sector.name);
      const value = (+sector.value.toString().slice(0, -2))
      chartData.push(value);
    }

    const chartInfo = {
      labels: chartLabels,
      datasets: [{ data: chartData }]
    }
    const chartInvSector = document.getElementById('chart-inv-sector');
    const chartInvSector2 = document.getElementById('chart-inv-sector-2');

    this.chart3 = new Chart(chartInvSector, {
      type: 'doughnut',
      options: chartDoughnutOptions.options,
      data: addDataToChart(chartDoughnutOptions, chartInfo),
    });
    this.chart3 = new Chart(chartInvSector2, {
      type: 'doughnut',
      options: chartDoughnutOptions.options,
      data: addDataToChart(chartDoughnutOptions, chartInfo),
    });
  }

  getInvestmentCountrySector(data) {
    this.countriesInfo = data.investment_country_sector;

  }
}
