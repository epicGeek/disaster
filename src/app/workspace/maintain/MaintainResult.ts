export class MaintainResult{
    reportPath : string;
    errorLog : string;
    unitName : string;
    itemName : string;
    uuId : string;
    requestTime : Date;
    responseTime : Date;
    success : boolean;

    constructor( values: Object = {} ) {
        Object.assign( this , values );
    }
}