export class MainRegion {
    id?: number;
    name: string
}

export class Country {
    id: number;
    name: string;
    region: string;
    indexed: boolean;
    omnichat: boolean;
    pc_selector: boolean;
}

export class Retailer {
    id: number;
    name: string;
    country_id: number;
    country_code: string;
    indexed: boolean;
    omnichat: boolean;
    pc_selector: boolean;
}
