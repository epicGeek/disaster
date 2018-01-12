export class MaintainOperation {
    id: number;
    createBy: string;
    checkName: string;
    unitCount: number;
    itemCount: number;
    requestTime: Date;
    isDone: boolean;
    commandCategory: string;
    operationId: number;

    constructor( values: Object = {} ) {
        Object.assign( this , values );
    }

}
