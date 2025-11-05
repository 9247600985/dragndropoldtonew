import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeviceUtil } from '../utils/DeviceUtil';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { DialogPopupService } from '../dialog-popup/dialog-popup.service';
import { EventAction } from '../utils/event-action';
import { Action } from '../utils/action';
import { control } from '../utils/control';
@Component({
  selector: 'app-action-editor',
  templateUrl: './action-editor.component.html',
  styleUrls: ['./action-editor.component.css']
})
export class ActionEditorComponent implements OnInit {
  operatorTypes: any = [
    { target: 'eq', source: '==' },
    { target: 'ne', source: '!=' },
    { target: 'gt', source: '>' },
    { target: 'lt', source: '<' },
    { target: 'ge', source: '>=' },
    { target: 'le', source: '>=' },
  ];
  decisionTypes: any = [
    { source: 'and', target: 'and' },
    { source: 'or', target: 'or' },
  ];
  decisionType:string = '';
  conditionTypes: any = ['if', 'else If', 'else'];
  conditionType:string = '';  
  criteria:string = '';
  conditionAttrs:any = [];
  mappingActions:any = [{id: 'input', desc: 'Input', icon: 'fa-level-up-alt'}, {id: 'output', desc: 'Output', icon: 'fa-level-up-alt'}];
  isShowFieldPopup = false;


  DBTablesAutoComplete: any[] = [];
  httpMethods:any = [{id:'GET', name: 'GET', data: ''}, {id:'POST', name: 'POST', data: ''}, {id:'PUT', name: 'PUT', data: ''}, {id:'DELETE', name: 'DELETE', data: ''}, {id:'PATCH', name: 'PATCH', data: ''}];
  actionType:string = '';
  //actionTypes:any = ['functions', 'condition', 'network', 'navigate'];
  actionTypes:any = ['functions', 'network'];
  actionApiTypes:any = [];
  netApiTypes:any = ['service', 'view', 'orchestration'];
  scopeTypes:any = [{paramName:'session'}, {paramName: 'page'}];
  srcTagName:string = '';
  tgtTagName:string = '';
  actionApiType:string = '';
  @Input()
  serviceData:any = [];
  selectedApi:any = {};
  selectedOpr:any = {};
  apiSet:any = [];
  apiParams:any = [];
  sourceParams:any = [];
  targetParams:any = [];
  @Input()
  mapperAction:any = {};
  eventSeqElements:any = [];
  mappingType:string = '';
  operatorType:string = '';
  paramSrc:string = '';
  paramTgt:string = '';
  @Input()
  eventType:string = '';

