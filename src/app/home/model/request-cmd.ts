export class RequestCmd {
    cmd: string;
    unitId: number;
    params: string;
    constructor( values: Object = {} ) {
        Object.assign( this , values );
    }
}
