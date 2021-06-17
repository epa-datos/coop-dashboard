import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppStateService } from 'src/app/services/app-state.service';
import { TableItem } from '../generic-table/generic-table.component';

@Component({
  selector: 'app-indexed-wrapper',
  templateUrl: './indexed-wrapper.component.html',
  styleUrls: ['./indexed-wrapper.component.scss']
})
export class IndexedWrapperComponent implements OnInit {

  selectedTab1: number = 1;
  kpisReqStatus = 2;
  trafficDemoStatus = [
    { name: 'device', reqStatus: 2 },
    { name: 'gender', reqStatus: 2 },
    { name: 'age', reqStatus: 2 },
    { name: 'gender-and-age', reqStatus: 2 }
  ];

  mostVistitedProductsColumns: TableItem[] = [
    {
      name: 'ranking',
      title: 'Ranking'
    },
    {
      name: 'product',
      title: 'Producto',
      tooltip: true,
    },
    {
      name: 'users',
      title: 'Usuarios',
      textAlign: 'center',
      formatValue: 'integer',
    }
  ];

  mostVisitedCategoriesColumns: TableItem[] = [
    {
      name: 'ranking',
      title: 'Ranking'
    },
    {
      name: 'category',
      title: 'Categoría',
    },
    {
      name: 'users',
      title: 'Usuarios',
      textAlign: 'center',
      formatValue: 'integer',
    }
  ];

  ////////////////////////////////////

  // kpis
  kpis: any[] = [
    {
      metricTitle: 'usuarios',
      metricName: 'users',
      metricValue: 255322,
      metricFormat: 'integer',
      icon: 'fas fa-users',
      iconBg: '#172b4d'
    },
    {
      metricTitle: 'usuarios nuevos',
      metricName: 'new_useres',
      metricValue: 204740,
      metricFormat: 'integer',
      icon: 'fas fa-user-plus',
      iconBg: '#2f9998'

    },
    {
      metricTitle: 'sesiones',
      metricName: 'sessions',
      metricValue: 414962,
      metricFormat: 'integer',
      icon: 'fas fa-eye',
      iconBg: '#a77dcc'
    },
    {
      metricTitle: 'porcentaje de rebote',
      metricName: 'bounce_rate',
      metricValue: 3.87,
      metricFormat: 'percentage',
      icon: 'fas fa-low-vision',
      iconBg: '#f89934'
    },
    {
      metricTitle: 'páginas/sesión',
      metricName: 'pages_per_session',
      metricValue: 1.35,
      metricFormat: 'decimals',
      icon: 'fas fa-file',
      iconBg: '#fbc001'
    },
    {
      metricTitle: 'duración media de la sesión',
      metricName: 'avg_sessions_duration',
      metricValue: '00:01:14',
      icon: 'fas fa-user-clock',
      iconBg: '#2B96D5'
    }
  ];

