import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';


import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DeviceUtil } from '../utils/DeviceUtil';
import { Tab } from '../tabs-widget/tab';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';
import { Selector } from '../utils/selector';
import { EventAction } from '../utils/event-action';
import { control } from '../utils/control';
import { option } from '../utils/option';
import { form } from '../utils/form';
import { DialogPopupService } from '../dialog-popup/dialog-popup.service';
import { FormProvider } from '../utils/form-provider';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent implements OnInit,AfterViewInit, OnDestroy {

  Object = Object;
  deptTemplates: any = [];
  form: form;
  stateData: any;
  departments:any = [];
  patProfile: any;
  modalData: any;
  btnActions: any;
  isShowPopup = false;
  imageSrc: string
  imageId: string
  formLoadData:any;
  isDisplayBack:boolean = false;
  mappedDeptCode:any;
  mappedSectionCode:any;
  
  /*toolTypes: any = [
    {name: 'Text', icon: 'font', type: 'text'},
    {name: 'Input', icon: 'i-cursor', type: 'input'},
    {name: 'Multiline Input', icon: 'i-cursor', type: 'textarea'},
    {name: 'Dropdown', icon: 'angle-down', type: 'dropdown'},
    {name: 'Yes / No', icon: 'dot-circle', type: 'condition'},
    {name: 'Radio Group', icon: 'dot-circle', type: 'radio'},
    {name: 'Checkbox Group', icon: 'check-square', type: 'checkbox'},
    //{name: 'Table', icon: 'table', type: 'table'},
    {name: 'Matrix Table', icon: 'table', type: 'matTable'},
    {name: 'Button', icon: 'hand-pointer', type: 'button'},
    { name: 'Import Template', icon: 'download', type: 'template' },
    { name: 'Auto Complete', icon: 'list-ul', type: 'autoComplete' },
  ];*/
  containers = ['accordion', 'tabs', 'container'];
  accordionData:any = [{
    "title": "<b>Parent One</b>",
    "data":
      [
        { "Q1_S0": "Property One" },
        { "Q1_S1": "Property Two" }
      ]
  }, {
    "title": "<b>Parent Two</b>",
    "data":
      [
        { "Q1_S0": "Property Three" },
        { "Q1_S1": "Property Four" },
        
      ]
  }, {
    "title": "<b>Parent Three</b>",
    "data":
      [
        { "Q1_S0": "Property Five" },
        { "Q1_S1": "Property Six" }
      ]
  }];
  tabsData:Tab[] = [{
    "title": "Parent One",
    "active": true,
    "iconClass":"fab fa-html5",    
    "content":
      [
        { "Q1_S0": "Property One" },
        { "Q1_S1": "Property Two" }
      ]
  }, {
    "title": "Parent Two",
    "iconClass":"fab fa-css3",
    "active": false,
    "content":
      [
        { "Q1_S0": "Property Three" },
        { "Q1_S1": "Property Four" },
        
      ]
  }, {
    "title": "Parent Three",
    "iconClass":"fab fa-js-square",
    "active": false,
    "content":
      [
        { "Q1_S0": "Property Five" },
        { "Q1_S1": "Property Six" }
      ]
  }];
  constructor(private route: Router, public deviceUtil: DeviceUtil, private gateway: HttpClient, private dialogService: DialogPopupService, private formProvider:FormProvider) {
    let navigation = this.route.getCurrentNavigation();
    if (navigation)
      this.stateData = navigation.extras.state;
  }

  /*private afterPageLoadAction(){
    let eActions:any = this.btnActions.filter((item:any)=>item.controlType === 'form' && item.type === 'postShow');
    if(eActions.length > 0){
      eActions.forEach((eAction:any)=>{
        this.callActions(eAction, {}, this.controlActions.bind(this));
      });
    }else{
      this.controlActions([]);
    }
  }*/
  ngAfterViewInit(): void {
    //this.afterPageLoadAction();
  }
  formContext:any = {};
  
  ngOnInit(): void {      
    if (this.stateData !== undefined && this.stateData !== null && this.stateData.indicator !== 'preview') {
      if (this.stateData.routeId !== undefined && this.stateData.routeId !== null) {
        this.loadTemplate();
      }
      if(this.stateData.departments)
        this.departments = this.stateData.departments;
    }else {
      try {
        let previewData:any = this.deviceUtil.getSessionData('tempPreview');
        if(previewData){
          this.deviceUtil.removeSessionData('tempPreview');
          this.form = previewData.template;
          this.mappedDeptCode = previewData.deptCode;
          this.mappedSectionCode = previewData.sectionId;
          this.departments = previewData.departments;
          this.isDisplayBack = true;
        }else{
          this.route.navigate(['/']);
        }
        delete this.accordionData;
      } catch (err) {
        //Do Nothing
      }
    }
    this.loadCustomerBanner();
  }
  private loadCustomerBanner(){
    let selectedAppt = this.deviceUtil.getGlobalData('appt-selected');
    if (selectedAppt) {
      this.patProfile = selectedAppt;
      this.patProfile.name = this.patProfile.PatientName;
      this.patProfile.appointmentNo = selectedAppt.APPOINTMENTNO;
      if (selectedAppt.Image) {
        this.patProfile.img = selectedAppt.Image;
      } else {
        this.patProfile.img = '../assets/images/avatar.png'
      }
    }  
  }
  private loadTemplate(){
    let currentUrl = this.route.url;
    let tempId = currentUrl.replace('/examForm/', '');
    let filter = new Filter(Expr.eq("rowId", tempId));
    this.gateway.get<any>("/api/v1/template"+filter.get(), this.deviceUtil.getJsonHeaders({requireCache: 'true'})).subscribe((result)=>{
      if (result.status === 0 && result.results.length > 0) {
        let rForm = result.results[0];
        rForm.tempId = rForm.TEMPID;
        rForm.tempName = rForm.TEMPNAME;
        rForm.tempType = rForm.TEMPTYPE;
        rForm.controls = rForm.CONTROLS;
        this.form = rForm;
        this.formProvider.create(tempId, rForm, this.stateData);
        //this.loadPageActions(tempId);
        setTimeout(() => {
          $("p").css({"margin": "0px"});
        }, 200);
      }
    });
  }
  /*private loadPageActions(tempId:any){
    let selector = new Selector('ACTIONS');
    let filter2 = new Filter(Expr.eq("TEMPID", tempId));
    selector.addFilter(filter2);
    this.gateway.get<any>("/api/v1/tempdepartment"+selector.get(), this.deviceUtil.getJsonHeaders({requireCache: 'true'})).subscribe((result)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.btnActions = result.results[0].ACTIONS;
        //debugger;
        this.pageLoadAction();
      }
    });
  }
  private addMapping(mapping:any, mappingType:any, result:any, actionType:any){
    let cntrlData:any = [];
    if(mapping){    
      let oMapping = mapping.find((map:any)=>map.type === mappingType);
      if(oMapping && oMapping.data){
        if(Array.isArray(result)){          
          result.forEach((el:any)=>{
            let elem:any = {};
            oMapping.data.forEach((item:any)=>{
              if(el[item.element]){
                elem[item.scope.paramName] = { value: el[item.element], parent:item.scope.parent, parentType: item.scope.parentType};
              }
            });
            cntrlData.push(elem);
          });
        }
      } 
    }
    return cntrlData;
  }
  private fireAction(action:any, context:any, actionType:any):Observable<any>{  
    return new Observable<any>(observer => {  
      if(action.type === 'network'){        
        this.fireService(action, context).subscribe((result:any)=>{          
          let cntrlData:any = this.addMapping(action.operation.mapping, "output", result, actionType);        
          observer.next(cntrlData);
          observer.complete();
        }); 
      }else if(action.type === 'navigate'){
        observer.next([{navigation: action.operation}]);
        observer.complete();
      }else if(action.type === 'functions'){
        if(actionType === 'load'){        
          let cntrlData:any = this.addMapping(action.operation.mapping, "output", context, actionType);       
          observer.next(cntrlData);
          observer.complete();
        }else{
          let operation = action.operation;
          let evaluator = this.deviceUtil.findEvaluator(action.serviceId);
          let oMapping = operation.mapping.find((map:any)=>map.type === "output");
          let iMapping = operation.mapping.find((map:any)=>map.type === "input");
          evaluator.execute(iMapping?.data, oMapping?.data, context);
          observer.next(context);
          observer.complete();
        }
      }else if(action.type === 'evaluator'){
        let operation = action.operation;
        if(operation.mapping){          
          let value;
          if(action.controlType === 'form')
            value = context;
          else{
            let evaluator = this.deviceUtil.findEvaluator(operation.id.target);
            if(evaluator){
              let oMapping = operation.mapping.find((map:any)=>map.type === "output");
              let iMapping = operation.mapping.find((map:any)=>map.type === "input");
              value = evaluator.execute(iMapping?.data, oMapping?.data, context);
            }
          }
          observer.next(value);
          observer.complete();
        }else{
          observer.next(context);
          observer.complete();
        }
      }else{
        observer.next(context);
        observer.complete();
      }
    });    
  }
  private controlActions(formContext:any, action?:EventAction){    
    if(action && action.controlType === 'form'){
      this.form.controls.forEach((cntrl:any)=>{
        let evaluator:any = this.deviceUtil.findEvaluator(cntrl?.type);
          if(evaluator){            
            evaluator.add2Control(cntrl, formContext);
          }
      });
    }else{
      let eActions:any = this.btnActions.filter((item:any)=>item.type === 'load' && item.controlType !== 'form');
      if(eActions.length > 0){
        eActions.forEach((action:any)=>{
          let widget:any = this.form;
          let controlId = action.controlId;
          let cntrl:any;
          if(controlId.indexOf('_')> -1){
            let pControlId = controlId.split('_')[0];
            widget = widget.controls.find((cntrl:any)=>cntrl.id === pControlId);
            if(!widget)
              return;
          }
          let evaluator:any = this.deviceUtil.findEvaluator(widget?.type);
            if(evaluator){            
              evaluator.add2Control(widget, formContext);
            }          
          this.callActions(action, formContext, (result:any)=>{
            let resCntrl = this.form.controls.find((item:any)=>item.id === action.controlId);
            if(resCntrl){
              let evaluator:any = this.deviceUtil.findEvaluator(resCntrl?.type);
              if(evaluator){
                evaluator.add2Control(resCntrl, result);
              }
            }
          });
        });
      }
    }    
  }
  private pageLoadAction(){
    let eActions:any = this.btnActions.filter((item:any)=>item.controlType === 'form');
    if(eActions.length > 0){      
      eActions.forEach((eAction:any)=>{
        if(eAction.type !== 'postShow'){
          this.callActions(eAction, {}, this.controlActions.bind(this));
        }
      });
    }else{
      //this.controlActions([]);
    }
    this.controlActions([]);    
  }*/
  onSubmit(event: Event, control: any) {
    this.formProvider.onSubmit(event, control);
    /*let clickAction = this.btnActions.find((item:any)=>item.controlId === control.id && item.type === 'click');
    if(clickAction){
      this.callActions(clickAction, this.form, (result:any)=>{
        if(result && result.length > 0 && result[0].navigation)
          this.route.navigate([result[0].navigation], {state: this.stateData});
          
      });
    }*/
  }
  onChoose(event: any, question: control, value: string){
    this.formProvider.onChoose(event, question, value);
    /*let clickAction = this.btnActions.find((item:any)=>item.controlId === question.id && item.type === 'select');
    if(clickAction){
      this.callActions(clickAction, {source: this.form, event: event, control: question}, (result:any)=>{
        if(result && result.length > 0 && result[0].navigation)
          this.route.navigate([result[0].navigation], {state: this.stateData});          
      });
    }*/
  }
  /*private callActions(eAction:EventAction, context:any, next?:CallableFunction){    
    let index = 0;
    if(eAction && eAction.actionSet){
      let action = eAction.actionSet.length > 0?eAction.actionSet[index]:undefined;
      let subscriber = (result:any)=>{
        index++;        
        let nextAction = eAction.actionSet.length > 0?eAction.actionSet[index]:undefined;
        if(nextAction)
          this.fireAction(nextAction, result, eAction.type).subscribe(subscriber);
        else{
          if(next){            
            next(result, eAction);
          }
        }
      };
      if(action)
        this.fireAction(action, context, eAction.type)?.subscribe(subscriber);
    }
  }

  findElementData(crit:any, context:any, rowId?:number){
    if(!rowId)
      rowId = 0;
    if(crit.scope.paramName === 'session'){     
      crit.data = this.stateData[crit.element];
      if(!crit.data){
        crit.data = this.deviceUtil.getSessionData(crit.element);
      }
    }else if(crit.scope.paramName !== 'session' && crit.scope.paramName !== 'page'){
      let control = this.form.controls.find((cntrl:any)=>cntrl.id === crit.scope.paramName);
      if(crit.scope.parentType === 'matTable'){
        let parent:any = this.form.controls.find((cntrl:any)=>cntrl.id === crit.scope.parent);
        let wControls:any = parent.matTable?parent.matTable:parent.controls;
        let row = wControls[rowId];
          let rowValue = Object.values(row); 
          let found:any = rowValue.find((hdr:any)=>hdr.control.name === crit.scope.paramName);
          if(found){
            control = found.control;
          }
      }
      if(control)   
        crit.data = control.value;
      else
        crit.data = crit.scope.paramName;
    }else{
      crit.data = this.stateData[crit.element];
      if(!crit.data){
        crit.data = this.findControlData(context, crit.element);
      }
    }
  }
  private findControlData(context:any, key:string){
    if(context instanceof form){
      let found:any = context.controls.find((cntrl:any)=>cntrl.id === key);
      if(found){
        return found.value;
      }
    }else{
      return context[key];
    }
  }
  private fireService(action:any, context:any){ 
    return new Observable<any>(observer => { 
      if(action.operation.mapping){        
            this.deviceUtil.callMethod(action, this.gateway, this, context).subscribe((result:any)=>{
              if (result.status === 0 && result.results.length > 0) {
                observer.next(result.results);
                observer.complete();           
              }else{
                observer.next(result);
                observer.complete();
              }
            });
      }
    });    
  }

  findMatTableRows(id:string){
    let size = 0;
    let found = this.form.controls.find((item:any)=>item.id === id);
    if(found && found.controls){
      size = found.controls.length;
    }
    return size;
  }*/
  /*getTemplateData() {
    let filter = new Filter(Expr.eq("APPOINTMENTNO", this.deviceUtil.getSessionData('appointmentNo'), 'string'));
    filter.and(Expr.eq("MRNUMBER", this.deviceUtil.getSessionData('mrnumber'), 'string'));
    this.gateway.get<any>('/api/v1/template/getEyeAssessmentByMR?'+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        let tempData = JSON.parse(result.results[0].formdata);
        this.form.controls.forEach((element: any) => {
          if (element.type === 'matTable') {
            for (let i = 0; i < element.matTable.length; i++) {
              let keys = Object.keys(element.matTable[i]);
              for (let j = 0; j < keys.length; j++) {
                element.matTable[i][keys[j]].control.value = tempData[element.matTable[i][keys[j]].control.id]
              }
            }
          }
          else
            element.value = tempData[element.id];
        });
      }
    });
  }*/

  skipTo(event: any, question: control, value: string) {
    /*let data: any;
    if (question.logic.type !== '') {
      const index = this.form.controls.findIndex((x: any) => x.id === question.id);
      if (question.logic.skipTo === 'end of survey') {
        data = this.form.controls.slice(index + 1, this.form.controls.length - 1);
      }
      else {
        const skipToIndex = this.form.controls.findIndex((x: any) => x.name === question.logic.skipTo);
        data = this.form.controls.slice(index + 1, skipToIndex);
      }
      data.forEach((element: any) => {
        element.canShow = !element.canShow;
      });
    }*/
  }
  isDisplayPatient() {
    if (this.stateData)
      return this.patProfile !== null;
    return false;
  }
  checkChanged(event: Event, que: control, opt: option) {
    if (que.type === 'radio' || que.type === 'condition') {
      this.radioOptionChecked(opt, que, que.options);
    }
    else {
      this.checkOptionChecked(opt, que, que.options);
    }
  }
  radioOptionChecked(event: any, que: control, opt: option[]) {
    let option = opt.find((x: any) => x.defaultSelect === true);
    if (option != null)
      option.defaultSelect = false;

    option = opt.find((x: any) => x.id === event.id);
    if (option != null) {
      option.defaultSelect = true;
      que.value = option.value;
    }
  }

  checkOptionChecked(event: any, que: control, opt: option[]) {
    let option = opt.find((x: any) => x.id === event.id);
    if (option != null) {
      if (option.defaultSelect)
        option.defaultSelect = false;
      else
        option.defaultSelect = true;
    }
    this.formProvider.onChoose(event, que, 'true');
  }
  openDrawingTool(event: Event, control: control) {
    event.preventDefault();
    this.isShowPopup = true;
    this.imageSrc = control.value || '';
    this.imageId = control.id || '';
  }

  getImageFromDrawingTool(image: any) {
    let control = this.form.controls.find((x: any) => x.id === image.imageId);
    if (control !== undefined) {
      control.value = image.imageData
    }
    else {
      let found = false;
      let matTable = this.form.controls.filter((x: any) => x.type === 'matTable');
      matTable.forEach((element: any) => {
        if (!found) {
          for (let i = 0; i < element.matTable.length; i++) {
            let keys = Object.keys(element.matTable[i]);
            for (let j = 0; j < keys.length; j++) {
              if (element.matTable[i][keys[j]].hasOwnProperty('control')) {
                if (element.matTable[i][keys[j]].control.id === image.imageId) {
                  element.matTable[i][keys[j]].control.value = image.imageData;
                  found = true;
                  break;
                }
              }
            }
            if (found)
              break;
          }
        }
      });
    }
    this.isShowPopup = false;
  }
  onRowClick(event: any)
  {
  }

  // Auto Complete
  getSelectedItem(event: any, control: control)
  {
    console.log(event);
  }
  widgetActionEvent(event:any){
    let action = event.action;
    let currentInstance:any = this;
    currentInstance[action].apply(this, event.params);
  }
  toggleAccordion(item:any) {
    console.log(item)
  }
  ngOnDestroy(): void {
    if(this.isDisplayBack === true){
      let matTable:any = this.form.controls.filter((item:any)=>item.defaultType === 'matTable');
      if(matTable){
        matTable.forEach((cntrl:any)=>{          
          if(!cntrl.controls){
            cntrl.controls = cntrl.matTable;  
          }
          cntrl.controls = cntrl.controls.filter((cntrl:any)=>{
            if(!cntrl.isLinked)
              return cntrl;
          });
        });
      }
    }
  }
  closePopup(){
    this.dialogService.close('custom-modal-2');
    //item.canShow = false;     
  }
}
