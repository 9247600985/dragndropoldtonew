import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Selector } from '../utils/selector';

@Component({
  selector: 'app-report-details',
  templateUrl: './report-details.component.html',
  styleUrls: ['./report-details.component.css']
})
export class ReportDetailsComponent implements OnInit {
  stateData: any;
  dtHeader:any=[];
  dtBody:any=[];
  isDisplayTable:boolean;
  
  constructor(private route: Router, private deviceUtil:DeviceUtil, private gateway:HttpClient, private toast:ToastComponent) { 
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }
  
  ngOnInit() {
    if (!this.stateData){
      this.route.navigate(['/login']);
      return;
    }
    this.getAllRptTemplates();
  }
  onRowClick(event: any) {
    this.getTemplateById(event);
  }
  getTemplateById(template:any)
  {
    let frmTemplate = template;
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    tempFilter.and(Expr.eq('rowId', template.TEMPID));
    let selector = new Selector("CONTENT");
    selector.addFilter(tempFilter);
    this.gateway.get<any>('/api/v1/rpttemplate'+selector.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        frmTemplate = result.results[0].CONTENT;        
        this.route.navigate(['/report-engine'], { state: { rowId: template.TEMPID, template: frmTemplate , actions: template.actions, deptCode: template.deptCode, sectionId: template.sectionId, departments: null} });
      }
    });
  }
  createReport(){
    this.route.navigate(['/report-engine'], {state:{}});
  }
  getAllRptTemplates(){
    let selector = new Selector('TEMPNAME');
    selector.addColumn('TEMPTYPE');
    selector.addColumn('TEMPID');
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    selector.addFilter(tempFilter);
    this.gateway.get<any>('/api/v1/rpttemplate'+selector.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      let templateIds:any = [];
      if (result.status === 0 && result.results.length > 0) {
        result.results.forEach((element: any) => {
          templateIds.push(''+element.TEMPID);
        });
        this.dtHeader = [
          //{ title: 'TEMPTYPE', data: 'tempType' },
          { title: 'TEMPNAME', data: 'TEMPNAME' }
        ];
        this.dtBody = result.results;
        this.isDisplayTable = true;       
        //this.getTemplateMapping(templateIds, result.results);
      }
    });
  }
}