  // Top sesiones por retailers
  sessionsByCountry = [
    {
      name: 'Argentina',
      serie: [
        { date: '2021-06-01', value: 1639 },
        { date: '2021-06-02', value: 1962 },
        { date: '2021-06-03', value: 1486 },
        { date: '2021-06-04', value: 1505 },
        { date: '2021-06-05', value: 1434 },
        { date: '2021-06-06', value: 1298 },
        { date: '2021-06-07', value: 1600 },
        { date: '2021-06-08', value: 1586 },
        { date: '2021-06-09', value: 1533 },
        { date: '2021-06-10', value: 1429 },
        { date: '2021-06-11', value: 1219 },
        { date: '2021-06-12', value: 1093 },
        { date: '2021-06-13', value: 1044 },
        { date: '2021-06-14', value: 1478 },
        { date: '2021-06-15', value: 1354 },
        { date: '2021-06-16', value: 610 }
      ]
    },
    {
      name: 'Brasil',
      serie: [
        { date: '2021-06-01', value: 3748 },
        { date: '2021-06-02', value: 3544 },
        { date: '2021-06-03', value: 2640 },
        { date: '2021-06-04', value: 3096 },
        { date: '2021-06-05', value: 2138 },
        { date: '2021-06-06', value: 2174 },
        { date: '2021-06-07', value: 4572 },
        { date: '2021-06-08', value: 4684 },
        { date: '2021-06-09', value: 4533 },
        { date: '2021-06-10', value: 4622 },
        { date: '2021-06-11', value: 3446 },
        { date: '2021-06-12', value: 2172 },
        { date: '2021-06-13', value: 2225 },
        { date: '2021-06-14', value: 4229 },
        { date: '2021-06-15', value: 4126 },
        { date: '2021-06-16', value: 2313 }
      ],
    },
    {
      name: 'CAC',
      serie: [
        { date: '2021-06-01', value: 1698 },
        { date: '2021-06-02', value: 1653 },
        { date: '2021-06-03', value: 1674 },
        { date: '2021-06-04', value: 1640 },
        { date: '2021-06-05', value: 1383 },
        { date: '2021-06-06', value: 1254 },
        { date: '2021-06-07', value: 1701 },
        { date: '2021-06-08', value: 1637 },
        { date: '2021-06-09', value: 1677 },
        { date: '2021-06-10', value: 1636 },
        { date: '2021-06-11', value: 1653 },
        { date: '2021-06-12', value: 1424 },
        { date: '2021-06-13', value: 1496 },
        { date: '2021-06-14', value: 1764 },
        { date: '2021-06-15', value: 1766 },
        { date: '2021-06-16', value: 836 }
      ]
    },
    {
      name: 'Chile',
      serie: [
        { date: '2021-06-01', value: 52655 },
        { date: '2021-06-02', value: 47697 },
        { date: '2021-06-03', value: 16082 },
        { date: '2021-06-04', value: 12231 },
        { date: '2021-06-05', value: 11052 },
        { date: '2021-06-06', value: 11279 },
        { date: '2021-06-07', value: 12690 },
        { date: '2021-06-08', value: 12411 },
        { date: '2021-06-09', value: 12754 },
        { date: '2021-06-10', value: 13078 },
        { date: '2021-06-11', value: 12005 },
        { date: '2021-06-12', value: 11800 },
        { date: '2021-06-13', value: 12131 },
        { date: '2021-06-14', value: 14232 },
        { date: '2021-06-15', value: 13709 },
        { date: '2021-06-16', value: 5504 }
      ]
    },
    {
      name: 'Colombia',
      serie: [
        { date: '2021-06-01', value: 1646 },
        { date: '2021-06-02', value: 1501 },
        { date: '2021-06-03', value: 1571 },
        { date: '2021-06-04', value: 1477 },
        { date: '2021-06-05', value: 1214 },
        { date: '2021-06-06', value: 1350 },
        { date: '2021-06-07', value: 1245 },
        { date: '2021-06-08', value: 1443 },
        { date: '2021-06-09', value: 1698 },
        { date: '2021-06-10', value: 1695 },
        { date: '2021-06-11', value: 1751 },
        { date: '2021-06-12', value: 1547 },
        { date: '2021-06-13', value: 1447 },
        { date: '2021-06-14', value: 1589 },
        { date: '2021-06-15', value: 1827 },
        { date: '2021-06-16', value: 833 }
      ]
    },
    {
      name: 'Ecuador',
      serie: [
        { date: '2021-06-01', value: 195 },
        { date: '2021-06-02', value: 232 },
        { date: '2021-06-03', value: 274 },
        { date: '2021-06-04', value: 219 },
        { date: '2021-06-05', value: 235 },
        { date: '2021-06-06', value: 180 },
        { date: '2021-06-07', value: 239 },
        { date: '2021-06-08', value: 230 },
        { date: '2021-06-09', value: 240 },
        { date: '2021-06-10', value: 214 },
        { date: '2021-06-11', value: 196 },
        { date: '2021-06-12', value: 133 },
        { date: '2021-06-13', value: 116 },
        { date: '2021-06-14', value: 174 },
        { date: '2021-06-15', value: 174 },
        { date: '2021-06-16', value: 87 }
      ]
    },
    {
      name: 'México',
      serie: [
        { date: '2021-06-01', value: 9671 },
        { date: '2021-06-02', value: 9504 },
        { date: '2021-06-03', value: 9028 },
        { date: '2021-06-04', value: 8039 },
        { date: '2021-06-05', value: 6298 },
        { date: '2021-06-06', value: 5870 },
        { date: '2021-06-07', value: 7609 },
        { date: '2021-06-08', value: 7662 },
        { date: '2021-06-09', value: 7682 },
        { date: '2021-06-10', value: 7520 },
        { date: '2021-06-11', value: 7680 },
        { date: '2021-06-12', value: 5962 },
        { date: '2021-06-13', value: 5436 },
        { date: '2021-06-14', value: 8624 },
        { date: '2021-06-15', value: 8181 },
        { date: '2021-06-16', value: 4393 }
      ]
    },
    {
      name: 'Perú',
      serie: [
        { date: '2021-06-01', value: 8740 },
        { date: '2021-06-02', value: 8468 },
        { date: '2021-06-03', value: 8551 },
        { date: '2021-06-04', value: 9201 },
        { date: '2021-06-05', value: 7536 },
        { date: '2021-06-06', value: 5178 },
        { date: '2021-06-07', value: 6071 },
        { date: '2021-06-08', value: 6574 },
        { date: '2021-06-09', value: 6914 },
        { date: '2021-06-10', value: 9221 },
        { date: '2021-06-11', value: 8462 },
        { date: '2021-06-12', value: 8135 },
        { date: '2021-06-13', value: 8641 },
        { date: '2021-06-14', value: 10159 },
        { date: '2021-06-15', value: 9660 },
        { date: '2021-06-16', value: 3888 }
      ]
    }
  ]
  sessionsByRetailer = [
    {
      name: 'Cl - Ripley',
      serie: [
        { date: '2021-06-01', value: 19749 },
        { date: '2021-06-02', value: 16859 },
        { date: '2021-06-03', value: 7344 },
        { date: '2021-06-04', value: 5424 },
        { date: '2021-06-05', value: 4909 },
        { date: '2021-06-06', value: 4874 },
        { date: '2021-06-07', value: 5544 },
        { date: '2021-06-08', value: 5494 },
        { date: '2021-06-09', value: 5990 },
        { date: '2021-06-10', value: 6335 },
        { date: '2021-06-11', value: 6012 },
        { date: '2021-06-12', value: 5450 },
        { date: '2021-06-13', value: 5537 },
        { date: '2021-06-14', value: 6207 },
        { date: '2021-06-15', value: 5912 },
        { date: '2021-06-16', value: 2477 }
      ]
    },
    {
      name: 'Cl - Paris',
      serie: [
        { date: '2021-06-01', value: 27038 },
        { date: '2021-06-02', value: 25341 },
        { date: '2021-06-03', value: 6189 },
        { date: '2021-06-04', value: 4249 },
        { date: '2021-06-05', value: 3939 },
        { date: '2021-06-06', value: 3958 },
        { date: '2021-06-07', value: 4048 },
        { date: '2021-06-08', value: 3660 },
        { date: '2021-06-09', value: 3486 },
        { date: '2021-06-10', value: 3424 },
        { date: '2021-06-11', value: 2662 },
        { date: '2021-06-12', value: 3264 },
        { date: '2021-06-13', value: 3442 },
        { date: '2021-06-14', value: 3958 },
        { date: '2021-06-15', value: 3615 },
        { date: '2021-06-16', value: 1310 }
      ],
    },
    {
      name: 'Pe - Ripley',
      serie: [
        { date: '2021-06-01', value: 2772 },
        { date: '2021-06-02', value: 2614 },
        { date: '2021-06-03', value: 2837 },
        { date: '2021-06-04', value: 3416 },
        { date: '2021-06-05', value: 2880 },
        { date: '2021-06-06', value: 1639 },
        { date: '2021-06-07', value: 2229 },
        { date: '2021-06-08', value: 2334 },
        { date: '2021-06-09', value: 2583 },
        { date: '2021-06-10', value: 4305 },
        { date: '2021-06-11', value: 4119 },
        { date: '2021-06-12', value: 3939 },
        { date: '2021-06-13', value: 4592 },
        { date: '2021-06-14', value: 5467 },
        { date: '2021-06-15', value: 4918 },
        { date: '2021-06-16', value: 1821 }
      ]
    },
    {
      name: 'Br - Kalunga',
      serie: [
        { date: '2021-06-01', value: 2893 },
        { date: '2021-06-02', value: 2667 },
        { date: '2021-06-03', value: 2044 },
        { date: '2021-06-04', value: 2380 },
        { date: '2021-06-05', value: 1654 },
        { date: '2021-06-06', value: 1707 },
        { date: '2021-06-07', value: 3318 },
        { date: '2021-06-08', value: 3421 },
        { date: '2021-06-09', value: 3395 },
        { date: '2021-06-10', value: 3164 },
        { date: '2021-06-11', value: 2667 },
        { date: '2021-06-12', value: 1721 },
        { date: '2021-06-13', value: 1817 },
        { date: '2021-06-14', value: 3079 },
        { date: '2021-06-15', value: 3214 },
        { date: '2021-06-16', value: 1816 }
      ]
    },
    {
      name: 'Mx - Coppel',
      serie: [
        { date: '2021-06-01', value: 2344 },
        { date: '2021-06-02', value: 3185 },
        { date: '2021-06-03', value: 2906 },
        { date: '2021-06-04', value: 1996 },
        { date: '2021-06-05', value: 1872 },
        { date: '2021-06-06', value: 1881 },
        { date: '2021-06-07', value: 1832 },
        { date: '2021-06-08', value: 1600 },
        { date: '2021-06-09', value: 1733 },
        { date: '2021-06-10', value: 1671 },
        { date: '2021-06-11', value: 1644 },
        { date: '2021-06-12', value: 1465 },
        { date: '2021-06-13', value: 1666 },
        { date: '2021-06-14', value: 1676 },
        { date: '2021-06-15', value: 1521 },
        { date: '2021-06-16', value: 742 }
      ]
    },
    {
      name: 'Mx - Office Depot',
      serie: [
        { date: '2021-06-01', value: 2866 },
        { date: '2021-06-02', value: 2462 },
        { date: '2021-06-03', value: 2408 },
        { date: '2021-06-04', value: 2165 },
        { date: '2021-06-05', value: 1636 },
        { date: '2021-06-06', value: 1474 },
        { date: '2021-06-07', value: 2171 },
        { date: '2021-06-08', value: 2222 },
        { date: '2021-06-09', value: 2291 },
        { date: '2021-06-10', value: 2143 },
        { date: '2021-06-11', value: 1990 },
        { date: '2021-06-12', value: 1534 },
        { date: '2021-06-13', value: 1458 },
        { date: '2021-06-14', value: 2868 },
        { date: '2021-06-15', value: 2667 },
        { date: '2021-06-16', value: 1487 }
      ]
    },
    {
      name: 'Pe - Plaza Vea',
      serie: [
        { date: '2021-06-01', value: 2267 },
        { date: '2021-06-02', value: 2069 },
        { date: '2021-06-03', value: 1776 },
        { date: '2021-06-04', value: 1733 },
        { date: '2021-06-05', value: 1314 },
        { date: '2021-06-06', value: 960 },
        { date: '2021-06-07', value: 1078 },
        { date: '2021-06-08', value: 1275 },
        { date: '2021-06-09', value: 1284 },
        { date: '2021-06-10', value: 1391 },
        { date: '2021-06-11', value: 1123 },
        { date: '2021-06-12', value: 1085 },
        { date: '2021-06-13', value: 1130 },
        { date: '2021-06-14', value: 1385 },
        { date: '2021-06-15', value: 1641 },
        { date: '2021-06-16', value: 660 }
      ]
    },
    {
      name: 'Cl - PC Factory',
      serie: [
        { date: '2021-06-01', value: 1243 },
        { date: '2021-06-02', value: 1320 },
        { date: '2021-06-03', value: 883 },
        { date: '2021-06-04', value: 1075 },
        { date: '2021-06-05', value: 1066 },
        { date: '2021-06-06', value: 1131 },
        { date: '2021-06-07', value: 1513 },
        { date: '2021-06-08', value: 1645 },
        { date: '2021-06-09', value: 1679 },
        { date: '2021-06-10', value: 1710 },
        { date: '2021-06-11', value: 1642 },
        { date: '2021-06-12', value: 1556 },
        { date: '2021-06-13', value: 1637 },
        { date: '2021-06-14', value: 1933 },
        { date: '2021-06-15', value: 1967 },
        { date: '2021-06-16', value: 820 }
      ]
    }
  ]
  sessionsByRetailerArg = [
    {
      name: 'AR - Carrefour',
      serie: [
        { date: '2021-06-01', value: 19749 },
        { date: '2021-06-02', value: 16859 },
        { date: '2021-06-03', value: 7344 },
        { date: '2021-06-04', value: 5424 },
        { date: '2021-06-05', value: 4909 },
        { date: '2021-06-06', value: 4874 },
        { date: '2021-06-07', value: 5544 },
        { date: '2021-06-08', value: 5494 },
        { date: '2021-06-09', value: 5990 },
        { date: '2021-06-10', value: 6335 },
        { date: '2021-06-11', value: 6012 },
        { date: '2021-06-12', value: 5450 },
        { date: '2021-06-13', value: 5537 },
        { date: '2021-06-14', value: 6207 },
        { date: '2021-06-15', value: 5912 },
        { date: '2021-06-16', value: 2477 }
      ]
    },
    {
      name: 'AR - Compumundo',
      serie: [
        { date: '2021-06-01', value: 27038 },
        { date: '2021-06-02', value: 25341 },
        { date: '2021-06-03', value: 6189 },
        { date: '2021-06-04', value: 4249 },
        { date: '2021-06-05', value: 3939 },
        { date: '2021-06-06', value: 3958 },
        { date: '2021-06-07', value: 4048 },
        { date: '2021-06-08', value: 3660 },
        { date: '2021-06-09', value: 3486 },
        { date: '2021-06-10', value: 3424 },
        { date: '2021-06-11', value: 2662 },
        { date: '2021-06-12', value: 3264 },
        { date: '2021-06-13', value: 3442 },
        { date: '2021-06-14', value: 3958 },
        { date: '2021-06-15', value: 3615 },
        { date: '2021-06-16', value: 1310 }
      ],
    },
    {
      name: 'AR - Fravega',
      serie: [
        { date: '2021-06-01', value: 2772 },
        { date: '2021-06-02', value: 2614 },
        { date: '2021-06-03', value: 2837 },
        { date: '2021-06-04', value: 3416 },
        { date: '2021-06-05', value: 2880 },
        { date: '2021-06-06', value: 1639 },
        { date: '2021-06-07', value: 2229 },
        { date: '2021-06-08', value: 2334 },
        { date: '2021-06-09', value: 2583 },
        { date: '2021-06-10', value: 4305 },
        { date: '2021-06-11', value: 4119 },
        { date: '2021-06-12', value: 3939 },
        { date: '2021-06-13', value: 4592 },
        { date: '2021-06-14', value: 5467 },
        { date: '2021-06-15', value: 4918 },
        { date: '2021-06-16', value: 1821 }
      ]
    },
    {
      name: 'AR - Garbarino',
      serie: [
        { date: '2021-06-01', value: 2893 },
        { date: '2021-06-02', value: 2667 },
        { date: '2021-06-03', value: 2044 },
        { date: '2021-06-04', value: 2380 },
        { date: '2021-06-05', value: 1654 },
        { date: '2021-06-06', value: 1707 },
        { date: '2021-06-07', value: 3318 },
        { date: '2021-06-08', value: 3421 },
        { date: '2021-06-09', value: 3395 },
        { date: '2021-06-10', value: 3164 },
        { date: '2021-06-11', value: 2667 },
        { date: '2021-06-12', value: 1721 },
        { date: '2021-06-13', value: 1817 },
        { date: '2021-06-14', value: 3079 },
        { date: '2021-06-15', value: 3214 },
        { date: '2021-06-16', value: 1816 }
      ]
    },
    {
      name: 'AR - Musimundo',
      serie: [
        { date: '2021-06-01', value: 2344 },
        { date: '2021-06-02', value: 3185 },
        { date: '2021-06-03', value: 2906 },
        { date: '2021-06-04', value: 1996 },
        { date: '2021-06-05', value: 1872 },
        { date: '2021-06-06', value: 1881 },
        { date: '2021-06-07', value: 1832 },
        { date: '2021-06-08', value: 1600 },
        { date: '2021-06-09', value: 1733 },
        { date: '2021-06-10', value: 1671 },
        { date: '2021-06-11', value: 1644 },
        { date: '2021-06-12', value: 1465 },
        { date: '2021-06-13', value: 1666 },
        { date: '2021-06-14', value: 1676 },
        { date: '2021-06-15', value: 1521 },
        { date: '2021-06-16', value: 742 }
      ]
    },
    {
      name: 'AR - Walmart',
      serie: [
        { date: '2021-06-01', value: 2866 },
        { date: '2021-06-02', value: 2462 },
        { date: '2021-06-03', value: 2408 },
        { date: '2021-06-04', value: 2165 },
        { date: '2021-06-05', value: 1636 },
        { date: '2021-06-06', value: 1474 },
        { date: '2021-06-07', value: 2171 },
        { date: '2021-06-08', value: 2222 },
        { date: '2021-06-09', value: 2291 },
        { date: '2021-06-10', value: 2143 },
        { date: '2021-06-11', value: 1990 },
        { date: '2021-06-12', value: 1534 },
        { date: '2021-06-13', value: 1458 },
        { date: '2021-06-14', value: 2868 },
        { date: '2021-06-15', value: 2667 },
        { date: '2021-06-16', value: 1487 }
      ]
    }
  ]


