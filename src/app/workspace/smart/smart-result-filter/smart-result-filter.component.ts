import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { SmartResultFilterService } from './smart-result-filter.service';
import { Observable } from 'rxjs/Observable';
import { MenuItem } from 'primeng/primeng';
@Component({
  selector: 'ices-smart-result-filter',
  templateUrl: './smart-result-filter.component.html',
  styleUrls: ['./smart-result-filter.component.css']
})
export class SmartResultFilterComponent implements OnInit {
  scheduleId : number;

  pageType : string; 

  resultList = []; 

  constructor(private route:ActivatedRoute,private router:Router, private smartResultFilterService:SmartResultFilterService) { }

  downLoadLog(item){
    this.pageType == "job" ? this.smartResultFilterService.jobDownLog(item,this.scheduleId) :
                        this.smartResultFilterService.neDownLog(item,this.scheduleId);
  }

  jobDownLoadLog(item){
    this.smartResultFilterService.jobDownLog(item,this.scheduleId);
  }

  neDownLoadLog(item){
    this.smartResultFilterService.neDownLog(item,this.scheduleId);
  }
  
  showResult(item){ 
    let temp = this.pageType == "job" ? 
              {sid:this.scheduleId,job:item.checkItemId,pageType:this.pageType}:
              {sid:this.scheduleId,ne:item.neId,pageType:this.pageType};
    this.router.navigate(['/workspace/smart/result/detail',temp ]);
  }

  ngOnInit() { 
    this.route.params.subscribe(data => {
      this.scheduleId = data['id'];
      this.pageType = data['name'];
    });
    this.smartResultFilterService.findSmartCheckResultList(this.scheduleId,this.pageType).subscribe( result => {
        this.resultList = result;
    })
  } 
}
