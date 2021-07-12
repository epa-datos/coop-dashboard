export class BaseKpiCard {
    title: string;
    name: string; // object property value within api response array
    value: string | number;
    format?: 'integer' | 'decimal' | 'percentage' | 'score'; // to apply a pipe or showing dynamic content from 'value' property (score is only for parent; for subKpis doesn't apply)
    symbol?: string; // any symbol shown after value (e.g. 'USD') 
}

export class KpiCard extends BaseKpiCard {
    icon?: string; // valid icon class (e.g. 'fas fa-hand-pointer')
    iconBg?: string; // valid value of style property background-color
    subKpis?: BaseKpiCard[]; // for only two subKpi's objects
}