  // Demográficos
  trafficDemographics = {
    desktop: [
      { name: 'empty', value: 59 },
      { id: 1, name: 'Desktop', value: 41, rawValue: 3800 },
    ],
    mobile: [
      { name: 'empty', value: 41 },
      { id: 1, name: 'Mobile', value: 59, rawValue: 4200 },
    ],
    women: [
      { name: 'empty', value: 46 },
      { id: 1, name: 'woman', value: 54, rawValue: 3300 },
    ],
    men: [
      { name: 'empty', value: 54 },
      { id: 1, name: 'men', value: 46, rawValue: 2500 },
    ],
    age: [
      {
        "age": "18-24",
        "visits": 24729
      }, {
        "age": "25-34",
        "visits": 33906
      }, {
        "age": "35-44",
        "visits": 25503
      }, {
        "age": "34-54",
        "visits": 20085
      }, {
        "age": "54-64",
        "visits": 13817
      }, {
        "age": "65+",
        "visits": 9903
      }
    ],
    genderByAge: [
      {
        "age": "65+",
        "male": -0.1,
        "female": 0.3
      }, {
        "age": "55-64",
        "male": -0.2,
        "female": 0.3
      }, {
        "age": "45-54",
        "male": -0.3,
        "female": 0.6
      }, {
        "age": "35-44",
        "male": -0.5,
        "female": 0.8
      }, {
        "age": "25-34",
        "male": -0.8,
        "female": 1.0
      }, {
        "age": "18-24",
        "male": -1.1,
        "female": 1.3
      }
    ]
  }

