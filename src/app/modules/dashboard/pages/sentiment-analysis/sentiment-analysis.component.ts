import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sentiment-analysis',
  templateUrl: './sentiment-analysis.component.html',
  styleUrls: ['./sentiment-analysis.component.scss']
})
export class SentimentAnalysisComponent implements OnInit {

  activeTabView = 1;

  distributionPieChart = [
    { category: 'Mala experiencia', value: 12.98 },
    { category: 'Insatisfacción', value: 18.73 },
    { category: 'Satisfacción', value: 24.26 },
    { category: 'Agradecimiento', value: 21.28 },
    { category: 'Excelente experiencia', value: 22.27 }
  ];

  // distributionBarChart = [...this.distributionPieChart].sort().reverse();

  distributionBarChart = [...this.distributionPieChart];

  distributionReqStatus: number = 2;


  distributionOverTime = [
    {
      'name': 'Mala experiencia',
      'serie': [
        {
          'date': '2021-07-13',
          'value': 0.2
        },
        {
          'date': '2021-07-14',
          'value': 0.14
        },
        {
          'date': '2021-07-15',
          'value': 0.16
        },
        {
          'date': '2021-07-16',
          'value': 0.18
        },
        {
          'date': '2021-07-17',
          'value': 0.3
        },
        {
          'date': '2021-07-18',
          'value': 0.27
        },
        {
          'date': '2021-07-19',
          'value': 0.25
        },
        {
          'date': '2021-07-20',
          'value': 0.45
        },
        {
          'date': '2021-07-21',
          'value': 0.12
        },
        {
          'date': '2021-07-22',
          'value': 0.25
        },
        {
          'date': '2021-07-23',
          'value': 0.26
        },
        {
          'date': '2021-07-24',
          'value': 2.8
        },
        {
          'date': '2021-07-25',
          'value': 2.12
        },
        {
          'date': '2021-07-26',
          'value': 3.16
        },
        {
          'date': '2021-07-27',
          'value': 4.1
        }
      ],
      'valueFormat': '%'
    },
    {
      'name': 'Insatiscacción',
      'serie': [
        {
          'date': '2021-07-13',
          'value': 1.4
        },
        {
          'date': '2021-07-14',
          'value': 1.1
        },
        {
          'date': '2021-07-15',
          'value': 1.16
        },
        {
          'date': '2021-07-16',
          'value': 2.1
        },
        {
          'date': '2021-07-17',
          'value': 1.6
        },
        {
          'date': '2021-07-18',
          'value': 3.2
        },
        {
          'date': '2021-07-19',
          'value': 3.9
        },
        {
          'date': '2021-07-20',
          'value': 1.8
        },
        {
          'date': '2021-07-21',
          'value': 2.6
        },
        {
          'date': '2021-07-22',
          'value': 2.3
        },
        {
          'date': '2021-07-23',
          'value': 1.45
        },
        {
          'date': '2021-07-24',
          'value': 0.87
        },
        {
          'date': '2021-07-25',
          'value': 0.32
        },
        {
          'date': '2021-07-26',
          'value': 0.98
        },
        {
          'date': '2021-07-27',
          'value': 0.45
        }
      ],
      'valueFormat': '%'
    },
    {
      'name': 'Satisfacción',
      'serie': [
        {
          'date': '2021-07-13',
          'value': 0.1
        },
        {
          'date': '2021-07-14',
          'value': 0.7
        },
        {
          'date': '2021-07-15',
          'value': 0.55
        },
        {
          'date': '2021-07-16',
          'value': 0.7
        },
        {
          'date': '2021-07-17',
          'value': 0.87
        },
        {
          'date': '2021-07-18',
          'value': 1.14
        },
        {
          'date': '2021-07-19',
          'value': 2.1
        },
        {
          'date': '2021-07-20',
          'value': 3.16
        },
        {
          'date': '2021-07-21',
          'value': 2.6
        },
        {
          'date': '2021-07-22',
          'value': 4.1
        },
        {
          'date': '2021-07-23',
          'value': 2.4
        },
        {
          'date': '2021-07-24',
          'value': 1.3
        },
        {
          'date': '2021-07-25',
          'value': 1.8
        },
        {
          'date': '2021-07-26',
          'value': 2.1
        },
        {
          'date': '2021-07-27',
          'value': 3.6
        }
      ],
      'valueFormat': '%'
    },
    {
      'name': 'Agradecimiento',
      'serie': [
        {
          'date': '2021-07-13',
          'value': 1.1
        },
        {
          'date': '2021-07-14',
          'value': 3.7
        },
        {
          'date': '2021-07-15',
          'value': 2.55
        },
        {
          'date': '2021-07-16',
          'value': 1.7
        },
        {
          'date': '2021-07-17',
          'value': 0.47
        },
        {
          'date': '2021-07-18',
          'value': 1.18
        },
        {
          'date': '2021-07-19',
          'value': 2.5
        },
        {
          'date': '2021-07-20',
          'value': 3.25
        },
        {
          'date': '2021-07-21',
          'value': 4.6
        },
        {
          'date': '2021-07-22',
          'value': 4.6
        },
        {
          'date': '2021-07-23',
          'value': 3.4
        },
        {
          'date': '2021-07-24',
          'value': 2.3
        },
        {
          'date': '2021-07-25',
          'value': 2.8
        },
        {
          'date': '2021-07-26',
          'value': 3.1
        },
        {
          'date': '2021-07-27',
          'value': 4.6
        }
      ],
      'valueFormat': '%'
    },
    {
      'name': 'Excelente experiencia',
      'serie': [
        {
          'date': '2021-07-13',
          'value': 2.1
        },
        {
          'date': '2021-07-14',
          'value': 2.7
        },
        {
          'date': '2021-07-15',
          'value': 3.21
        },
        {
          'date': '2021-07-16',
          'value': 2.7
        },
        {
          'date': '2021-07-17',
          'value': 1.47
        },
        {
          'date': '2021-07-18',
          'value': 4.18
        },
        {
          'date': '2021-07-19',
          'value': 3.5
        },
        {
          'date': '2021-07-20',
          'value': 2.25
        },
        {
          'date': '2021-07-21',
          'value': 3.2
        },
        {
          'date': '2021-07-22',
          'value': 2.6
        },
        {
          'date': '2021-07-23',
          'value': 1.4
        },
        {
          'date': '2021-07-24',
          'value': 3.3
        },
        {
          'date': '2021-07-25',
          'value': 4.8
        },
        {
          'date': '2021-07-26',
          'value': 2.1
        },
        {
          'date': '2021-07-27',
          'value': 4.6
        }
      ],
      'valueFormat': '%'
    }
  ];

