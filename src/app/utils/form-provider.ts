import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { debug } from 'console';
import { Observable } from 'rxjs';

import { control } from './control';
import { DeviceUtil } from './DeviceUtil';
import { EventAction } from './event-action';
import { Expr } from './expr';
import { Filter } from './filter';
import { form } from './form';
import { Selector } from './selector';
@Injectable({
    providedIn: 'root'
  })
export class FormProvider {
    form:form;
    btnActions:any;
    stateData:any;
    constructor(private route:Router, private deviceUtil:DeviceUtil, private gateway:HttpClient){}
    create(tempId:any, form:form, stateData:any){
        this.form = form;
        this.stateData = stateData;
        this.loadPageActions(tempId);
    }
    private loadPageActions(tempId:any){
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
            let loadAction = this.btnActions.find((item:any)=>item.controlId === cntrl.id && item.type === 'load');
            if(!loadAction){
              let evaluator:any = this.deviceUtil.findEvaluator(cntrl?.type);
                if(evaluator){
                  let cntrlActionSet = this.btnActions.filter((item:any)=>item.controlId === cntrl.id && item.type === 'select')            
                  evaluator.add2Control(cntrl, formContext);
                  cntrlActionSet.forEach((cAction:any)=>{
                    this.callActions(cAction, {source: this.form, event: undefined, control: cntrl}, (result:any)=>{
                      if(result && result.length > 0 && result[0].navigation)
                        this.route.navigate([result[0].navigation], {state: this.stateData});          
                    });
                  });
                }
            }
          });
        }else{
          let eActions:any = this.btnActions.filter((item:any)=>item.type === 'load' && item.controlType !== 'form');
          if(eActions.length > 0){
            eActions.forEach((action:any)=>{
              /*let widget:any = this.form;
              let controlId = action.controlId;
              
              if(controlId.indexOf('_')> -1){
                let pControlId = controlId.split('_')[0];
                widget = widget.controls.find((cntrl:any)=>cntrl.id === pControlId);
                if(!widget)
                  return;
              }
              let evaluator:any = this.deviceUtil.findEvaluator(widget?.type);
              if(evaluator){            
                evaluator.add2Control(widget, formContext);
              }*/          
              this.callActions(action, formContext, (result:any)=>{
                let resCntrl = this.findControl(action, this.form);//this.form.controls.find((item:any)=>item.id === action.controlId);
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
      private findControl(action:any, formContext:any){
        let controlParentId = action.controlParentId;        
        let controlId = action.controlId;
        if(controlId.indexOf('_')> -1 && !controlParentId){
          controlParentId = controlId.split('_')[0];                   
        }
        if(controlParentId){
          let parent = formContext.controls.find((cntrl:any)=>cntrl.id === controlParentId);
          if(parent.type === "matTable"){   
            let matControl;         
            for(let idx=0; idx<parent.controls.length; idx++){
              let item = parent.controls[idx];              
              for(let key in item){
                let value = item[key];                
                if(value.control.id === controlId){
                  matControl = value.control;
                  break;
                }
              }
              if(matControl)
                break;              
            }
            return matControl;
          }else
            return parent.controls.find((cntrl:any)=>cntrl.id === controlId);
        }else{
          return formContext.controls.find((cntrl:any)=>cntrl.id === controlId);
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
      }
      onSubmit(event: Event, control: any) {
        let clickAction = this.btnActions.find((item:any)=>item.controlId === control.id && item.type === 'click');
        if(clickAction){
          this.callActions(clickAction, this.form, (result:any)=>{
            if(result && result.length > 0 && result[0].navigation)
              this.route.navigate([result[0].navigation], {state: this.stateData});
              
          });
        }
      }
      onChoose(event: any, question: control, value: string){
        let clickAction = this.btnActions.find((item:any)=>item.controlId === question.id && item.type === 'select');
        if(clickAction){
          this.callActions(clickAction, {source: this.form, event: event, control: question}, (result:any)=>{
            if(result && result.length > 0 && result[0].navigation)
              this.route.navigate([result[0].navigation], {state: this.stateData});          
          });
        }
      }
      private callActions(eAction:EventAction, context:any, next?:CallableFunction){    
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
        /*if(!rowId)
          rowId = 0;*/

        if(crit.scope.paramName === 'session'){     
          crit.data = this.stateData[crit.element];
          if(!crit.data){
            crit.data = this.deviceUtil.getSessionData(crit.element);
          }
        }else if(crit.scope.paramName !== 'session' && crit.scope.paramName !== 'page'){
          let control = this.form.controls.find((cntrl:any)=>cntrl.id === crit.scope.paramName);
          if(!control)
            control = this.form.controls.find((cntrl:any)=>cntrl.name === crit.scope.paramName);
          if(crit.scope.parentType === 'matTable'){
            let parent:any = this.form.controls.find((cntrl:any)=>cntrl.id === crit.scope.parent);
            //let wControls:any = parent.matTable?parent.matTable:parent.controls;
            let wControls:any = parent.controls?parent.controls:parent.matTable;
            if(rowId){
              let row = wControls[rowId];
                let rowValue = Object.values(row); 
                let found:any = rowValue.find((hdr:any)=>hdr.control.name === crit.scope.paramName);
                if(found){
                  control = found.control;
                }
            }else{
              for(let idx=0; idx<wControls.length; idx++){
                let row = JSON.parse(JSON.stringify(wControls[idx]));
                if(row) // gets error due to isLinked property in matTable. thats why removing the property.
                  delete row.isLinked;
                let rowValue = Object.values(row); 
                let found:any = rowValue.find((hdr:any)=>hdr.control.name === crit.scope.paramName);
                if(found){
                  control = found.control;
                  break;
                }
              }
            }
          }
          if(control){
            if(control.options && control.options.length > 0){
              let found = control.options.find((opt:any)=>opt.defaultSelect === true && opt.value !== 'Choose');
              if(found){
                crit.data = found.value;
              }
            }else   
              crit.data = control.value;
          }
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
      isAutoGrowMatTable(id:string){
        let found = this.form.controls.find((item:any)=>item.id === id);
        if(found && found.autoGrow === true)
          return true;
        return false;
      }
      findMatTableRows(id:string){
        let size = 0;
        let found = this.form.controls.find((item:any)=>item.id === id);
        if(found && found.autoGrow === true && found.controls){
          size = found.controls.length;
        }
        return size;
      }
}
