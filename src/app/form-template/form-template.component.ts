import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';


import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';
import { control } from '../utils/control';
import { option } from '../utils/option';
import { form } from '../utils/form';
import { FormProvider } from '../utils/form-provider';
@Component({
  selector: 'app-form-template',
  templateUrl: './form-template.component.html',
  styleUrls: ['./form-template.component.css']
})
export class FormTemplateComponent implements OnInit,AfterViewInit, OnDestroy {

  Object = Object;
  
  @Input()
  item:any;

  form: form;
  
  patProfile: any;
  
  //btnActions: any;
  isShowPopup = false;
  imageSrc: string
  imageId: string
  
  isDisplayBack:boolean = false;
  @Input()
  templateData:any;
  containers = ['accordion', 'tabs', 'container'];
  constructor(private route: Router, public deviceUtil: DeviceUtil, private gateway: HttpClient, private formProvider:FormProvider) {    
  }
  ngAfterViewInit(): void {
  }
  formContext:any = {};
  ngOnInit(): void {
    if(this.templateData.indicator !== 'preview' && this.item.attrs){
      this.loadTemplate(this.item.attrs['tempId']);
    }
  }
  private loadTemplate(tempId:any){
    let filter = new Filter(Expr.eq("rowId", tempId));
    this.gateway.get<any>("/api/v1/template"+filter.get(), this.deviceUtil.getJsonHeaders({requireCache: 'true'})).subscribe((result)=>{
      if (result.status === 0 && result.results.length > 0) {
        let rForm = result.results[0];
        rForm.tempId = rForm.TEMPID;
        rForm.tempName = rForm.TEMPNAME;
        rForm.tempType = rForm.TEMPTYPE;
        rForm.controls = rForm.CONTROLS;
        this.form = rForm;
        this.formProvider.create(tempId, rForm, this.templateData);
        //this.loadPageActions(tempId);
        setTimeout(() => {
          $("p").css({"margin": "0px"});
        }, 200);
      }
    });
  }
/*  private loadPageActions(tempId:any){
    let selector = new Selector('ACTIONS');
    let filter2 = new Filter(Expr.eq("TEMPID", tempId));
    selector.addFilter(filter2);
    this.gateway.get<any>("/api/v1/tempdepartment"+selector.get(), this.deviceUtil.getJsonHeaders({requireCache: 'true'})).subscribe((result)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.btnActions = result.results[0].ACTIONS;
        this.pageLoadAction();
      }
    });
  }
  private addMapping(mapping:any, mappingType:any, result:any, actionType:any){
    let cntrlData:any = [];
    if(mapping){    
      let oMapping = mapping.find((map:any)=>map.type === mappingType);
      if(oMapping && oMapping.data){
        oMapping.data.forEach((item:any)=>{
          if(Array.isArray(result)){
            result.forEach((el:any)=>{
              if(el[item.element]){
                let elem:any = {};
                elem[item.scope.paramName] = { value: el[item.element], parent:item.scope.parent, parentType: item.scope.parentType};
                cntrlData.push(elem);                
              }
            });
          }else if(item.scope.paramName === 'navigation'){
            let elem:any = {};   
            elem['navigation'] = item.element;
            cntrlData.push(elem);
          }
        });
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
        }else if(actionType === 'select'){
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
            let evaluator:any = this.deviceUtil.findEvaluator(cntrl?.type);
            if(evaluator){
              evaluator.add2Control(cntrl, result);
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
      this.controlActions([]);
    }
  }*/
  onSubmit(event: Event, control: any) {
    this.formProvider.onSubmit(event, control);
    /*let clickAction = this.btnActions.find((item:any)=>item.controlId === control.id && item.type === 'click');
    if(clickAction){
      this.callActions(clickAction, this.form, (result:any)=>{
        if(result && result.length > 0 && result[0].navigation)
          this.route.navigate([result[0].navigation], {state: this.templateData});
          
      });
    }*/
  }
  onChoose(event: any, question: control, value: string){
    this.formProvider.onChoose(event, question, value);
    /*let clickAction = this.btnActions.find((item:any)=>item.controlId === question.id && item.type === 'select');
    if(clickAction){
      this.callActions(clickAction, {source: this.form, event: event, control: question}, (result:any)=>{
        if(result && result.length > 0 && result[0].navigation)
          this.route.navigate([result[0].navigation], {state: this.templateData});          
      });
    }*/
  }
/*  private callActions(eAction:EventAction, context:any, next?:CallableFunction){    
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
      crit.data = this.templateData[crit.element];
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
      crit.data = control?.value;
    }else{
      crit.data = this.templateData[crit.element];
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
  }*/

  /*findMatTableRows(id:string){
    let size = 0;
    let found = this.form.controls.find((item:any)=>item.id === id);
    if(found && found.controls){
      size = found.controls.length;
    }
    return size;
  }*/

  skipTo(event: any, question: control, value: string) {
  }
  isDisplayPatient() {
    if (this.templateData)
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
}