  // Tráfico por día de la semana y hora del día
  trafficWeekdaysAndHours = [
    {
      "hour": "12pm",
      "weekday": "Lun",
      "value": 3346
    },
    {
      "hour": "1am",
      "weekday": "Lun",
      "value": 2725
    },
    {
      "hour": "2am",
      "weekday": "Lun",
      "value": 3052
    },
    {
      "hour": "3am",
      "weekday": "Lun",
      "value": 3876
    },
    {
      "hour": "4am",
      "weekday": "Lun",
      "value": 4453
    },
    {
      "hour": "5am",
      "weekday": "Lun",
      "value": 3972
    },
    {
      "hour": "6am",
      "weekday": "Lun",
      "value": 4644
    },
    {
      "hour": "7am",
      "weekday": "Lun",
      "value": 5715
    },
    {
      "hour": "8am",
      "weekday": "Lun",
      "value": 7080
    },
    {
      "hour": "9am",
      "weekday": "Lun",
      "value": 8022
    },
    {
      "hour": "10am",
      "weekday": "Lun",
      "value": 8446
    },
    {
      "hour": "11am",
      "weekday": "Lun",
      "value": 9313
    },
    {
      "hour": "12am",
      "weekday": "Lun",
      "value": 9011
    },
    {
      "hour": "1pm",
      "weekday": "Lun",
      "value": 8508
    },
    {
      "hour": "2pm",
      "weekday": "Lun",
      "value": 8515
    },
    {
      "hour": "3pm",
      "weekday": "Lun",
      "value": 8399
    },
    {
      "hour": "4pm",
      "weekday": "Lun",
      "value": 8649
    },
    {
      "hour": "5pm",
      "weekday": "Lun",
      "value": 7869
    },
    {
      "hour": "6pm",
      "weekday": "Lun",
      "value": 6933
    },
    {
      "hour": "7pm",
      "weekday": "Lun",
      "value": 5969
    },
    {
      "hour": "8pm",
      "weekday": "Lun",
      "value": 5552
    },
    {
      "hour": "9pm",
      "weekday": "Lun",
      "value": 5434
    },
    {
      "hour": "10pm",
      "weekday": "Lun",
      "value": 5070
    },
    {
      "hour": "11pm",
      "weekday": "Lun",
      "value": 4851
    },
    {
      "hour": "12pm",
      "weekday": "Mar",
      "value": 4468
    },
    {
      "hour": "1am",
      "weekday": "Mar",
      "value": 3306
    },
    {
      "hour": "2am",
      "weekday": "Mar",
      "value": 3906
    },
    {
      "hour": "3am",
      "weekday": "Mar",
      "value": 4413
    },
    {
      "hour": "4am",
      "weekday": "Mar",
      "value": 4726
    },
    {
      "hour": "5am",
      "weekday": "Mar",
      "value": 4584
    },
    {
      "hour": "6am",
      "weekday": "Mar",
      "value": 5717
    },
    {
      "hour": "7am",
      "weekday": "Mar",
      "value": 6504
    },
    {
      "hour": "8am",
      "weekday": "Mar",
      "value": 8104
    },
    {
      "hour": "9am",
      "weekday": "Mar",
      "value": 8813
    },
    {
      "hour": "10am",
      "weekday": "Mar",
      "value": 9278
    },
    {
      "hour": "11am",
      "weekday": "Mar",
      "value": 10425
    },
    {
      "hour": "12am",
      "weekday": "Mar",
      "value": 10137
    },
    {
      "hour": "1pm",
      "weekday": "Mar",
      "value": 9290
    },
    {
      "hour": "2pm",
      "weekday": "Mar",
      "value": 9255
    },
    {
      "hour": "3pm",
      "weekday": "Mar",
      "value": 9614
    },
    {
      "hour": "4pm",
      "weekday": "Mar",
      "value": 9713
    },
    {
      "hour": "5pm",
      "weekday": "Mar",
      "value": 9667
    },
    {
      "hour": "6pm",
      "weekday": "Mar",
      "value": 8774
    },
    {
      "hour": "7pm",
      "weekday": "Mar",
      "value": 8649
    },
    {
      "hour": "8pm",
      "weekday": "Mar",
      "value": 9937
    },
    {
      "hour": "9pm",
      "weekday": "Mar",
      "value": 10286
    },
    {
      "hour": "10pm",
      "weekday": "Mar",
      "value": 9175
    },
    {
      "hour": "11pm",
      "weekday": "Mar",
      "value": 8581
    },
    {
      "hour": "12pm",
      "weekday": "Mie",
      "value": 8145
    },
    {
      "hour": "1am",
      "weekday": "Mie",
      "value": 7177
    },
    {
      "hour": "2am",
      "weekday": "Mie",
      "value": 5657
    },
    {
      "hour": "3am",
      "weekday": "Mie",
      "value": 6802
    },
    {
      "hour": "4am",
      "weekday": "Mie",
      "value": 8159
    },
    {
      "hour": "5am",
      "weekday": "Mie",
      "value": 8449
    },
    {
      "hour": "6am",
      "weekday": "Mie",
      "value": 9453
    },
    {
      "hour": "7am",
      "weekday": "Mie",
      "value": 9947
    },
    {
      "hour": "8am",
      "weekday": "Mie",
      "value": 11471
    },
    {
      "hour": "9am",
      "weekday": "Mie",
      "value": 12492
    },
    {
      "hour": "10am",
      "weekday": "Mie",
      "value": 9388
    },
    {
      "hour": "11am",
      "weekday": "Mie",
      "value": 9928
    },
    {
      "hour": "12am",
      "weekday": "Mie",
      "value": 9644
    },
    {
      "hour": "1pm",
      "weekday": "Mie",
      "value": 9034
    },
    {
      "hour": "2pm",
      "weekday": "Mie",
      "value": 8964
    },
    {
      "hour": "3pm",
      "weekday": "Mie",
      "value": 9069
    },
    {
      "hour": "4pm",
      "weekday": "Mie",
      "value": 8898
    },
    {
      "hour": "5pm",
      "weekday": "Mie",
      "value": 8322
    },
    {
      "hour": "6pm",
      "weekday": "Mie",
      "value": 6909
    },
    {
      "hour": "7pm",
      "weekday": "Mie",
      "value": 5810
    },
    {
      "hour": "8pm",
      "weekday": "Mie",
      "value": 5151
    },
    {
      "hour": "9pm",
      "weekday": "Mie",
      "value": 4911
    },
    {
      "hour": "10pm",
      "weekday": "Mie",
      "value": 4487
    },
    {
      "hour": "11pm",
      "weekday": "Mie",
      "value": 4118
    },
    {
      "hour": "12pm",
      "weekday": "Jue",
      "value": 3689
    },
    {
      "hour": "1am",
      "weekday": "Jue",
      "value": 3081
    },
    {
      "hour": "2am",
      "weekday": "Jue",
      "value": 6525
    },
    {
      "hour": "3am",
      "weekday": "Jue",
      "value": 6228
    },
    {
      "hour": "4am",
      "weekday": "Jue",
      "value": 6917
    },
    {
      "hour": "5am",
      "weekday": "Jue",
      "value": 6568
    },
    {
      "hour": "6am",
      "weekday": "Jue",
      "value": 6405
    },
    {
      "hour": "7am",
      "weekday": "Jue",
      "value": 8106
    },
    {
      "hour": "8am",
      "weekday": "Jue",
      "value": 8542
    },
    {
      "hour": "9am",
      "weekday": "Jue",
      "value": 8501
    },
    {
      "hour": "10am",
      "weekday": "Jue",
      "value": 8802
    },
    {
      "hour": "11am",
      "weekday": "Jue",
      "value": 9420
    },
    {
      "hour": "12am",
      "weekday": "Jue",
      "value": 8966
    },
    {
      "hour": "1pm",
      "weekday": "Jue",
      "value": 8135
    },
    {
      "hour": "2pm",
      "weekday": "Jue",
      "value": 8224
    },
    {
      "hour": "3pm",
      "weekday": "Jue",
      "value": 8387
    },
    {
      "hour": "4pm",
      "weekday": "Jue",
      "value": 8218
    },
    {
      "hour": "5pm",
      "weekday": "Jue",
      "value": 7641
    },
    {
      "hour": "6pm",
      "weekday": "Jue",
      "value": 6469
    },
    {
      "hour": "7pm",
      "weekday": "Jue",
      "value": 5441
    },
    {
      "hour": "8pm",
      "weekday": "Jue",
      "value": 4952
    },
    {
      "hour": "9pm",
      "weekday": "Jue",
      "value": 4643
    },
    {
      "hour": "10pm",
      "weekday": "Jue",
      "value": 4393
    },
    {
      "hour": "11pm",
      "weekday": "Jue",
      "value": 4017
    },
    {
      "hour": "12pm",
      "weekday": "Vier",
      "value": 4022
    },
    {
      "hour": "1am",
      "weekday": "Vier",
      "value": 3063
    },
    {
      "hour": "2am",
      "weekday": "Vier",
      "value": 3638
    },
    {
      "hour": "3am",
      "weekday": "Vier",
      "value": 3968
    },
    {
      "hour": "4am",
      "weekday": "Vier",
      "value": 4070
    },
    {
      "hour": "5am",
      "weekday": "Vier",
      "value": 4019
    },
    {
      "hour": "6am",
      "weekday": "Vier",
      "value": 4548
    },
    {
      "hour": "7am",
      "weekday": "Vier",
      "value": 5465
    },
    {
      "hour": "8am",
      "weekday": "Vier",
      "value": 6909
    },
    {
      "hour": "9am",
      "weekday": "Vier",
      "value": 7706
    },
    {
      "hour": "10am",
      "weekday": "Vier",
      "value": 7867
    },
    {
      "hour": "11am",
      "weekday": "Vier",
      "value": 8615
    },
    {
      "hour": "12am",
      "weekday": "Vier",
      "value": 8218
    },
    {
      "hour": "1pm",
      "weekday": "Vier",
      "value": 7604
    },
    {
      "hour": "2pm",
      "weekday": "Vier",
      "value": 7429
    },
    {
      "hour": "3pm",
      "weekday": "Vier",
      "value": 7488
    },
    {
      "hour": "4pm",
      "weekday": "Vier",
      "value": 7493
    },
    {
      "hour": "5pm",
      "weekday": "Vier",
      "value": 6998
    },
    {
      "hour": "6pm",
      "weekday": "Vier",
      "value": 5941
    },
    {
      "hour": "7pm",
      "weekday": "Vier",
      "value": 5068
    },
    {
      "hour": "8pm",
      "weekday": "Vier",
      "value": 4636
    },
    {
      "hour": "9pm",
      "weekday": "Vier",
      "value": 4241
    },
    {
      "hour": "10pm",
      "weekday": "Vier",
      "value": 3858
    },
    {
      "hour": "11pm",
      "weekday": "Vier",
      "value": 3833
    },
    {
      "hour": "12pm",
      "weekday": "Sab",
      "value": 3503
    },
    {
      "hour": "1am",
      "weekday": "Sab",
      "value": 2842
    },
    {
      "hour": "2am",
      "weekday": "Sab",
      "value": 2808
    },
    {
      "hour": "3am",
      "weekday": "Sab",
      "value": 2399
    },
    {
      "hour": "4am",
      "weekday": "Sab",
      "value": 2280
    },
    {
      "hour": "5am",
      "weekday": "Sab",
      "value": 2139
    },
    {
      "hour": "6am",
      "weekday": "Sab",
      "value": 2527
    },
    {
      "hour": "7am",
      "weekday": "Sab",
      "value": 2940
    },
    {
      "hour": "8am",
      "weekday": "Sab",
      "value": 3066
    },
    {
      "hour": "9am",
      "weekday": "Sab",
      "value": 3494
    },
    {
      "hour": "10am",
      "weekday": "Sab",
      "value": 3287
    },
    {
      "hour": "11am",
      "weekday": "Sab",
      "value": 3416
    },
    {
      "hour": "12am",
      "weekday": "Sab",
      "value": 3432
    },
    {
      "hour": "1pm",
      "weekday": "Sab",
      "value": 3523
    },
    {
      "hour": "2pm",
      "weekday": "Sab",
      "value": 3542
    },
    {
      "hour": "3pm",
      "weekday": "Sab",
      "value": 3347
    },
    {
      "hour": "4pm",
      "weekday": "Sab",
      "value": 3292
    },
    {
      "hour": "5pm",
      "weekday": "Sab",
      "value": 3416
    },
    {
      "hour": "6pm",
      "weekday": "Sab",
      "value": 3131
    },
    {
      "hour": "7pm",
      "weekday": "Sab",
      "value": 3057
    },
    {
      "hour": "8pm",
      "weekday": "Sab",
      "value": 3227
    },
    {
      "hour": "9pm",
      "weekday": "Sab",
      "value": 3060
    },
    {
      "hour": "10pm",
      "weekday": "Sab",
      "value": 2855
    },
    {
      "hour": "11pm",
      "weekday": "Sab",
      "value": 2625
    },
    {
      "hour": "12pm",
      "weekday": "Dom",
      "value": 2990
    },
    {
      "hour": "1am",
      "weekday": "Dom",
      "value": 2520
    },
    {
      "hour": "2am",
      "weekday": "Dom",
      "value": 2334
    },
    {
      "hour": "3am",
      "weekday": "Dom",
      "value": 2230
    },
    {
      "hour": "4am",
      "weekday": "Dom",
      "value": 2325
    },
    {
      "hour": "5am",
      "weekday": "Dom",
      "value": 2019
    },
    {
      "hour": "6am",
      "weekday": "Dom",
      "value": 2128
    },
    {
      "hour": "7am",
      "weekday": "Dom",
      "value": 2246
    },
    {
      "hour": "8am",
      "weekday": "Dom",
      "value": 2421
    },
    {
      "hour": "9am",
      "weekday": "Dom",
      "value": 2788
    },
    {
      "hour": "10am",
      "weekday": "Dom",
      "value": 2959
    },
    {
      "hour": "11am",
      "weekday": "Dom",
      "value": 3018
    },
    {
      "hour": "12am",
      "weekday": "Dom",
      "value": 3154
    },
    {
      "hour": "1pm",
      "weekday": "Dom",
      "value": 3172
    },
    {
      "hour": "2pm",
      "weekday": "Dom",
      "value": 3368
    },
    {
      "hour": "3pm",
      "weekday": "Dom",
      "value": 3464
    },
    {
      "hour": "4pm",
      "weekday": "Dom",
      "value": 3746
    },
    {
      "hour": "5pm",
      "weekday": "Dom",
      "value": 3656
    },
    {
      "hour": "6pm",
      "weekday": "Dom",
      "value": 3336
    },
    {
      "hour": "7pm",
      "weekday": "Dom",
      "value": 3292
    },
    {
      "hour": "8pm",
      "weekday": "Dom",
      "value": 3269
    },
    {
      "hour": "9pm",
      "weekday": "Dom",
      "value": 3300
    },
    {
      "hour": "10pm",
      "weekday": "Dom",
      "value": 3403
    },
    {
      "hour": "11pm",
      "weekday": "Dom",
      "value": 3323
    }
  ];

