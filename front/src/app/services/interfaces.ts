export interface UserCampaign {
    idCampaign: number;
    Campaign: string;
    Client: string;
    Market: string;
    Country: string;
    pass: number;
    photo: string;
}

export interface TableCost {
    indicator: string;
    actual: number;
    ob: number;
    rft: number;
}

export interface ObjTable{
    year:any;
    month:any;
    name:any;
    country:any;
    market:any;
    client:any;
    campaign:any;
}

export interface ObjSelect{
    type:any;
    market:any;
    client:any;
    campaign:any;
    year: any;
    month: any;
}

export interface ObjSelectcgp{
    region:any[];
    country:any[];
    sub:any[];
}


export interface ObjReport{
    component:any;
    campaing:any;
}