  @Output() actionEvent = new EventEmitter<any>();
  selectedSvc:any;
  selectApiType:string = '';
  functionList:any = [];
  isControlSaved:boolean = false;
  actionSet:any = [];
  stateData:any;
  customType:string = '';
  @Input()
  templateType:any;
  elementsList:any = [];
  navigationList: any = [];
  mappedElement:any;
  fieldProvider:any;
  reportList:any = [];
  constructor(private route: Router, private deviceUtil:DeviceUtil, private gateway:HttpClient, private fieldService: DialogPopupService) {
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }
   @Input()
   actionEventSet:any;
  ngOnInit(): void {
    this.operator = 'and';
    if(!this.stateData){
      this.route.navigate(['/']);
      return;
    }
    
    this.actionSet = [];
    if(this.stateData.actionEventSet){
      this.actionEventSet = this.stateData.actionEventSet;
    }else{
      this.actionEventSet = [];
    }
    if(this.stateData.controlActionLogic){
      this.addControlActionLogic.apply(this, this.stateData.controlActionLogic);
    }
    this.loadReports();
    this.loadTemplates();
    this.addMapperAction();
  }
  loadReports(){
    this.reportList = [];
    this.stateData.reports.forEach((item:any)=>{
      item.id = item.TEMPNAME;
      item.name = item.TEMPNAME;
      this.reportList.push({id: item.TEMPNAME, name: item.TEMPNAME, data: item});
    });
  }
  loadTemplates(){
    this.navigationList = [];
    this.stateData.templates.forEach((item:any)=>{
      item.id = item.TEMPNAME;
      item.name = item.TEMPNAME;
      this.navigationList.push({id: item.TEMPNAME, name: item.TEMPNAME, data: item});
    });
    let configRoutes:any;
    let configRoute:any = this.route.config;
    let component = configRoute.find((item:any)=>(item.children &&  item.children.length > 0));
    if(component){
      configRoutes = component.children[0]._loadedConfig.routes;
    }    
    configRoutes.forEach((item:any)=>{
      if(item.path !== 'examForm/:id'){
        item.id = item.path;
        item.name = item.path;
        this.navigationList.push({id: item.path, name: item.path, data: item}); 
      }
    });    
  }
  addMapperAction(){
    if(this.stateData.mapperAction)
      this.mapperAction = this.stateData.mapperAction;
    this.serviceData = this.stateData.serviceData;
    this.loadServices();
    this.loadFunctions();
    this.mapperAction.actionSet.forEach((item:any)=>{
      this.getMappedElement(item);
      this.actionSet.push(item);
    });
    if(this.stateData.elements && this.stateData.elements.length > 0){
      this.elementsList = this.stateData.elements;
    }
  }
  addControlActionLogic(control:any, eventType?:any){
    let found = this.actionEventSet.find((item:any)=>item.type === eventType && item.controlId === control.id);
    if(!found){
      let eAction = new EventAction();
      eAction.id = this.deviceUtil.uuidv4();
      eAction.controlId = control.id;//this.currentControl.id;
      eAction.controlType = control.type;//this.currentControl.type;
      eAction.controlParentId = control.parent;
      eAction.controlParentType = control.parentType;
      eAction.type = eventType;//event.currentTarget.value;
      found = eAction;
    }else{
      if(!found.controlParentId){
        found.controlParentId = control.parent;
        found.controlParentType = control.parentType;
      }
    }
    if(eventType === 'form' && found.actionSet[0].operation.mapping){      
      let mapping = found.actionSet[0].operation.mapping.find((item:any)=>item.type === 'output');
      if(mapping){
        let elements:any = [];
        mapping.data.forEach((elem:any)=>{
          elements.push({id: elem.element, name: elem.element, data: elem});
        });
        if(elements.length > 0){
          this.stateData.elements = elements;
        }
      }
    }
    this.mapperAction = found;
  }
  getMappedElement(action:any){
    if(action.type === 'functions' && action.operation){
      let data:any = action.operation.mapping[0].data;
      if(data && data.length > 0){
        this.mappedElement = data[0].element;
      }      
    }
  }
  drop(event: CdkDragDrop<string[]>) {    
    moveItemInArray(this.actionSet, event.previousIndex, event.currentIndex);
  }

