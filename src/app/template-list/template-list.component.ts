import { Component, OnInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';
import { ToastComponent } from '../toast/toast.component';
import { Selector } from '../utils/selector';
import { Observable, forkJoin} from "rxjs";

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  dtBody: any[] = [];
  dtHeader: any = [];
  isDisplayTable: boolean = false;
  templates: any;
  stateData: any;
  tabHeaders: any;
  departments = [];
  deptSections = [];
  selectedDept:string = '';
  serviceData:any = [];
  mappings:any = [];
  constructor(private deviceUtil: DeviceUtil, private route: Router, private gateway: HttpClient, private toast:ToastComponent) {
    let navigation = this.route.getCurrentNavigation();
    if (navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    if (!this.stateData) {
      this.route.navigate(['/login']);
      return;
    }
    this.isDisplayTable = false;
    this.loadServices();
    forkJoin([this.getAllDepartments(), this.getAllTemplates(), this.getAllTemplateMappings()]).subscribe((results:any) => {
      this.departments = (results[0].status === 0 && results[0].results.length > 0)?results[0].results:[];
      let templates:any[] = (results[1].status === 0 && results[1].results.length > 0)?results[1].results:[];
      let mappings:any[] = (results[2].status === 0 && results[2].results.length > 0)?results[2].results:[];
      let sectionIds:any = [];
      this.dtBody = templates.filter((item: any) => {
        item.tempType = item.TEMPTYPE;
        item.TEMPID = item.TEMPID ? item.TEMPID : item.rowId;
        item.tempId = item.TEMPID;
        item.sectionId = -1;
        item.sectionName = '';
        item.deptCode = '';
        item.deptName = '';
        item.actions = [];
        item.tempName = item.TEMPNAME;
        let findSection = mappings.find((sectionTemp:any)=>sectionTemp.TEMPID === item.TEMPID);
        if(findSection){          
          let dept:any = this.departments.find((dept:any)=>dept.DEPTCODE === findSection.DEPTCODE);
          if(dept){
            item.deptName = dept.DEPTNAME;
            item.deptCode = findSection.DEPTCODE;
          }
          item.sectionId = findSection.SECTIONID;
          let tmpSecId = sectionIds.findIndex((sec:any)=>sec === item.sectionId);
          if(tmpSecId === -1)
            sectionIds.push(item.sectionId);
        }
        return item;
      });
      this.loadAssociatedSections(sectionIds).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          this.dtBody = this.dtBody.filter((item:any)=>{
            let found = result.results.find((sec:any)=>sec.SECTIONID === item.sectionId);
            if(found){
              item.sectionName = found.SECTIONNAME;
            }else{
              item.sectionName = '';
            }
            return item;
          });
        }
        this.isDisplayTable = true;         
      });
      this.dtHeader = [
        //{ title: 'TEMPTYPE', data: 'tempType' },
        { title: 'TEMPNAME', data: 'tempName' },
        { title: 'SECTION', data: 'sectionName' },
        { title: 'DEPARTMENT', data: 'deptName' }
      ]; 
         
    });
    
  }
  loadServices(){
    this.serviceData = [];
    this.gateway.get<any>('/api/v1/services?select=', this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.serviceData = result.results;
      }
    });
  }
  onRowClick(event: any) {
    this.getTemplateById(event);
  }
  getAllTemplates(){
    let selector = new Selector('TEMPNAME');
    selector.addColumn('TEMPTYPE');
    selector.addColumn('TEMPID');
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    selector.addFilter(tempFilter);
    let templateUpd = this.deviceUtil.getGlobalData('TEMPLATE_UPD')?false:true;
    return this.gateway.get<any>('/api/v1/template'+selector.get(), this.deviceUtil.getJsonHeaders({requireCache: !templateUpd}));
  }
  getAllTemplateMappings(){
    let selector = new Selector('TEMPID');
    selector.addColumn('SECTIONID');
    selector.addColumn('DEPTCODE');
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    selector.addFilter(tempFilter);
    return this.gateway.get<any>('/api/v1/tempdepartment'+selector.get(), this.deviceUtil.getJsonHeaders());
  }
  getTemplateById(template:any)
  { 

    let frmTemplate = template;
    frmTemplate.tempType = frmTemplate.TEMPTYPE;
    frmTemplate.TEMPID = frmTemplate.TEMPID ? frmTemplate.TEMPID : frmTemplate.rowId;
    frmTemplate.tempId = frmTemplate.TEMPID;
    frmTemplate.tempName = frmTemplate.TEMPNAME;

    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    tempFilter.and(Expr.eq('TEMPID', template.tempId));
    let selector = new Selector("CONTROLS");    
    selector.addFilter(tempFilter);
    let templateUpd = this.deviceUtil.getGlobalData('TEMPLATE_UPD')?false:true;
    this.gateway.get<any>('/api/v1/template'+selector.get(), this.deviceUtil.getJsonHeaders({requireCache: !templateUpd})).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        frmTemplate.controls = result.results[0].CONTROLS;
        delete frmTemplate.CONTROLS;
        this.route.navigate(['/template'], { state: { template: frmTemplate , actions: template.actions, deptCode: template.deptCode, sectionId: template.sectionId, departments: this.departments, templates: this.dtBody} });
      }
    });
  }
  getAllDepartments() {
    return this.gateway.get("/api/v1/department");
  }
  loadAssociatedSections(sectionIds:any) {
    if(sectionIds.length > 0){
      let filter = new Filter(Expr.eq('STATUS', 0));
      filter.and(Expr.in('SECTIONID', sectionIds));
      return this.gateway.get("/api/v1/deptsection"+filter.get());
    }else{
      return new Observable<any>(observer => {            
        observer.next({status:0, results: []});
        observer.complete();
    });
    }
  }
  createTemplate(){
      this.route.navigate(['/template'], {state:{departments: this.departments, isNewTemplate: true, templates: this.dtBody}});
  }
}