  distributionOverTimeReqStatus: number = 2;

  chatsByCategories = [
    { category: 'PS', value: 32424 },
    { category: 'HW Print', value: 16599 },
    { category: 'Supplies', value: 4238 }
  ];

  chatsByCategoriesReqStatus: number = 2;

  chatsByCountries = [
    { country: 'Perú', value: 14109 },
    { country: 'Chile', value: 13672 },
    { country: 'México', value: 12180 },
    { country: 'Argentina', value: 5938 },
    { country: 'Colombia', value: 5730 },
    { country: 'CACE', value: 1055 },
    { country: 'Ecuador', value: 369 },
    { country: 'Paraguay', value: 206 },
  ];

  chatsByCountriesReqStatus: number = 2;

  categories = {
    ps: {
      data: [
        { category: 'Laptop', value: 30321 },
        { category: 'Display', value: 703 },
        { category: 'Accesorios', value: 645 },
        { category: 'Desktop', value: 448 },
      ],
      reqStatus: 2
    },
    hwPrint: {
      data: [
        { category: 'CISS', value: 5966 },
        { category: 'Ink Advantage', value: 3706 },
        { category: 'Laserjet', value: 2802 },
        { category: 'CTSS', value: 725 },
        { category: 'Officejet Pro', value: 168 },
        { category: 'AIO', value: 90 },
        { category: 'Plotter', value: 6 },
      ],
      reqStatus: 2
    },
    supplies: {
      data: [
        { category: 'Supplies-Ink', value: 3049 },
        { category: 'Supples-Toner', value: 1187 },
      ],
      reqStatus: 2
    }
  };

