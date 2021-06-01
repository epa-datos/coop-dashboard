import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-omnichat-wrapper',
  templateUrl: './omnichat-wrapper.component.html',
  styleUrls: ['./omnichat-wrapper.component.scss']
})
export class OmnichatWrapperComponent implements OnInit {

  kpis: any[] = [
    {
      metricTitle: 'total chats',
      metricName: 'investment',
      metricValue: 380.092
    },
    {
      metricTitle: 'promedio de chats por día',
      metricName: 'clicks',
      metricValue: 998

    },
    {
      metricTitle: '% dedicado al cliente',
      metricName: 'bounce_rate',
      metricValue: 41,
      metricFormat: 'percentage'
    },
    {
      metricTitle: 'mediana de duración',
      metricName: 'transactions',
      metricValue: '00:05:34',
      subMetricTitle: 'Esperado',
      subMetricName: 'cr',
      subMetricValue: '< 10 Min'
    },
    {
      metricTitle: 'mediana de retardo',
      metricName: 'revenue',
      metricValue: '00:00:11',
      subMetricTitle: 'Benchmark',
      subMetricName: 'roas',
      subMetricValue: '< 48 Seg'
    },
    {
      metricTitle: 'total chat',
      metricName: 'revenue',
      metricValue: '4.56/5',
      subMetricTitle: 'roas',
      subMetricName: 'roas',
      subMetricValue: 91.14,
      subMetricFormat: 'percentage',
    }
  ];

  kpisReqStatus = 2;

  chatsByCountry = [
    { country: 'Panama', chats: 18 },
    { country: 'Honduras', chats: 135 },
    { country: 'Guatemala', chats: 202 },
    { country: 'El Salvador', chats: 405 },
    { country: 'Costa Rica', chats: 615 },
    { country: 'Brasil', chats: 625 },
    { country: 'Colombia', chats: 700 },
    { country: 'Argentina', chats: 950 },
    { country: 'Mexico', chats: 1150 },
    { country: 'Peru', chats: 1250 },
    { country: 'Chile', chats: 1300 },
  ];

  chatsByRetailer = [
    { retailer: 'MX - Pedidos', chats: 0 },
    { retailer: 'HN - Jestereo', chats: 0 },
    { retailer: 'HN - Office Depot', chats: 3 },
    { retailer: 'AR - Musimundo', chats: 4 },
    { retailer: 'GT - Office Depot', chats: 6 },
    { retailer: 'SV - Office Depot', chats: 8 },
    { retailer: 'MX - Dusof', chats: 10 },
    { retailer: 'CR - Unimart', chats: 20 },
    { retailer: 'CR - Office Depot', chats: 65 },
    { retailer: 'BR - Casas Bahia', chats: 70 },
    { retailer: 'AR - Carrefour', chats: 95 },
    { retailer: 'BR - Portinfo', chats: 99 },
    { retailer: 'AR - Fravega', chats: 100 },
    { retailer: 'BR - Kalunga', chats: 120 },
    { retailer: 'AR - Garbarino', chats: 145 },
    { retailer: 'BR - Portifino', chats: 150 },
    { retailer: 'AR - Compumundo', chats: 198 },
    { retailer: 'MX - Liverpool', chats: 215 },
    { retailer: 'MX - Walmart', chats: 250 },
    { retailer: 'PE - Rodelag', chats: 320 },
    { retailer: 'PE - Hiroka', chats: 450 },
    { retailer: 'PE - Riplay', chats: 550 },
    { retailer: 'CL- PC Factory', chats: 680 },
    { retailer: 'CL - Alkosto', chats: 750 },
  ];

  chatsByDevices = [
    { name: 'desktop', value: 2500 },
    { name: 'mobile', value: 10500 }
  ];

  devicesReqStatus = 2;

