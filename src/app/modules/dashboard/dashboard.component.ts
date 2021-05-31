import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, Event } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  title: string;
  routeSub: Subscription;

  constructor(private router: Router) {
    this.routeSub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loadTitle(event.url);
      }
    })
  }

  ngOnInit(): void {
    this.loadTitle(this.router.url);
  }

  loadTitle(route: string) {
    if (route.includes('/dashboard/main-region')) {
      this.title = 'Visión general';
    } else if (route.includes('/dashboard/country')) {
      this.title = 'Visión general del país';
    } else if (route.includes('/dashboard/retailer')) {
      this.title = 'Visión general del retailer'
    } else if (route.includes('/dashboard/tools')) {
      this.title = 'Otras herramientas';
    } else if (route.includes('/dashboard/omnichat')) {
      this.title = 'Análisis de sentimientos OmniChat';
    } else {
      delete this.title;
    }
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
  }
}
