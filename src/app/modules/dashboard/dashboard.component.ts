import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  title: string;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadTitle(event.url);
      }
    })
  }

  ngOnInit(): void {
    this.loadTitle(this.router.url);
  }

  loadTitle(route: string) {
    if (route.includes('/dashboard/coop')) {
      this.title = 'Programa COOP';
    } else if (route.includes('/dashboard/country')) {
      this.title = 'Visión general del país';
    } else if (route.includes('/dashboard/retailer')) {
      this.title = 'Retailer'
    } else if (route.includes('/dashboard/tools')) {
      this.title = 'Otras herramientas';
    } else if (route.includes('/dashboard/omnichat')) {
      this.title = 'Análisis de sentimientos OmniChat';
    } else {
      delete this.title;
    }
  }
}
