import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { element } from 'protractor';
import { ToastComponent } from '../toast/toast.component';
import { DeviceUtil } from '../utils/DeviceUtil';


@Component({
  selector: 'app-field-popup',
  templateUrl: './field-popup.component.html',
  styleUrls: ['./field-popup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FieldPopupComponent implements OnInit, OnDestroy {
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
  requireAssociation:boolean = false;
  constructor(private route: Router, private toast:ToastComponent, private gateway:HttpClient, private deviceUtil:DeviceUtil) {
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    if(this.provider.operation.mapping){
      let found = this.provider.operation.mapping.find((item:any)=>item.type === this.mappingType);
      if(found){
        this.apiParams = found.data;
        this.isPassThrough = found.isPassThrough;
      }
    }
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
  }
  
  getSourceElement(item:any, event:any){
    item.source = event.data;
  }
  
  getTargetFoundItem(item:any, event:any){
    //item.target = item.source;
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
  onDeleteApi(item:any){
    let found = this.apiParams.findIndex((element:any)=>element.source.paramName === item.source.paramName);
    if(found > -1){
      this.apiParams.splice(found, 1);
    }
    this.disableDiv = false;
  }
  changeApiParam(item:any){
    this.disableDiv = true;
    let found = this.apiParams.find((element:any)=>element.source.paramName === item.source.paramName);
    if(found){
      this.mappedParam = JSON.parse(JSON.stringify(found));;
      this.operatorType = this.mappedParam.operatorType.source;
    }
  }
  addParam(item:any){
    if(item.target.paramValue){
      item.target.paramName = item.source.paramName;
    }
    let found = this.apiParams.find((element:any)=>element.source.paramName === item.source.paramName);
    if(found){
      this.onDeleteApi(found);
    }    
    this.apiParams.push(JSON.parse(JSON.stringify(item)));    
    this.mappedParam = {
      decisionType: { source: '', target: '' },
      operatorType: { source: '', target: '' },
      source: {paramName : 'Search'},
      target: {paramName : 'Search'}
    };
    this.operatorType = '';    
  }  
  isPassThrough:boolean = false;
  onPassThrough(event:any){
    if(this.isPassThrough){
      if(this.mappingType === 'output'){
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
            this.addParam(param);
          });        
      }else{
        /*this.sourceParams.forEach((item:any)=>{
          let param:any = {
            decisionType: { source: '', target: '' },
            operatorType: { source: 'eq', target: '=' },
            source: {paramName : item.data.paramName, paramType : item.data.paramType},
            target: {paramName : item.data.paramName, paramType : item.data.paramType}
          }
          if(this.apiParams.length > 0){            
            param.decisionType = { source: 'and', target: 'and' };            
          }
          this.addParam(param);
        });*/
      }
    }else{
      this.apiParams = [];
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
}
