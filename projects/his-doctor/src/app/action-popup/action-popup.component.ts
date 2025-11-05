import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ToastComponent } from '../toast/toast.component';
import { DeviceUtil } from '../utils/DeviceUtil';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.css']
})
export class ActionPopupComponent implements OnInit, OnDestroy {
  disableDiv:boolean = false;
  stateData:any;
  @Input()
  mappingType:any;
  @Input()
  sourceParams:any;
  @Input()
  targetParams:any;
  apiParams:any = [];
  decisionType:any;
  operatorType:string = '';
  operatorTypes: any = [
    { source: 'eq', target: '=' },
    { source: 'ne', target: '!=' },
    { source: 'gt', target: '>' },
    { source: 'lt', target: '<' },
    { source: 'ge', target: '>=' },
    { source: 'le', target: '>=' },
  ];
  decisionTypes: any = [
    { source: 'and', target: 'and' },
    { source: 'or', target: 'or' },
  ];
  @Input()
  provider:any='';
  @Output() actionEvent = new EventEmitter<any>();
  mappedParam:any = {
    decisionType: { source: '', target: '' },
    operatorType: { source: '', target: '' },
    source: {paramName : 'Search'},
    target: {paramName : 'Search'}
  };
  isModify:boolean = false;
  selectedOpr:any;
  constructor(private route: Router) {
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }
  srcTagName:string = '';
  tgtTagName:string = '';
  ngOnInit(): void {
    this.selectedOpr = this.provider.operation;
    if(this.provider.operation.mapping){
      let found = this.provider.operation.mapping.find((item:any)=>item.type === this.mappingType);
      if(found){
        this.apiParams = found.data;
        this.isPassThrough = found.isPassThrough;
      }
    }
    if(this.mappingType === 'input'){
      this.tgtTagName = 'Element';
      this.srcTagName = 'Scope';
    }else{
      this.srcTagName = 'Element';
      this.tgtTagName = 'Scope';
      
    }
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
  }
  
  getSourceElement(item:any, event:any){
    item.source = event.data;
  }
  
  getTargetFoundItem(item:any, event:any){
    item.target = item.source;
    item.target.paramValue = event.data;
  }
  getTargetElement(item:any, event:any){
    if(this.mappingType === 'input'){      
      if(!event.data.paramName){
        let data = event.data;
        event.data = {
          paramName : data,
          paramType : 'string'
        }
      }
      let tFound = this.targetParams.find((tItem:any)=>tItem.id === event.data.paramName);
      if(tFound)
        item.target = event.data;
            
    }else{
      item.target = item.source;      
    }
  }
  getTargetLabel(){
    let label = this.mappingType === 'input'?(this.mappedParam.target.paramValue?this.mappedParam.target.paramValue:this.mappedParam.target.paramName):this.mappedParam.target.paramType;
    if(!label){
      label = 'Search';
    }
    return label;
  }
  addApiMapping(){
    if(!this.provider.operation.mapping)
      this.provider.operation.mapping = [];
    let found = this.provider.operation.mapping.findIndex((item:any)=>item.type === this.mappingType);
    if(found > -1){
      this.provider.operation.mapping.splice(found, 1);      
    }
    this.provider.operation.mapping.push({type: this.mappingType, isPassThrough: this.isPassThrough, data: this.apiParams});
    this.actionEvent.emit({status: 0});
  }
  paramSrc:any;
  paramTgt:any;
  addParam(critType?:string)
  {
    let element:any;
    let scopeData:any;
    let findParams;
    if(this.mappingType === 'input'){
      scopeData = this.paramSrc;
      element = this.paramTgt;     
      findParams = this.sourceParams;      
    }else if(this.mappingType === 'output'){
      element = this.paramSrc;
      scopeData = this.paramTgt; 
      this.operatorType = '==';
      findParams = this.targetParams; 
    }    
    let foundParam = findParams.find((param:any)=>param.paramName === scopeData);
    if(!foundParam)
      foundParam = {paramName : scopeData};
    let found:any = this.apiParams.find((item:any)=>item.element === element);
    if(found){
      found.condition = this.decisionType;
      found.element = element;
      found.operator = this.operatorType;      
      found.scope = foundParam;
    }else{
      let apiElem:any = {condition: this.decisionType, element: element, operator: this.operatorType, scope: foundParam};
      if(critType)
        apiElem.critType = critType;
      this.apiParams.push(apiElem);
    }    
    this.paramSrc = '';
    this.paramTgt = '';
    this.operatorType = '';
    this.decisionType = '';
  }

  changeApiParam(event: any)
  {
    this.decisionType = event.condition;
    
    this.operatorType = event.operator;
    if(this.mappingType === 'input'){
      this.paramTgt = event.element;
      this.paramSrc = event.scope.paramName;
    }else{
      this.paramSrc = event.scope.paramName;
      this.paramTgt = event.element;
    }
  }
  onDeleteApi(event:any){
    let foundIdx:any = this.apiParams.findIndex((item:any)=>item.element === event.element);
    if(foundIdx > -1){
      this.apiParams.splice(foundIdx, 1);
    }
  }
  isPassThrough:boolean = false;
  onPassThrough(event:any){
    if(this.mappingType === 'output'){
      if(this.isPassThrough){      
        this.sourceParams.forEach((item:any)=>{
          let param:any = {
            decisionType: { source: '', target: '' },
            operatorType: { source: 'eq', target: '=' },
            source: {paramName : item.data.paramName, paramType : item.data.paramType},
            target: {paramName : item.data.paramName, paramType : item.data.paramType}
          }
          if(this.apiParams.length > 0){            
            param.decisionType = { source: 'and', target: 'and' };            
          }
          this.addParam();
        });
      }else{
        this.apiParams = [];
      }
    }
  }
  closeEditor(){
    this.actionEvent.emit({status: 0});
  }
  changeOprType(item:any){
    let found = this.operatorTypes.find((item:any)=>item.source === this.operatorType);
    if(found){
      item.operatorType = found;
    }    
  }
  changeDecType(item:any){
    let found = this.decisionTypes.find((item:any)=>item.source === this.mappedParam.decisionType.source);
    if(found){
      item.decisionType = found;
    }
  }

  isWhereParams(){
    let elements = this.apiParams.filter((item:any)=>item.critType === 'where');
    return elements.length > 0;
  }
}