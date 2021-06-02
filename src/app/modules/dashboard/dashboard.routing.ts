import { Routes } from '@angular/router';
import { CampaignComparatorComponent } from './pages/campaign-comparator/campaign-comparator.component';

import { CountryComponent } from './pages/country/country.component';
import { OverviewLatamComponent } from './pages/overview-latam/overview-latam.component';
import { OtherToolsComponent } from './pages/other-tools/other-tools.component';
import { RetailerComponent } from './pages/retailer/retailer.component';
import { SentimentAnalysisComponent } from './pages/sentiment-analysis/sentiment-analysis.component';

export const DashboardRoutes: Routes = [
    { path: 'country', component: CountryComponent },
    { path: 'retailer', component: RetailerComponent },
    { path: 'tools', component: OtherToolsComponent },
    { path: 'campaign-comparator', component: CampaignComparatorComponent },
    { path: 'omnichat', component: SentimentAnalysisComponent },
    { path: 'main-region', component: OverviewLatamComponent },
];
