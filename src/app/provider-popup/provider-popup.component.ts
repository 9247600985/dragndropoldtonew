import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';

@Component({
  selector: 'app-provider-popup',
  templateUrl: './provider-popup.component.html',
  styleUrls: ['./provider-popup.component.scss']
})
export class ProviderPopupComponent implements OnInit {
  componentData:any={
    id: '',
    class:''
  };
  newComponentId:string = '';
  newComponentClass:any = '';
  isConfigParamNameTag:boolean = false;
  aConfigParamName:any = '';
  aConfigParamValue:any = '';
  aConfigParams:any = [];
  @Input()
  providers:any = [];
  @Input()
  componentIds:any = [];
  @Output() actionEvent = new EventEmitter<any>();
  constructor(private gateway:HttpClient, private deviceUtil:DeviceUtil) { }

  ngOnInit() {
  }
  closeEditor(){
    this.actionEvent.emit({status: 0});
  }
  addConfigParam(){
    this.isConfigParamNameTag  = false;
    if(!this.aConfigParamName || this.aConfigParamName.trim().length == 0)
      return;
    let found:any = this.aConfigParams.find((item:any)=>item.paramName === this.aConfigParamName);
    if(found){
      found.paramValue = this.aConfigParamValue;
    }else{
      this.aConfigParams.push({paramName: this.aConfigParamName, paramValue: this.aConfigParamValue});
    }
    this.aConfigParamName = '';
    this.aConfigParamValue = '';
  }
  onSelectConfig(param:any){
    this.isConfigParamNameTag  = true;
    this.aConfigParamName = param.paramName;
    this.aConfigParamValue = param.paramValue;
  }
  onDeleteConfig(param:any){
    this.isConfigParamNameTag  = false;
    let found = this.aConfigParams.findIndex((item:any)=>item.paramName === param.paramName);
    if(found > -1){
      this.aConfigParams.splice(found, 1);
    }
    this.aConfigParamName = '';
    this.aConfigParamValue = '';
  }
  addApiMapping(){}
  onProviderChange(){
    if(this.componentData.class === '' || this.componentData.class === 'createProv'){
      this.newComponentClass = '';
      this.newComponentId = '';
      this.newComponentId = '';
      this.aConfigParams = [];
      return;
    }
      this.componentIds = [];
      let filter = new Filter(Expr.eq('class', this.componentData.class));
      this.gateway.get<any>("/api/v1/component"+filter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'})).subscribe((result:any)=>{
        this.aConfigParams = [];
        if(result.status === 0 && result.results.length > 0){
          result.results.forEach((item:any)=>{
            this.componentIds.push(item);
          });
          this.selectedProv = result.results[0].id;
          this.onProviderIdChange();
        }
      });
  }
  selectedProv:any = '';
  onProviderIdChange(){
    this.isConfigParamNameTag  = false;
    this.aConfigParamName = '';
    this.aConfigParamValue = '';
    if(this.selectedProv === ''){
      return;
    }
    this.aConfigParams = [];
    if(this.selectedProv === 'createProvId'){
      this.newComponentId = '';
      return;
    }
    let found:any = this.componentIds.find((item:any)=> item.id === this.selectedProv);
    if(found){    
      this.componentData = found;  
        if(found.config){
          for(let [key,value] of Object.entries(found.config)){
            if(typeof value !== 'string')
              this.aConfigParams.push({paramName: key, paramValue: JSON.stringify(value)});
            else
              this.aConfigParams.push({paramName: key, paramValue: value});
          }
        }
    }
    
  }
  addProvider(){
    this.addComponentData();
  }
  addComponentData(){
    if(this.componentData.class !== '' && this.componentData.class !== 'createProv'){
      this.newComponentClass = this.componentData.class;
    }
    if(this.newComponentId === '' && this.componentData.id !== 'createProvId' && this.componentData.id !== '')
      this.newComponentId = this.componentData.id;    
    if(this.aConfigParams.length > 0 && !this.componentData.config)
      this.componentData.config = {};
    this.aConfigParams.forEach((item:any)=>{
      if(item.paramValue.startsWith("{") || item.paramValue.startsWith("["))
        this.componentData.config[item.paramName] = JSON.parse(item.paramValue);
      else
        this.componentData.config[item.paramName] = item.paramValue;
    }); 
    let providerData:any = {};
    let found = this.componentIds.find((item:any)=>(item.class === this.newComponentClass && item.id === this.newComponentId));
    if(found){
      providerData = found;
      if(providerData['__name__'])
        providerData.rowId = providerData['__name__'];
      else
        providerData.rowId = found.rowId;
      this.updateProviderData(providerData);
      this.modifyComponent(providerData);
    }else{
      providerData.class = this.newComponentClass;
      this.updateProviderData(providerData);
      this.addComponent(providerData);
    }
   
  }
  updateProviderData(providerData:any){
    if(this.componentData.class === 'createProv'){
      providerData.class = this.newComponentClass;
      providerData.id = this.newComponentId;
    }else if(this.componentData.id === 'createProvId' || !providerData.id){
      providerData.id = this.newComponentId;
    }
    providerData.config = this.componentData.config; 
  }
  modifyComponent(providerData:any){
    this.actionEvent.emit({action: 'modifyComponent', params: [providerData]});
  }
  addComponent(providerData:any){
    this.actionEvent.emit({action: 'addComponent', params: [providerData]});
  }
  removeProvider(){
    this.actionEvent.emit({action: 'delComponent', params: [this.componentData]});    
  }
}
