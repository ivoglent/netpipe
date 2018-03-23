export interface EventDataInterface{
    data : any;
    from : string;
    to : string;
    error : any;
    message : string,
    event : string,
    timestamp : number
}

export class EventData implements EventDataInterface{
    data: any = {};
    from: string = '';
    to: string = 'all';
    error: any = false;
    message: string = 'Success request';
    event : string = 'NONE';
    timestamp : number = new Date().getTime()
}

