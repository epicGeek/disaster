import { Component, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';
import { BossStatisticService } from './boss-statistic.service';
import { BossMonitorService } from '../boss-monitor/boss-monitor.service';
import * as highcharts from 'highcharts';
@Component({
  selector: 'ices-boss-statistic',
  templateUrl: './boss-statistic.component.html',
  styleUrls: ['./boss-statistic.component.css']
})
export class BossStatisticComponent implements OnInit {
  zh_CN = {};
  en_US = {};
  hlrsns: SelectItem[];
  hlrsnSelected: String;
  grains: SelectItem[];
  grainSelected: String;
  businessTypes: SelectItem[];
  businessTypeSelected: String;
  startDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
  endDate = new Date();
  options: Object;

  msgs = [];
  constructor(private bossStatisticService: BossStatisticService, private bossMonitorService: BossMonitorService) { }

  ngOnInit() {

    this.zh_CN = {
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.en_US = {
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
    };
    this.getHlrsnDropdown();
    this.getBusinessTypeDropdown();
    this.getGrainDropdown();
  }
  getStatistic() {
    const paramMap = {
      hlrsn: this.hlrsnSelected,
      businessType: this.businessTypeSelected,
      startDate: this.startDate,
      endDate: this.endDate,
      grain: this.grainSelected
    };
    console.log(paramMap);
    this.bossStatisticService.getStatistic(paramMap).subscribe(
      result => {
        this.options = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            width: document.getElementById('text').offsetWidth - 30,
            height: document.body.scrollHeight - 150
          },

          title: {
            text: result.header
          },
          xAxis: {
            categories: result.label,
            crosshair: true
          },
          yAxis: [{ // Secondary yAxis
            title: {
              text: result.header,
              style: { color: highcharts.getOptions().colors[8] }
            },
            labels: {
              format: '{value}' + '%',
              // enabled: result.unit ? true : false,
              style: { color: highcharts.getOptions().colors[8] }
            },
            opposite: true,
            min: 0
          }, { // Primary yAxis
            labels: {
              format: '{value}',
              style: { color: highcharts.getOptions().colors[0] }
            },
            title: {
              text: 'count',
              style: { color: highcharts.getOptions().colors[0] }
            },
            min: 0
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
          series: [{ // histogram
            name: 'count',
            type: 'column',
            data: result.count,
            yAxis: 1,
            tooltip: { valueSuffix: '' },
            color: highcharts.getOptions().colors[0]
          }, {// spline
            name: 'ratio',
            type: 'spline',
            data: result.ratio,
            yAxis: 1,
            tooltip: { valueSuffix: '' },
            color: highcharts.getOptions().colors[8]
          }],
          credits: {
            enabled: false
          }
        };
      }
    );
  }
  getHlrsnDropdown() {
    this.bossMonitorService.getHlrsnDropDown().subscribe(
      result => {
        this.hlrsns = [];
        this.hlrsns.push({ label: 'HLRSN', value: null });
        result.forEach(element => {
          this.hlrsns.push({ label: element, value: element });
        });
      }
    );
  }
  getBusinessTypeDropdown() {
    this.bossStatisticService.getBusinessTypeDropdown().subscribe(
      result => {
        this.businessTypes = [];
        this.businessTypes.push({ label: '业务类型', value: null });
        result.forEach(element => {
          if (element['business_type_cn'] !== '' && element['business_type'] !== '') {
            this.businessTypes.push({ label: element['business_type_cn'], value: element['business_type'] });
          }
        });
      }
    );
  }
  getGrainDropdown() {
    this.grains = [];
    this.grains.push({ label: '15分钟', value: '15' });
    this.grains.push({ label: '1小时', value: 'hour' });
    this.grains.push({ label: '日', value: 'day' });
  }
}