  closeFieldPopup(){
    this.isShowFieldPopup = false;
  }
  chooseActionType(){
    if(this.actionType === '')
      return;    
    this.selectApiType = this.actionType;
    this.submitActionApi(null);
  }
  loadApiMapping(serviceId:any){
    let scopeParams = JSON.parse(JSON.stringify(this.scopeTypes));
      let params = this.stateData.template.controls.filter((item:any)=>item.defaultType !== 'button');
      params.forEach((param:any)=>{
        if(param.defaultType==='matTable'){
          let controls = param.controls?param.controls:param.matTable;
          controls.forEach((element: any) => {
            Object.keys(element).forEach((col: any) => {
              let colData:any = element[col];
              if(colData.control && colData.control.name)
                scopeParams.push({paramName:colData.control.name, parent:colData.control.parent, parentType: colData.control.parentType});
            });
          });
        }
        else
        scopeParams.push({paramName:param.name});
      });
    this.gateway.get<any>('/api/v1/services?select=&filter='+serviceId, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        if(this.mappingType === 'output'){
          this.sourceParams = result.results[0].elements;
          this.targetParams = scopeParams;
          this.srcTagName = 'Element';
          this.tgtTagName = 'Scope';
        }else if(this.mappingType === 'input'){
          this.targetParams = result.results[0].elements;
          this.sourceParams = scopeParams;
          this.tgtTagName = 'Element';
          this.srcTagName = 'Scope';
        }
        this.openModal('custom-modal-2');
      }
      });    
  }
  loadServices(){
    this.DBTablesAutoComplete = [];
    this.serviceData.forEach((item:any)=>{      
      this.DBTablesAutoComplete.push({id: item.id.source,
        name: item.id.source,
        data: item});
    });
  }
  loadFunctions(){
    this.deviceUtil.findAllEvaluators().forEach((item:any)=>{
      this.functionList.push({id: item.id.source,
        name: item.id.source,
        data: item});
    });
    /*EvaluatorUtil.getAll().forEach((item:any)=>{
      this.functionList.push({id: item.id.source,
        name: item.id.source,
        data: item});
    });*/
  }
  chooseActionApi(){    
    this.submitActionApi(null);
  }
  submitActionApi(event:any){
    let action = new Action();
    action.id = this.deviceUtil.uuidv4();
    action.controlId = this.mapperAction.controlId;
    action.type = this.selectApiType;
    action.persist = false;
    action.controlParentId = this.mapperAction.controlParentId;
    action.controlParentType = this.mapperAction.controlParentType;
    this.actionSet.push(action);
    this.actionApiType = '';
    this.actionType = '';
  }
  getSelectedOpr(action:any, event:any){
    this.isControlSaved = true;
    let foundAction:Action = this.actionSet.find((item:any)=>item.id === action.id && item.type === action.type && item.controlId === action.controlId);
    if(foundAction){      
        this.selectedApi = this.serviceData.find((item:any)=>item.id.source === action.serviceId);      
      if(this.selectedApi){
        let operation = this.selectedApi.operations.find((item:any)=>item.id.source === event.id);
        if(operation){
          foundAction.operation = operation;
        }else{
          this.deviceUtil.showToast(event.id+' Not Applicable', true);
        }
      }
    }
  }
  getSelectedItem(action:any, event:any)
  {
    console.log(event);
    this.elementsList = this.stateData.elements;
    this.selectedApi = event.data;
    if(this.selectApiType === 'functions'){
      this.isControlSaved = true;      
    }
    action.serviceId = this.selectedApi.id.source;
    if(event.name === 'navigation')
      action.operation = this.selectedApi.id.target;
    /*let foundAction:Action = this.actionSet.find((item:any)=>item.id === action.id && item.type === action.type && item.controlId === action.controlId);
    if(foundAction && this.selectedApi){
      if(event.name === 'navigation'){
        foundAction.serviceId = this.selectedApi.id.source;
        foundAction.operation = this.selectedApi.id.target;      
      }else
        foundAction.serviceId = this.selectedApi.id.source;
    }*/
  }
  addApiMapping(){
    this.isControlSaved = true;
    this.closeFieldPopup();  
    if(this.selectedOpr){
      if(!this.selectedOpr.mapping){
        this.selectedOpr.mapping = [];
      }
      let found = this.selectedOpr.mapping.find((map:any)=>map.type === this.mappingType);
      if(found){
        found.data = this.apiParams;
          /*let findElem = this.eventSeqElements.find((elem:any)=>elem.name === data.element);
          if(!findElem)
            this.eventSeqElements.push({name: data.element, scope: data.scope});
          else
            findElem.scope = data.scope;
        });*/
      }else{      
        this.selectedOpr.mapping.push({type: this.mappingType, data: this.apiParams});        
      }
      this.apiParams = [];
    }    
  }
  delApi(action:any){    
    let actionIndex = this.actionSet.findIndex((item:any)=>item.id === action.id && item.type === action.type && item.controlId === action.controlId);
    if(actionIndex > -1){ 
      this.actionSet.splice(actionIndex, 1); 
    }
  }
  getSelectedElement(action:any, event:any){
    action.operation = this.selectedOpr;
    let elementId:any;
    if(!event.data)
      return;    
    if(typeof event === 'string'){
      let element = this.elementsList.find((item:any)=>item.id === event);
      if(element)
        elementId = {id: element.data.id, name: element.data.name};
    }else{
      elementId = {id: event.data.id, name: event.data.name};
    }
    let found:any = this.apiParams.find((item:any)=>item.element.id === elementId.id);
    if(found){
      found.condition = '';
      found.element = action.serviceId === 'navigation'?'navigation':'page';
      found.operator = this.operatorType;
      found.scope = elementId;
    }else{
      this.apiParams.push({condition: '', element: elementId, operator: this.operatorType, scope: action.serviceId === 'navigation'?'navigation':'page'});
    }
    this.mappingType = 'output';
    this.addApiMapping();
  }
  addActionMapping(){
    //if(this.isControlSaved){
      this.mapperAction.actionSet.length = 0;
      this.actionSet.forEach((item:any)=>{
        this.mapperAction.actionSet.push(item);
      });     
    //}
    //this.addUpdateActions();
    this.stateData.eventAction = 'addUpdateActions';
    this.stateData.mapperAction = this.mapperAction;
    console.log(this.mapperAction.actionSet);
    this.route.navigate(['/template'], {state: this.stateData});
    //this.actionEvent.emit({action: 'addUpdateActions', params: [this.mapperAction]});    
  }
  toggleAccordian(event:any, action:any){

  }
  chooseConditionType(){}
  closeEditor(){
    
    this.route.navigate(['/template'], {state: this.stateData});
    //this.actionEvent.emit({action: 'addUpdateActions', params: [this.mapperAction]});    
  }
  operator:string = '';
  selectLogicalOperator(operator:any){
    this.operator = operator;
  }
  scope:any;
  selectScope(scope:any){
    this.scope = scope;
  }
  addUpdateActions(){
    let action = this.mapperAction;
    let actionIndex = this.actionEventSet.findIndex((item:any)=>item.controlId === action.controlId && item.type === action.type && item.id === action.id);
    if(actionIndex > -1){
      this.actionEventSet.splice(actionIndex, 1);
    }
    if(action.actionSet.length > 0)
      this.actionEventSet.push(action);
  }
  showMapping(action:any, item:any){
    //this.isShowFieldPopup = true;
    this.mappingType = action.id;
    this.fieldProvider = item;
    if(this.mapperAction.type === 'select'){
      this.targetParams = [];
      this.sourceParams = [];
      this.tgtTagName = 'Element';
      this.srcTagName = 'Scope';
      let controlParentId = this.mapperAction.controlParentId;
      let controlId = item.controlId;
      let control:control;
      if(controlParentId){
        control = this.stateData.template.controls.find((item:any)=>item.id === controlParentId);
        if(control){
          if(control.type === "matTable"){
            control.controls.forEach((item:any)=>{
              let keyItem = Object.keys(item).find((key:any)=> item[key].control.id === controlId);
              if(keyItem){
                control = item[keyItem].control;
                return true;
              }
              return false;
            });
          }else
            control = control.controls.find((item:any)=>item.id === controlId);
        }        
      }else{
        control = this.stateData.template.controls.find((item:any)=>item.id === controlId);
      }
      if(control){
        this.sourceParams.push({paramName:control.name, parent:control.parent, parentType: control.parentType});
        this.targetParams = [];
        control.options.forEach((option:any)=>{
          this.targetParams.push({paramName:option.value});
        });
      }
      this.openModal('custom-modal-2');
    }else
      this.loadApiMapping(item.serviceId);
  }
  openModal(id: string) {
    this.isShowFieldPopup = true;
    this.fieldService.open(id);
  }
  popupActionEvent(event:any){
    this.closeModal('custom-modal-2');
    if(event.status === 0){    
    }else if(event.status === 1){    
      console.log(this.fieldProvider);
    }else if(event.action){
      let action = event.action;
      let currentInstance:any = this;
      currentInstance[action].apply(this, event.params);
    }
  }
  closeModal(id: string) {
      this.fieldService.close(id);
      if(this.isShowFieldPopup){
        this.isShowFieldPopup = false;      
      }      
  }
}
