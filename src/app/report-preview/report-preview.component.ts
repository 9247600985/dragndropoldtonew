import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Selector } from '../utils/selector';

@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit {
  isDisplayBack:boolean = true;
  patProfile:any = {};
  item:any;
  containers:any = [];
  form:any = {};
  stateData:any;
  constructor(private route: Router, public deviceUtil: DeviceUtil, private gateway: HttpClient) {
    let navigation = this.route.getCurrentNavigation();
    if (navigation)
      this.stateData = navigation.extras.state;
  }
  ngOnInit() {
    //this.getTemplateById(null);
    // Our Simple Data in Object format:
  	
  }
  getTemplateById(template:any)
  {
    let frmTemplate = template;
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    tempFilter.and(Expr.eq('rowId', 'wRfTGlXU8a9buMmsRR43'));
    let selector = new Selector("CONTENT");
    selector.addFilter(tempFilter);
    this.gateway.get<any>('/api/v1/rpttemplate'+selector.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        frmTemplate = result.results[0].CONTENT;        
        
      }
    });
  }
  ngOnInit2() {
    let previewData:any = this.deviceUtil.getSessionData('report-preview');
    if(previewData){
      this.deviceUtil.removeSessionData('report-preview');
      this.form = previewData.template;
      /*this.mappedDeptCode = previewData.deptCode;
      this.mappedSectionCode = previewData.sectionId;
      this.departments = previewData.departments;*/
      this.isDisplayBack = true;
    }
  }
  isDisplayPatient(){}
}
