import { Component, OnInit } from '@angular/core';
import { MainKpiService, SelectItem, KpiParams } from './main-kpi.service';
import * as moment from 'moment';
import * as highcharts from 'highcharts';
import { SliderModule } from 'primeng/primeng';
@Component({
    selector: 'ices-main-kpi',
    templateUrl: './main-kpi.component.html',
    styleUrls: ['./main-kpi.component.css']
})
export class MainKpiComponent implements OnInit {
    grainBtn: String;
    constructor(private mainKpiService: MainKpiService) {
    }
    showMoreGrains: Boolean = false;
    dropdownData = null;
    kpiParams: KpiParams = {};
    options: Object;
    msgs = [];
    kpiDropdownData = [];
    dropdownModel = {
        kpiNames: [],
        neTypes: [],
        location: [],
        neNames: []
    };

    changeDropdown(param) {

        this.onChangeDropdown(this.dropdownData.ne, 'neNames',
            { neType: this.kpiParams.neType, location: this.kpiParams.location }, 'NE');

        this.onChangeDropdown(this.kpiDropdownData, 'kpiNames', { neType: this.kpiParams.neType }, 'kpi');

        this.kpiParams['kpiCode'] = this.dropdownModel.kpiNames[0]['value'];

        this.kpiParams['neName'] = param === 'ne' ? this.kpiParams['neName'] : this.dropdownModel.neNames[0]['value'];

        // this.kpiParams['location'] = param == 'location' ? this.kpiParams['location'] : this.dropdownModel.location[0]['value'];
    }

    onChangeDropdown(allData, dropdownName, params, labelName) {
        this.dropdownModel[dropdownName] = [];
        if (labelName !== 'kpi') {
            this.dropdownModel[dropdownName] = [{ label: 'ALL ' + labelName, value: null }];
        }
        allData.forEach(element => {
            let isNullFlag = true;
            let flag = true;
            const keys = Object.keys(params);
            keys.forEach(param => {
                if (params[param] != null && params[param] !== '') {
                    flag = element[param] !== params[param] ? false : flag;
                    isNullFlag = false;
                }
            });

            if (isNullFlag || flag) {
                this.dropdownModel[dropdownName].push(element);
            }
        });
    }


    clearData() {
        this.ngOnInit();
    }


    ngOnInit() {

        this.showMoreGrainsOrNot();
        this.kpiParams = {};
        // 初始化查询条件和下拉框
        this.kpiParams.endDate = this.formatDate(new Date());
        this.kpiParams.startDate = this.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3));
        // 指标下拉框
        this.mainKpiService.findKpiItemList()
            .subscribe(result => {
                this.dropdownModel.kpiNames = [];
                result.forEach(element => {
                    const model = { label: element['kpi_name'], value: element['kpi_code'], neType: element['kpi_ne_type'] };
                    this.dropdownModel.kpiNames.push(model);
                });
                this.kpiDropdownData = this.dropdownModel.kpiNames;
                if (this.dropdownModel.kpiNames.length !== 0) {
                    this.kpiParams.kpiCode = this.dropdownModel.kpiNames[0].value;
                    this.findCharData();
                }
            });

        this.mainKpiService.findDropdown()
            .subscribe(result => {
                this.dropdownData = result;
                this.dropdownModel.neTypes = this.allConcat('NE TYPE', result.neType);
                this.dropdownModel.location = this.allConcat('LOCATION', result.location);
                this.dropdownModel.neNames = this.allConcat('NE', result.ne);
            });
    }

    // tslint:disable-next-line:member-ordering
    barHeader = '';

    findCharData() {
        this.kpiParams.grain = this.grainBtn;
        this.kpiParams.endDate = this.formatDate(this.kpiParams.endDate);
        this.kpiParams.startDate = this.formatDate(this.kpiParams.startDate);
        this.mainKpiService.findCharData(this.kpiParams)
            .subscribe(result => {
                const barAndLine = [];
                barAndLine.push({
                    name: 'count',
                    type: result.unit ? 'line' : 'line',
                    data: result.successData,
                    yAxis: 1,
                    tooltip: { valueSuffix: '' },
                    color: highcharts.getOptions().colors[0]
                });
                if (result.unit) {
                    barAndLine.push({
                        name: result.header,
                        data: result.data,
                        tooltip: { valueSuffix: result.unit },
                        type: 'spline',
                        color: highcharts.getOptions().colors[8]
                    });
                }

                if (result.labels.length === 0) {
                    this.showInfo({ severity: 'warn', summary: 'Message', detail: 'No data！' });
                }
                this.options = {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        width: document.getElementById('text').offsetWidth - 30,
                        height: document.body.scrollHeight - 200
                    },

                    title: {
                        text: result.header
                    },
                    xAxis: {
                        categories: result.labels,
                        crosshair: true
                    },
                    yAxis: [{ // Secondary yAxis
                        title: {
                            text: result.header,
                            style: { color: highcharts.getOptions().colors[8] }
                        },
                        labels: {
                            format: '{value}' + result.unit,
                            // enabled: result.unit ? true : false,
                            style: { color: highcharts.getOptions().colors[8] }
                        },
                        opposite: true
                    }, { // Primary yAxis
                        labels: {
                            format: '{value}',
                            style: { color: highcharts.getOptions().colors[0] }
                        },
                        title: {
                            text: 'count',
                            style: { color: highcharts.getOptions().colors[0] }
                        },
                        // min: 100000
                    }],
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: barAndLine,
                    credits: {
                        enabled: false
                    }
                };
                //   }

            });
    }

    showInfo(message) {
        this.msgs = [];
        this.msgs.push(message);
    }

    allConcat(type, list): any[] {
        return [{ label: 'ALL ' + type, value: '' }].concat(list);
    }

    formatDate(date): string {
        return moment(date).format('YYYY-MM-DD HH:mm');
    }
    showMoreGrainsOrNot() {
        this.mainKpiService.showMoreGrains().subscribe(
            result => {
                this.showMoreGrains = result;
                console.log('show more grains:' + this.showMoreGrains);
            }
        );
    }
}