  searchedAttributes = [
    { attribute: 'Ram', value: 4943 },
    { attribute: 'Storage', value: 4449 },
    { attribute: 'Toner', value: 3263 },
    { attribute: 'Impresión - Alto', value: 2993 },
    { attribute: 'Processor', value: 2342 },
    { attribute: 'Negro', value: 2309 },
    { attribute: 'Graphics', value: 2255 },
    { attribute: 'Battery', value: 2238 },
    { attribute: 'Color', value: 1927 },
    { attribute: 'Others', value: 13465 },
  ];

  searchedAttributesReqStatus: number = 2;


  reasonsSeriesChart = [

  ]

  reasons = [
    {
      children: [
        {
          name: 'Work',
          value: 20.65
        },
        {
          name: 'Study & edu',
          value: 15.5
        },
        {
          name: 'Supplies',
          value: 14.73
        },
        {
          name: 'Gamming',
          value: 14.21
        },
        {
          name: 'Design & creativity',
          value: 8.35
        },
        {
          name: 'Disponibilidad',
          value: 6.62
        },
        {
          name: 'Rendimiento',
          value: 2.06
        },
        {
          name: 'Conectividad',
          value: 7.89
        },
        {
          name: 'Tienda',
          value: 2.02
        },
        {
          name: 'Garantia',
          value: 2.01
        },
        {
          name: 'Warranty',
          value: 1.23
        },
        {
          name: 'Precio',
          value: 2.0
        },
        {
          name: 'Garantía',
          value: 1.17
        },
        {
          name: 'Reclamo',
          value: 1.16
        },
        {
          name: 'Búsqueda',
          value: 0.75
        }
      ]
    },
  ];

  reasonsReqStatus = 2;

  retailers = {
    data: [
      {
        retailer: 'Ripley',
        bad_experience: 3.13,
        dissatisfaction: 4.29,
        satisfaction: 5.71,
        gratitude: 4.79,
        excellent_experience: 5.09,
      },
      {
        retailer: 'Office Depot',
        bad_experience: 2.79,
        dissatisfaction: 3.55,
        satisfaction: 4.22,
        gratitude: 3.93,
        excellent_experience: 5.04,
      },
      {
        retailer: 'Falabella',
        bad_experience: 1.91,
        dissatisfaction: 2.59,
        satisfaction: 3.64,
        gratitude: 3.02,
        excellent_experience: 2.75,
      },
      {
        retailer: 'Exito',
        bad_experience: 1.13,
        dissatisfaction: 1.58,
        satisfaction: 2.1,
        gratitude: 1.89,
        excellent_experience: 1.99,
      },
      {
        retailer: 'Fravega',
        bad_experience: 1.06,
        dissatisfaction: 1.7,
        satisfaction: 2.04,
        gratitude: 1.82,
        excellent_experience: 1.87,
      },
      {
        retailer: 'Hiraoka',
        bad_experience: 1.12,
        dissatisfaction: 1.41,
        satisfaction: 1.79,
        gratitude: 1.72,
        excellent_experience: 1.94,
      },
      {
        retailer: 'Paris',
        bad_experience: 0.82,
        dissatisfaction: 1.21,
        satisfaction: 1.61,
        gratitude: 1.38,
        excellent_experience: 1.3,
      },
      {
        retailer: 'Office Max',
        bad_experience: 0.59,
        dissatisfaction: 0.87,
        satisfaction: 0.97,
        gratitude: 1.01,
        excellent_experience: 1.24,
      },
      {
        retailer: 'Musimundo',
        bad_experience: 0.4,
        dissatisfaction: 0.74,
        satisfaction: 0.99,
        gratitude: 0.86,
        excellent_experience: 0.83,
      },
      {
        retailer: 'Pedidos',
        bad_experience: 0.46,
        dissatisfaction: 0.66,
        satisfaction: 0.83,
        gratitude: 0.73,
        excellent_experience: 0.91,
      }
    ],
    chartSeries: [
      { id: 'bad_experience', name: 'Mala experiencia' },
      { id: 'dissatisfaction', name: 'Insatisfacción' },
      { id: 'satisfaction', name: 'Satisfacción' },
      { id: 'gratitude', name: 'Agradecimiento' },
      { id: 'excellent_experience', name: 'Excelente experiencia' }
    ],
    reqStatus: 2
  };

  constructor() { }

  ngOnInit(): void {
  }

}