  // Tráfico por día de la semana
  trafficByDay = [
    { weekday: 'Dom', value: 32578 },
    { weekday: 'Sab', value: 32458 },
    { weekday: 'Vier', value: 38716 },
    { weekday: 'Jue', value: 41245 },
    { weekday: 'Mier', value: 39429 },
    { weekday: 'Mar', value: 48081 },
    { weekday: 'Lun', value: 59340 },
  ]

  // Tráfico por hora del día
  trafficByHour = [
    { hour: '12 AM', visits: 150 },
    { hour: '3 AM', visits: 30 },
    { hour: '6 AM', visits: 270 },
    { hour: '9 AM', visits: 1870 },
    { hour: '12 PM', visits: 3010 },
    { hour: '3 PM', visits: 2410 },
    { hour: '6 PM', visits: 3050 },
    { hour: '9 PM', visits: 3000 }
  ]

  // Visitantes nuevos vs Visitantes recurrentes
  sessionsVsRetVisitor = [
    { category: 'Visitantes nuevos', value: 3200 },
    { category: 'Visitante recurrentes', value: 800 }
  ]

  // Porcentaje de salidas, rebote y páginas vistas
  brAndPagesView = [
    {
      name: 'Porcentaje de salidas',
      serie: [
        { date: '2021-06-02', value: 75 },
        { date: '2021-06-03', value: 87 },
        { date: '2021-06-04', value: 70 },
        { date: '2021-06-05', value: 86 },
        { date: '2021-06-06', value: 70 },
        { date: '2021-06-07', value: 75 },
        { date: '2021-06-08', value: 82 },
        { date: '2021-06-09', value: 70 },
        { date: '2021-06-10', value: 75 },
        { date: '2021-06-11', value: 78 },
        { date: '2021-06-12', value: 80 },
        { date: '2021-06-13', value: 83 },
        { date: '2021-06-14', value: 70 },
        { date: '2021-06-15', value: 76 },
        { date: '2021-06-16', value: 74 }
      ],
      valueFormat: '%'
    },
    {
      name: 'Porcentaje de rebote',
      serie: [
        { date: '2021-06-02', value: 5 },
        { date: '2021-06-03', value: 7 },
        { date: '2021-06-04', value: 1 },
        { date: '2021-06-05', value: 6 },
        { date: '2021-06-06', value: 1 },
        { date: '2021-06-07', value: 5 },
        { date: '2021-06-08', value: 2 },
        { date: '2021-06-09', value: 3 },
        { date: '2021-06-10', value: 0 },
        { date: '2021-06-11', value: 5 },
        { date: '2021-06-12', value: 8 },
        { date: '2021-06-13', value: 5 },
        { date: '2021-06-14', value: 1 },
        { date: '2021-06-15', value: 8 },
        { date: '2021-06-16', value: 2 }
      ],
      valueFormat: '%'
    },
    {
      name: 'Número de páginas vistas',
      serie: [
        { date: '2021-06-02', value: 7 },
        { date: '2021-06-03', value: 5 },
        { date: '2021-06-04', value: 4 },
        { date: '2021-06-05', value: 2 },
        { date: '2021-06-06', value: 3 },
        { date: '2021-06-07', value: 5 },
        { date: '2021-06-08', value: 4 },
        { date: '2021-06-09', value: 3 },
        { date: '2021-06-10', value: 7 },
        { date: '2021-06-11', value: 6 },
        { date: '2021-06-12', value: 5 },
        { date: '2021-06-13', value: 2 },
        { date: '2021-06-14', value: 3 },
        { date: '2021-06-15', value: 1 },
        { date: '2021-06-16', value: 6 }
      ]
    }
  ]

