import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingleUserQueryService } from './single-user-query.service';
import { TreeNode } from 'primeng/primeng';

@Component({
    selector: 'ices-single-user-query',
    templateUrl: './single-user-query.component.html',
    styleUrls: ['./single-user-query.component.css']
})
export class SingleUserQueryComponent implements OnInit {

    constructor(private singleUserQueryService: SingleUserQueryService,
                private activatedRoute: ActivatedRoute) { }

    params = '';

    fromPGW = '';

    data = [];
    historyQueryRecordTable = [];
    searchLogDisplay: boolean;
    totalRecords = 0;

    ngOnInit() {
        this.activatedRoute.params.subscribe( param => {
            this.params = param['number'];
            if (this.params ) {
                this.queryUserData();
            }
        });
    }

    indexOfln(value: string): boolean {
        return value.indexOf('>') !== -1 && value.indexOf('\n') === -1;
    }

    replaceSpace(value: string): any {
        if (value) {
            if (value.trim().toLowerCase() === 'none') {
                let val: string = value.trim();
                val = 'N' + val.toLowerCase().substring(1);
                return val.trim();
            }else {
                return value;
                // if(value.indexOf('<') === -1){
                //     return value;
                // }else{
                //     let array = value.split('\n');
                //     let str = '';
                //     array.forEach(element => {
                //         str += element.trim();
                //     });
                //     value = str;
                //     const result = (new DOMParser()).parseFromString(value, 'text/xml');
                //     console.log(result);
                //     let resultData = value.substring(0,value.indexOf('>') + 1) + '\r\n';
                //     const data = result.documentElement;
                //     const serializer = new XMLSerializer();
                //     const dataResult = data.childNodes;
                //     for (let index = 0; index < dataResult.length; index++) {
                //         let row = serializer.serializeToString(dataResult[index]);
                //         row = row.replace(new RegExp('\n', 'gm'), '')
                //         .replace(new RegExp('\r', 'gm'), '')
                //         .replace(new RegExp('\r\n', 'gm'), '').trim();
                //         resultData += '     ' + row + '\r\n';
                //     }
                //     resultData += value.substring(value.lastIndexOf('</'));
                //     return  resultData;
                // }
            }
        }

    }


    isArrayValues(node) {
        node.values = [];
        node.columns = [];
        node.subField.forEach(item => {
            const str: string = item.path;
            const header: string = item.fieldName;
            node.columns.push({value: item.fieldName, key: str.substring(str.lastIndexOf('/') + 1),
                        convert: item.convert, valueMapping: item.valueMapping, header: header});
            item['width'] = ((header.length < 5 ? 5 : header.length) * 10) + 20 + 'px';
        });
        node.embedded.forEach(item => {
            const model = {};
            node.columns.forEach(col => {
                model[col.value] = col.convert ? col.valueMapping[item[col.key]] : item[col.key];
            });
            node.values.push(model);
        });
    }

    historyLogQuery() {
        this.searchLogDisplay = true;
        this.singleUserQueryService.getAllUserDataLog().subscribe(resultData => {
            this.historyQueryRecordTable = resultData;
        });
    }
    downloadExcel(path) {
        this.singleUserQueryService.downloadExcel(path);
    }
    queryUserData() {
        this.singleUserQueryService.queryUserData(this.params)
            .subscribe(result => {
                this.data = result.data;
                this.fromPGW = result.fromPGW;
                if (this.data.length !== 0) {
                    this.data[0].selected = true;
                }
                this.data.forEach(element => {
                    element.col = 'ui-g-' + (12 / element.col);
                });
            });
    }
      readCachedFile(filepath, number, unitName) {
            this.params = number;
            this.singleUserQueryService.readCachedFile(filepath, number, unitName)
            .subscribe(result => {
                this.data = result.data;
                this.fromPGW = unitName;
                if (this.data.length !== 0) {
                    this.data[0].selected = true;
                }
                this.data.forEach(element => {
                    element.col = 'ui-g-' + (12 / element.col);
                });
                this.searchLogDisplay = false;
            });
    }




}
