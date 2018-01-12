export class HomeAlarmItem {
    id: number;
    displayName: string;
    notice: string;
    linkAddress: string;
    isDisplay: boolean;

    constructor( values: Object = {} ) {
        Object.assign( this , values );
    }
}