  // Modelos más visitados
  mostVisitedModels = {
    data: [
      { ranking: 1, product: 'LAPTOP HP 15 EF1007LA AMD RYZEN 3 12 GB SSD 256 GB', users: 24569 },
      { ranking: 2, product: 'LAPTOP HP 240 G7-151F5LT PROCESADOR INTEL CORE I5 RAM 8 GB DD 1 TB WINDOWS 10 HOME', users: 23547 },
      { ranking: 3, product: 'NOTEBOOK 250 G7 PROCESADOR INTEL CORE I3 RAM 8 GB DD 1 TB', users: 22475 },
      { ranking: 4, product: '240 G7 INTEL CELERON N4020 4 GB 500 GB', users: 14685 },
      { ranking: 5, product: ' CHROMEBOOK 11A G8 EE APU AMD A4 RAM 4 GB DD 32 GB EMMC', users: 14145 }
    ],
    reqStatus: 2
  }

  // Categorías más visitadas
  mostVisitedCategories = {
    data: [
      { ranking: 1, category: 'Suplies', users: 22475 },
      { ranking: 2, category: 'HW Print', users: 14685 },
      { ranking: 3, category: 'Supplies', users: 14145 }
    ],
    reqStatus: 2
  }

  // Categoría de afinidad
  categoryCoverage = [
    { category: 'Beauty & Wellness/Frequently Visits Salons', users: 1600 },
    { category: 'Lifestyles & Hobbies/Family-Focused', users: 2000 },
    { category: 'Technology/Technophiles', users: 2400 },
    { category: 'Home & Garden/Do-It-Yourselfers', users: 2900 },
    { category: 'Lifestyles & Hobbies/Green Living Enthusiasts', users: 3200 },
    { category: 'Shoppers/Luxury Shoppers', users: 3600 },
    { category: 'Lifestyles & Hobbies/Business Professional', users: 3800 },
    { category: 'Media & Entertainment/Movie Lovers', users: 4000 },
    { category: 'Food & Dining/Cooking Enthusiasts/30 Minute Chefs', users: 4500 },
    { category: 'Shoppers/Value Shoppers', users: 4731 },
  ];