  chatHistory = [{
    date: '2020-11-01',
    value: 73
  }, {
    date: '2020-11-02',
    value: 67
  }, {
    date: '2020-11-03',
    value: 68
  }, {
    date: '2020-11-04',
    value: 65
  }, {
    date: '2020-11-05',
    value: 71
  }, {
    date: '2020-11-06',
    value: 75
  }, {
    date: '2020-11-07',
    value: 74
  }, {
    date: '2020-11-08',
    value: 71
  }, {
    date: '2020-11-09',
    value: 76
  }, {
    date: '2020-11-10',
    value: 77
  }, {
    date: '2020-11-11',
    value: 81
  }, {
    date: '2020-11-12',
    value: 83
  }, {
    date: '2020-11-13',
    value: 80
  }, {
    date: '2020-11-14',
    value: 81
  }, {
    date: '2020-11-15',
    value: 87
  }, {
    date: '2020-11-16',
    value: 82
  }, {
    date: '2020-11-17',
    value: 86
  }, {
    date: '2020-11-18',
    value: 80
  }, {
    date: '2020-11-19',
    value: 87
  }, {
    date: '2020-11-20',
    value: 83
  }, {
    date: '2020-11-21',
    value: 85
  }, {
    date: '2020-11-22',
    value: 84
  }, {
    date: '2020-11-23',
    value: 82
  }, {
    date: '2020-11-24',
    value: 73
  }, {
    date: '2020-11-25',
    value: 71
  }, {
    date: '2020-11-26',
    value: 75
  }, {
    date: '2020-11-27',
    value: 79
  }, {
    date: '2020-11-28',
    value: 70
  }, {
    date: '2020-11-29',
    value: 73
  }, {
    date: '2020-11-30',
    value: 61
  }, {
    date: '2020-12-01',
    value: 62
  }, {
    date: '2020-12-02',
    value: 66
  }, {
    date: '2020-12-03',
    value: 65
  }, {
    date: '2020-12-04',
    value: 73
  }, {
    date: '2020-12-05',
    value: 79
  }, {
    date: '2020-12-06',
    value: 78
  }, {
    date: '2020-12-07',
    value: 78
  }, {
    date: '2020-12-08',
    value: 78
  }, {
    date: '2020-12-09',
    value: 74
  }, {
    date: '2020-12-10',
    value: 73
  }, {
    date: '2020-12-11',
    value: 75
  }, {
    date: '2020-12-12',
    value: 70
  }, {
    date: '2020-12-13',
    value: 77
  }, {
    date: '2020-12-14',
    value: 67
  }, {
    date: '2020-12-15',
    value: 62
  }, {
    date: '2020-12-16',
    value: 64
  }, {
    date: '2020-12-17',
    value: 61
  }, {
    date: '2020-12-18',
    value: 59
  }, {
    date: '2020-12-19',
    value: 53
  }, {
    date: '2020-12-20',
    value: 54
  }, {
    date: '2020-12-21',
    value: 56
  }, {
    date: '2020-12-22',
    value: 59
  }, {
    date: '2020-12-23',
    value: 58
  }, {
    date: '2020-12-24',
    value: 55
  }, {
    date: '2020-12-25',
    value: 52
  }, {
    date: '2020-12-26',
    value: 54
  }, {
    date: '2020-12-27',
    value: 50
  }, {
    date: '2020-12-28',
    value: 50
  }, {
    date: '2020-12-29',
    value: 51
  }, {
    date: '2020-12-30',
    value: 52
  }, {
    date: '2020-12-31',
    value: 58
  }, {
    date: '2021-01-01',
    value: 60
  }, {
    date: '2021-01-02',
    value: 67
  }, {
    date: '2021-01-03',
    value: 64
  }, {
    date: '2021-01-04',
    value: 66
  }, {
    date: '2021-01-05',
    value: 60
  }, {
    date: '2021-01-06',
    value: 63
  }, {
    date: '2021-01-07',
    value: 61
  }, {
    date: '2021-01-08',
    value: 60
  }, {
    date: '2021-01-09',
    value: 65
  }, {
    date: '2021-01-10',
    value: 75
  }, {
    date: '2021-01-11',
    value: 77
  }, {
    date: '2021-01-12',
    value: 78
  }, {
    date: '2021-01-13',
    value: 70
  }, {
    date: '2021-01-14',
    value: 70
  }, {
    date: '2021-01-15',
    value: 73
  }, {
    date: '2021-01-16',
    value: 71
  }, {
    date: '2021-01-17',
    value: 74
  }, {
    date: '2021-01-18',
    value: 78
  }, {
    date: '2021-01-19',
    value: 85
  }, {
    date: '2021-01-20',
    value: 82
  }, {
    date: '2021-01-21',
    value: 83
  }, {
    date: '2021-01-22',
    value: 88
  }, {
    date: '2021-01-23',
    value: 85
  }, {
    date: '2021-01-24',
    value: 85
  }, {
    date: '2021-01-25',
    value: 80
  }, {
    date: '2021-01-26',
    value: 87
  }, {
    date: '2021-01-27',
    value: 84
  }, {
    date: '2021-01-28',
    value: 83
  }, {
    date: '2021-01-29',
    value: 84
  }, {
    date: '2021-01-30',
    value: 81
  }];

  chatsByCategories = [
    { category: 'PS', value: 3200 },
    { category: 'HW Print', value: 1200 },
    { category: 'Supplies', value: 400 }
  ]


  constructor() { }

  ngOnInit(): void {
  }

}