  // Segmento de mercado
  marketSegment = [
    { category: 'Autos & Vehicles/Motor Vehicles/Motor Vehicles (Used)', users: 1200 },
    { category: 'Autos & Vehicles/Motor Vehicles/Motor Vehicles/Motor Vehicles (New)', users: 1400 },
    { category: 'Business Services/Advertising & Marketing Services', users: 1600 },
    { category: 'Computers & Peripherals/Computers/Laptops', users: 1700 },
    { category: 'Financial Services/Credit & Lending', users: 1990 },
    { category: 'Home & Garden/Home Appliances', users: 2300 },
    { category: 'Financial Services/Investment Services', users: 2400 },
    { category: 'Financial Services/Credit & Lending/Credit Cards', users: 3100 },
    { category: 'Consumer Electronics/Mobile Phones', users: 3200 },
    { category: 'Financial Services/Banking Services', users: 4731 },
  ];

  sessions = this.sessionsByCountry;

  countryID;
  retailerID;

  retailerView;
  countryView;
  latamView;

  routeSub: Subscription;
  retailerSub: Subscription;
  countrySub: Subscription;

  constructor(
    private appStateService: AppStateService,
    private router: Router) { }

  ngOnInit(): void {
    this.countryID = this.appStateService.selectedCountry?.id;
    this.retailerID = this.appStateService.selectedRetailer?.id;
    this.latamView = this.router.url.includes('latam') ? true : false;

    if (this.countryID || this.retailerID || this.latamView) {
      this.getActiveView();
      // this.getAllData();
    }

    this.routeSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    )
      .subscribe(event => {
        if (event instanceof NavigationEnd)
          this.latamView = this.router.url.includes('latam') ? true : false;
        this.getActiveView();
      });

    this.retailerSub = this.appStateService.selectedRetailer$.subscribe(retailer => {
      this.retailerID = retailer?.id;
      this.getActiveView();
    });

    this.countrySub = this.appStateService.selectedCountry$.subscribe(country => {
      this.countryID = country?.id;
      if (this.countryID) {
        this.sessionsByRetailer = this.sessionsByRetailerArg;
      }
      this.getActiveView();
    });
  }

  getActiveView() {
    if (this.retailerID) {
      this.retailerView = true;
      this.countryView = false;
      this.latamView = false;
    } else if (this.countryID) {
      this.countryView = true;
      this.retailerView = false;
      this.latamView = false;
    } else if (this.latamView) {
      this.countryView = false;
      this.retailerView = false;
    }

    if (this.countryView) {
      this.sessionsByRetailer = this.sessionsByRetailerArg;
    }
  }

  getSessions(metric: string) {
    if (metric === 'country') {
      this.sessions = this.sessionsByCountry
      this.selectedTab1 = 1;
    } else if (metric === 'retailer') {
      this.sessions = this.sessionsByRetailer
      this.selectedTab1 = 2;
    }
  }
}
