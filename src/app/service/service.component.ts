import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Inserter } from '../utils/inserter';
import { Updater } from '../utils/updater';
import { forkJoin, Observable } from 'rxjs';
import { DialogPopupService } from '../dialog-popup/dialog-popup.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  operatorTypes: any = [
    { source: 'eq', target: '=' },
    { source: 'ne', target: '!=' },
    { source: 'gt', target: '>' },
    { source: 'lt', target: '<' },
    { source: 'ge', target: '>=' },
    { source: 'le', target: '>=' },
  ];

  conditionTypes: any = [
    { source: 'and', target: 'and' },
    { source: 'or', target: 'or' },
  ];
  DBTablesAutoComplete: any[] = [];
  operationList: any[] = [];
  syncServices: any[] = [];
  httpType: any = [
    {id:{source: 'GET', target: 'get'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'POST', target: 'post'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'PUT', target: 'put'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'DELETE', target: 'delete'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'PATCH', target: 'patch'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'CUSTOM', target: 'custom'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},
    {id:{source: 'ALL', target: 'all'}, securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }},    
  ];
  services: any = [];
  components: any = [];
  endpoints:any = [];
  securityLevel: any = {source: 'public', target: 'public'}
  securityLevels: any = [{source: 'public', target: 'public'},
  {source: 'authenticated', target: 'authenticated'}]
  endPointTarget: any = [
    {id: 'database', value: 'database'},
    {id: 'Service', value: 'Service'},
  ];
  
  endPointType: any = [
    {id: 'mssql', value: 'mssql'},
    {id: 'mysql', value: 'mysql'},
  ];
  defaultModel: any = {
    id: {
      source: '',
      target: {tag:''},
    },
    endpoint: {
      source: '',
      target: ''
    },
    operations:[]
  };
  model: any = this.defaultModel;

  defaultOpr:any = {
    id:{source:'', target:''},
    securityLevel: {source:'', target:''},
    input:{
      isPassthrough: false,
      params:[]
    },
    output:{
      isPassthrough: false,
      params:[]
    }
  };
  operation:any = this.defaultOpr;
  outputParams:any[];
  inputParams:any[];
  stateData:any;
  serviceData:any = [];
  btnText:string = 'Save';
  btnDel:string = 'Delete';
  defaultParam:any = {source:'', target: '', translator: ''};
  currentOparam:any = this.defaultParam;
  currentIparam:any= this.defaultParam;
  serviceTarget:any = '';
  serviceTargetBody:any;
  ipPassThrough:boolean = false;
  opPassThrough:boolean = false;
  currentOpr:string = '';
  isNewService:boolean = true;
  serviceIndex:number = -1;
  outParamIcon:string = 'fa-plus'
  createServiceIcon = 'fa-times';
  currentOparamTarget:string = '';
  newServiceId:string;
  dbTables:any = [];
  dbTblColumns:any = [];
  isShowPopup:boolean = false;
  componentData:any = {"class": '', "id": ''};
  providers:any = [];
  aConfigParamName:string;
  aConfigParamValue:string;
  aConfigParams:any = [];
  tableColumns:any = [];
  translators:any = [];
  serviceSourceId:string;
  callerId:string;
  isShowAlert:boolean = false;
  isShowInputs:boolean = false;
  isShowOutputs:boolean = false;
  componentIds:any = [];
  newComponentId:string;
  newComponentClass:string;
  requireMembers:boolean = false;
  isConfigParamNameTag:boolean = false;
  serviceElements:any = [];
  serviceElement:string = '';
  serviceElementTypes:any = [{source:'string', target:'varchar'}, {source:'number', target:'int'}, {source:'object', target:'object'},{source:'array', target:'array'}, {source:'date', target:'date'}, {source:'datetime', target:'datetime'}, {source:'rowId', target:'rowId'}, {source:'header', target:'header'}];
  serviceElementType:string = '';
  translator:string='';
  isRequireParams:boolean = false;
  serviceElementTag:boolean = false;
  isShowFieldPopup:boolean = false;
  isShowPopup1:boolean = false;
  isRequireAllOprs:boolean = false;
  orchType:string = '';
  mappingActions:any = [{id: 'input', desc: 'Input', icon: 'fa-level-up-alt'}, {id: 'output', desc: 'Output', icon: 'fa-level-up-alt'}];
  mappingType:string = '';
  apiParams:any = [];
  sourceParams:any = [];
  targetParams:any = [];
  fieldProvider:any;
  syncActionTypes:any = ['condition', 'service'];
  syncActionType:string = '';
  isOrchService:boolean;
  constructor(private route: Router, private gateway:HttpClient, private deviceUtil:DeviceUtil, private fieldService: DialogPopupService) { 
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    if (!this.stateData){
      this.route.navigate(['/login']);
      return;
    }    
   this.loadServicePage();   
  }

  loadServicePage(){
    this.newComponentId = '';
   this.currentOpr = '';
   this.operation = this.defaultOpr;
   this.model = this.defaultModel;
    this.loadServices();
    this.loadProviders();
    this.loadComponents();    
    this.serviceSourceId = 'createSvc';
    this.onChangeService();
  }
  serviceList:any = [];
  lblServiceSource:string = '';
  loadServices(){
    this.serviceData = [];
    this.serviceList = [{
      id: 'createSvc',
      name: 'Create Service',
      data: {}
    },{
      id: 'createViewSvc',
      name: 'Create View Service',
      data: {}
    }];
    this.gateway.get<any>('/api/v1/services?select=', this.deviceUtil.getJsonHeaders({'isAdminService': 'true'})).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.serviceData = this.serviceData.concat(result.results);       
      }
      this.serviceData.forEach((svc:any)=>{
        this.serviceList.push({
          id: svc.id.source,
          name: svc.id.source,
          data: svc
        });
      });
    });
  }
  loadProviders(){
    this.providers = [];
    this.gateway.get<any>('/api/v1/services?select=providers', this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        result.results.forEach((item:any)=>{
          this.providers.push(item);
        });
      }
    });
  }
  loadComponents(){
    //this.providers = [];
    this.model.endpoint.target = 'chooseTarget';
    this.components = [];
    this.gateway.get<any>('/api/v1/services?select=components', this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        result.results.forEach((item:any)=>{
          /*let foundPr = this.providers.find((comp:any)=>comp.class === item.class);
          if(!foundPr){
            this.providers.push(item);
          }*/          
          //let found = this.components.find((comp:any)=>comp.class === item.class);
          /*if(!found){
            this.providers.push(item);
          }*/
          if(item.id){
            this.components.push(item);
          }          
          this.loadMembers(item);          
        });
        this.componentIds = this.components.filter((item:any)=>item.class === this.newComponentClass);
      }
    });
  }
  onOutputParamSelect(event: any, outputparamSrc:any, outputparamTgt:any)
  {
    this.currentOparam.source = event.source;
    this.currentOparam.target = event.target;
    outputparamSrc.disabled = true;
  }
  onInputParamSelect(event: any)
  {
    this.currentIparam.source = event.source;
    this.currentIparam.target = event.target;
  }
  onChangeOpr(event: any){
    if(this.currentOpr === 'ALL' ){

    }else{    
      let operation = this.model.operations.find((item:any)=>item.id.source.toUpperCase() === this.currentOpr.toUpperCase());
      if(!operation){
        this.callerId = this.currentOpr;
        this.deviceUtil.showAlert(this.currentOpr, 'Operation not exists. Do you want to create?', this.doAlertAction.bind(this));
        //this.isShowAlert = true;
      }else{
        this.operation = operation;
      }
    }
    if(this.operation.providers){
      this.syncServices = [];
      this.operation.providers.forEach((item:any)=>{
        this.syncServices.push(item);
      });
    }
  }
  doAlertAction(event:any){
    this.isShowAlert = false;
    if(event.value === 1){
      this.operation = this.defaultOpr;  
      let found = this.httpType.find((item:any)=>item.id.source === this.currentOpr);      
      this.operation = found;
      if(this.isOrchService === true){
        this.orchType = '';
        this.syncServices = [];      
      }
    }else{      
      this.currentOpr = this.operation.id.source;
    }
  }
  getServiceGrpLabel(){
    let found = this.serviceData.find((item:any)=>item.id.source === this.serviceSourceId);
    if(found){
      return found.name;
    }
  }
  onChangeGrpService(event:any){
    let found = this.serviceData.find((item:any)=>item.id.source === event.id);
    if(found){
      this.serviceSourceId = found.id.source;      
    }else{
      this.serviceSourceId = event.id;
      if(event.id !== 'createSvc' && event.id !== 'createViewSvc'){
        this.deviceUtil.showToast(event.id+ ' Not exists in the Service List. Need to be created', false);
        this.serviceSourceId = 'createSvc';//event.id;
      }
    }
    this.onChangeService();
  }
  onChangeService(){
    this.isOrchService = false;
    this.model = JSON.parse(JSON.stringify(this.defaultModel));
    this.operation = JSON.parse(JSON.stringify(this.defaultOpr));
    this.isRequireParams = false;
    this.requireMembers = false;
    this.serviceElements = [];
    this.syncServices = [];
    this.serviceTarget = '';
    this.model.endpoint.target = 'chooseTarget';
    this.model.endpoint.source = '';
    this.operation.id = {source: '', target: ''};
    this.operation.securityLevel = {source: '', target: ''};
    this.serviceTargetBody = '';
    this.newServiceId = '';
    this.currentOpr = '';   
    this.orchType = ''; 
    this.targetParams = [];
    this.addColumnParam();
    if(this.serviceSourceId !== 'createSvc' && this.serviceSourceId !== 'createViewSvc'){
        this.fetchAllOperations(this.serviceSourceId).subscribe((result:any)=>{
          if(result.status === 0 && result.results.length > 0){
            let service = result.results[0];
            this.model.id = { source: service.id.source, target:service.id.target};
            this.model.endpoint = { source: service.endpoint.source, target:service.endpoint.target};
            this.model.operations = [];
            this.model.operations = service.operations;
            this.model.endpoint.target = service.endpoint.target;
            this.model.endpoint.source = service.endpoint.source;
            let endpoint = this.components.find((item:any)=>item.id === this.model.endpoint.target);
            if(endpoint && endpoint.config && endpoint.config.members){
              this.dbTables = endpoint.config.members.tables;
            }
            if(typeof service.id.target !== 'string'){
              this.serviceTarget = service.id.target.tag;
              this.serviceTargetBody = service.id.target.body;
              if(service.id.target.body === 'string'){
                this.orchType = this.serviceTarget;
                this.serviceTarget = '';
                this.syncServices = [];
                service.id.target.body.forEach((item:any)=>{
                  this.syncServices.push(item);
                });                                
              }
            }else{
              if(service.id.target !== 'custom'){
                this.serviceTargetBody = undefined;
                this.serviceTarget = service.id.target;
              }else{
                this.loadMembers();
              }
            }
            if(service.operations && service.operations.length > 0){
              let opr = service.operations[0];                        
              this.operation.id = {source: opr.id.source, target: opr.id.target, type: opr.id.type};
              this.currentOpr = this.operation.id.source;
              if(opr.securityLevel)
                this.operation.securityLevel = {source: opr.securityLevel.source, target: opr.securityLevel.target};
              this.operation.input = opr.input;
              this.operation.output = opr.output;
              
              if(service.id.target === 'custom'){
                this.orchType = opr.id.type;
                this.operation.id.type = this.orchType;
                this.operation.providers = opr.providers;
                this.syncServices = [];
                this.operation.providers.forEach((item:any)=>{
                  this.syncServices.push(item);
                });
              }
            }
            this.isRequireParams = service.elements.length > 0;
            this.serviceElements = service.elements;
            let found = this.components.find((item:any)=>item.id === this.model.endpoint.target);
            if(found && found.class === "cloud-orch"){
              this.isOrchService = true;
           // if(this.model.endpoint.target === 'orch-service'){
              this.serviceData.forEach((item: any) => {
                this.DBTablesAutoComplete.push({
                  id: item.id.source,
                  name: item.id.source,
                  data: item
                });
              });
              this.httpType.forEach((item:any)=>{
                this.operationList.push({
                  id: item.id.source,
                  name: item.id.source,
                  data: item
                });              
              });
              
            }
          }
        });
    }
  }
  fetchAllOperations(serviceId:string){
    return this.gateway.get<any>('/api/v1/services?select=&filter='+serviceId, this.deviceUtil.getJsonHeaders({'isAdminService': 'true'}));
  }
  getAllOperations(serviceId:string){
    this.gateway.get<any>('/api/v1/services?select=&filter='+serviceId, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
         if(result.status === 0 && result.results.length > 0){
          let service = result.results[0];
          this.model.operations = [];
          service.operations.forEach((opr:any)=>{
            if(!opr.input)
              opr.input = {
                isPassthrough : true
              };
            if(!opr.output)
              opr.output = {
                isPassthrough : true
              };
            this.model.operations.push(opr);
          });
          this.operation = this.model.operations[0];
          if(service.elements){
            this.serviceElements = service.elements;
            this.isRequireParams = service.isRequireParams;
          }          
          this.addSecurityLevel(this.operation.securityLevel);
         }
        });
  }
  clearModel(source:any, target:string){
    this.model = {
      id: {
        source: source,
        target: target,
      },
      index:-1,
      endpoint: {
        source: '',
        target: ''
      },
      operations:this.httpType
    };
    return this.model;
  }
  clearOperation(){
    this.operation = {
      id:{source:'', target:''},
      securityLevel: {source:'', target:''},
      input:{
        input:{
          isPassthrough: false
        },
        output:{
          isPassthrough: false
        }
      },
      output:{}
    };
  }
  clearSecurityLevel(){
    this.operation.securityLevel = [{source: 'public', target: 'public'},
        {source: 'authenticated', target: 'authenticated'}]
    this.securityLevel = {source: '', target: ''};
  }
  addSecurityLevel(securityLevel:any){
    if(!securityLevel)
      return;
    this.operation.securityLevel.source = securityLevel.source;
    this.operation.securityLevel.target = securityLevel.target;    
    this.securityLevel.source = securityLevel.source;
    this.securityLevel.target = securityLevel.target;  
  }
  delService(service:any){
    return new Observable<any>(observer => { 
      let filter = new Filter(Expr.eq('id/source', service.id.source));
      this.gateway.delete<any>('/api/v1/service'+filter.get(), this.deviceUtil.getJsonHeaders({'isAdminService': 'true'})).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Service Deleted.", false);
          observer.next();
          observer.complete();
        }
      }, ()=>{
        this.deviceUtil.showToast("Service Removal failed.", true);
        observer.error();
      }); 
    });   
  }
  addService(service:any){
    return new Observable<any>(observer => { 
      let inserter = new Inserter(service);
      this.gateway.post<any>('/api/v1/service', inserter.get(), this.deviceUtil.getJsonHeaders({'isAdminService': 'true'})).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Service Added.");
          observer.next();
          observer.complete();
        }
      }, ()=>{
        this.deviceUtil.showToast("Service add failed.", true);
        observer.error();
      }); 
    });    
  }

  addUpdateService(){
    if(this.serviceSourceId !== 'createSvc' && this.serviceSourceId !== 'createViewSvc'){
      this.model.id.source = this.serviceSourceId;
    }else{
      if(this.newServiceId !== ''){
        this.model.id.source = this.newServiceId;
      }
    }
    if(this.syncServices.length>0){
      this.model.id.target = 'custom';
    }else{
      if(this.serviceTarget !== ''){
        this.model.id.target = this.serviceTarget;
        if(this.serviceTargetBody && this.serviceTargetBody != ''){
          this.model.id.target = { tag: this.serviceTarget, body: this.serviceTargetBody};
        }
      }
    }
    this.model.isRequireParams = this.isRequireParams;
    let foundSvc = this.serviceData.find((item:any)=>item.id.source === this.model.id.source);
    if(foundSvc){
      foundSvc.endpoint = this.model.endpoint;
      foundSvc.id.target = this.model.id.target;
    }else{
      foundSvc = {id: this.model.id, endpoint: this.model.endpoint, operations: []};      
    }
    foundSvc.elements = this.serviceElements;
    foundSvc.operations = this.model.operations;
    let foundOpr = foundSvc.operations.find((opr:any)=>opr.id.source === this.operation.id.source);
    if(foundOpr){
      foundOpr.id = this.operation.id;
      foundOpr.securityLevel = this.operation.securityLevel;
      foundOpr.input = this.operation.input;
      foundOpr.output = this.operation.output;
      if(this.model.id.target === 'custom'){
        foundOpr.id.type = this.orchType;
        foundOpr.providers = this.syncServices;
      }
    }else{
     if(this.model.id.target === 'custom'){
      this.operation.id.type = this.orchType;
      this.operation.providers = this.syncServices;
    }
      foundSvc.operations.push(this.operation);
    }
    console.log(foundSvc);
    this.delService(foundSvc).subscribe(()=>{
      this.addService(foundSvc).subscribe(()=>{
        this.serviceElements = [];
        this.loadServicePage();
      });
    });
  }
  removeService(){
    let foundSvc = this.serviceData.find((item:any)=>item.id.source === this.model.id.source);
    this.delService(foundSvc).subscribe(()=>{
      this.loadServicePage();     
    });
  }
  delContextService(service:any){    
    this.gateway.delete<any>('/api/v1/service?select=&filter='+service.id.source, this.deviceUtil.getJsonHeaders({'isAdminService': 'true'})).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.deviceUtil.showToast("Service Deleted.");
        this.loadServicePage();
      }
    }, ()=>{
      this.deviceUtil.showToast("Service Removal failed.", true);
    });
  }
  onSubmitForm(event: Event, commandId:number)
  {    
    this.model.isRequireParams = this.isRequireParams;
    if(commandId<2 && this.btnText === 'Save' && !this.isNewService){
      let foundOpr = this.model.operations.find((opr:any)=>opr.id.source === this.operation.id.source);
      if(foundOpr){
        foundOpr.id = this.operation.id;
        foundOpr.securityLevel = this.securityLevel;
        foundOpr.input = this.operation.input;
        foundOpr.output = this.operation.output;
        this.model.elements = this.serviceElements;        
      }
      this.gateway.put<any>('/api/v1/service', this.model, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Service Updated.");
          this.loadServicePage();
        }
      }, ()=>{
        this.deviceUtil.showToast("Service Update failed.", true);
      });    
    }else if(this.isNewService){
      this.model.id.source = this.newServiceId;
      if(this.serviceTargetBody){
        this.model.id.target = {tag: this.serviceTarget, body:this.serviceTargetBody};
      }else{
        this.model.id.target = this.serviceTarget;
      }    
      this.operation.id.source = this.currentOpr;
      this.operation.securityLevel = this.securityLevel;
      this.model.elements = this.serviceElements;
      this.model.operations = [this.operation];     
      console.log(this.model);
      this.gateway.post<any>('/api/v1/service', this.model, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Service Created");
          this.loadServicePage();
        }
      }, ()=>{
        this.deviceUtil.showToast("Service Creation failed.", true);
      }); 
    }else if(commandId === 2){
      this.model.isDeleted = true;
      this.gateway.put<any>('/api/v1/service', this.model, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Service Removed.");
          this.loadServicePage();
        }
      }, ()=>{
        this.deviceUtil.showToast("Service Removal failed.", true);
      }); 
    }
  }
  isDisplayBtn(){
    return this.btnText === 'Save';
  }
  getOperationTarget(event:any){
    if(typeof event === 'string')
      return event;
    return event.tag;
  }
  onOutParamChange(event:any){
    if(this.outParamIcon === 'fa-plus')
      this.outParamIcon = 'fa-check';
  }
  onOutParamComplete(event:any){
  }
  createOrUpdateService(event:any){
    if(this.createServiceIcon === 'fa-plus'){
      this.createService();
      this.createServiceIcon = 'fa-times';
    }else if(this.createServiceIcon === 'fa-times'){
      this.createServiceIcon = 'fa-plus';
    }
  }
  createService(){
    this.clearModel('', '');
    this.serviceTarget = '';
    this.model.endpoint.target = 'chooseTarget';
    this.clearOperation();
    this.clearSecurityLevel();
  }
  changeEndpointTarget(){
    this.isOrchService = false;
    this.requireMembers = false;
    this.serviceTarget = '';
    this.newComponentId = '';
    this.newComponentClass = '';
    this.componentIds = [];
    this.syncServices = [];
    this.dbTables = [];
    this.DBTablesAutoComplete = [];
    if(this.model.endpoint.target === 'chooseTarget'){
      return;
    }
    if(this.model.endpoint.target === 'createTarget'){      
      this.isShowPopup = true;    
      this.openModal('custom-modal-2');   
    }else{
      this.loadMembers();
    }
    let found = this.components.find((item:any)=>item.id === this.model.endpoint.target);
    if(found && found.class === "cloud-orch"){
      this.isOrchService = true;
      this.serviceData.forEach((item: any) => {
        this.DBTablesAutoComplete.push({
          id: item.id.source,
          name: item.id.source,
          data: item
        });
      });
      this.httpType.forEach((item:any)=>{
        this.operationList.push({
          id: item.id.source,
          name: item.id.source,
          data: item
        });              
      });
    }
  }
  loadMembers(found?:any){
    let members:any;
    this.dbTables = [];
    if(!found)
      found = this.components.find((item:any)=>item.id === this.model.endpoint.target); 
    if(found && found.config && found.config.members){
      members = found.config.members;
      if(members.tables && members.tables.length > 0){
        this.dbTables = members.tables;
        return
      }
        members.tables = [];
        let url = '/api/v1/';
        if(found.config){          
            url += found.id+'_table';          
          if(found.config.tableSQL){
            url += '?filter='+found.config.tableSQL;
          }
        }
      this.gateway.get<any>(url, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.requireMembers = true;          
          result.results.forEach((item:any)=>{
            members.tables.push({id: item.tableName, name: item.tableName, data:item});
          });
        }
      });
    } 
  }
  getMembers(){
    let memberConfig = this.components.find((item:any)=>item.id === this.model.endpoint.target);
    this.requireMembers = memberConfig && memberConfig.config && memberConfig.config.members;
    if(!this.requireMembers)
      return;
    let members = memberConfig.config.members;
    if(members.endpoint){
      this.dbTables = [];
      if(!members.tables)
        members.tables = [];
      if(members.tables.length > 0){        
        this.dbTables = members.tables;
        return;      
      }
      this.gateway.get<any>(members.endpoint, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          result.results.forEach((item:any)=>{
            this.dbTables.push(item.tableName.toUpperCase());
            members.tables.push(item.tableName.toUpperCase());
          });
        }
      });
    }else if(members === true){
      this.serviceData.forEach((item:any)=>{
        this.dbTables.push(item.id.source);
      });
    }
  }
  clearPopup(){
    this.aConfigParamName = '';
    this.aConfigParamValue = '';
    this.componentData = {"class": '', "id": ''};
    this.aConfigParams = [];
  }
  mergeUnique(arr1:any, arr2:any){
    return arr1.concat(arr2.filter((item:any)=>{
        return arr1.indexOf(item) === -1;
    }));
  }
  closePopup(){
    this.model.endpoint.target = 'chooseTarget';
    this.isShowPopup = false;
    this.clearPopup();
  }
  addProviderClass(){
    if(this.newComponentClass === '')
      return;
    let providerData:any = {};
    let found = this.providers.find((item:any)=>item.class === this.newComponentClass);
    if(found){
      providerData = found;
      providerData.id = this.newComponentId;
    }else{
      providerData.class = this.newComponentClass;
      providerData.id = this.newComponentId;
    }
    let inserter = new Inserter(providerData);
    this.gateway.post<any>('/api/v1/component', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.deviceUtil.showToast("Provider Added.");
        this.componentData.class = providerData.class;
        this.loadComponents();
      }
    });
  }
  addProvider(){
    this.addComponentData();
  }
  updateProviderData(providerData:any){
    if(this.componentData.class === 'createProv'){
      providerData.class = this.newComponentClass;
      providerData.id = this.newComponentId;
    }else if(this.componentData.id === 'createProvId'){
      providerData.id = this.newComponentId;
    }
    providerData.config = this.componentData.config; 
  }
  getService(dbRef:string, config:any, type:string){
    let params:any = [];
    let systemTable:string = config['systemtable']+'.'+type;
    let source = '/tables';
    if(systemTable.endsWith('TABLES')){
      source = dbRef+'_table';
      params = [{
        "source": "TABLE_NAME",
        "target": "tableName"
      }];
    }else{
      source = dbRef+'_columns';
      params = [{
        "source": "COLUMN_NAME",
        "target": "name"
      },{
        "source": "DATA_TYPE",
        "target": "type"
      },{
        "source": "TABLE_CATALOG",
        "target": "instanceId"
      }];
    }
    return {
      "doNotExpose":true,
      "endpoint" : {
        "source" : '/api/v1',
        "target" : dbRef
      },
      "id" : {
        "source" : source,
        "target" : systemTable
      },
      "operations" : [ {
        "id" : {
          "source" : "GET",
          "target" : "get"
        },
        "input" : {
          "isPassthrough" : true
        },
        "output" : {
          "params":params
        },
        "securityLevel" : {
          "source" : "public",
          "target" : "authenticated"
        }
      }]
  };
  }
  getDelMemberServices(providerData:any){
    let members = [];
    if(providerData.config && providerData.config['systemtable']){
      let tblFilter = new Filter(Expr.eq('id/target', providerData.config['systemtable']+'.TABLES'));
      tblFilter.and(Expr.eq('endpoint/target', providerData.id));        
      let tblSvcRef = this.gateway.delete<any>('/api/v1/service'+tblFilter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'}));
      members.push(tblSvcRef);

      let colFilter = new Filter(Expr.eq('id/target', providerData.config['systemtable']+'.COLUMNS'));
      colFilter.and(Expr.eq('endpoint/target', providerData.id));    
      let colSvcRef = this.gateway.delete<any>('/api/v1/service'+colFilter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'}));  
      members.push(colSvcRef); 
    }
    return members;
  }
  getAddMemberServices(providerData:any){
    let members = [];
    if(providerData.config && providerData.config['systemtable']){
      let tableService:any = this.getService(providerData.id, providerData.config, 'TABLES');
      providerData.config.members = {isMembers : true};
      let tblInserter = new Inserter(tableService);
      let tblSvcRef = this.gateway.post<any>('/api/v1/service', tblInserter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'}));
      members.push(tblSvcRef);
      let columnService:any = this.getService(providerData.id, providerData.config, 'COLUMNS');
      providerData.config.members = {isMembers : true};
      let colInserter = new Inserter(columnService);      
      let colSvcRef = this.gateway.post<any>('/api/v1/service', colInserter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'}));
      members.push(colSvcRef); 
    }
    return members;
  }
  fireServices(members:any){
    return new Observable<any>(observer => {       
      if(members.length > 0){
        forkJoin(members).subscribe(results => {
          observer.next();
          observer.complete();
        });        
    }else{
      observer.next();
      observer.complete();
    }
  });
  }  
  modifyServices(providerData:any){
    return new Observable<any>(observer => { 
      let delMembers = this.getDelMemberServices(providerData);      
        if(delMembers.length > 0){ 
          this.fireServices(delMembers).subscribe(()=>{
            let addMembers = this.getAddMemberServices(providerData);
            if(addMembers.length > 0){
              this.fireServices(addMembers).subscribe(()=>{
                if(providerData.config && providerData.config['systemtable']){
                  observer.next();
                }else{
                  observer.next();
                }
                observer.complete();
              });
            } 
          });
      }else{
        observer.next();
        observer.complete();
      }
    });
  }
  delComponent(providerData:any){
    let delMembers = this.getDelMemberServices(providerData);      
    if(delMembers.length > 0){
      this.fireServices(delMembers).subscribe(()=>{
           this.removeComp(providerData);
      })
    }else{
      this.removeComp(providerData);
    } 
  }
  private removeComp(providerData:any){
    let filter = new Filter(Expr.eq('id', providerData.id));
    this.gateway.delete<any>('/api/v1/component'+filter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'})).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.deviceUtil.showToast("Provider Removed.");
        this.componentData.class = providerData.class;
        this.loadComponents();
        this.clearPopup();
        this.isShowPopup = false;
      }
    }, ()=>{
      this.deviceUtil.showToast("Component addition failed.", true);
      this.clearPopup();
      this.isShowPopup = false;
    }); 
  }
  addComponent(providerData:any){    
    this.modifyServices(providerData).subscribe((members:any)=>{
      if(members && Object.keys(members).length > 0){
        providerData.config.members = members;
      }
      let inserter = new Inserter(providerData);
      this.gateway.post<any>('/api/v1/component', inserter.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'})).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.deviceUtil.showToast("Provider Added.");
          this.componentData.class = providerData.class;
          this.loadComponents();
          this.clearPopup();
          this.isShowPopup = false;
        }
      }, ()=>{
        this.deviceUtil.showToast("Component addition failed.", true);
        this.clearPopup();
        this.isShowPopup = false;
      });
    });
  }
  modifyComponent(providerData:any){
    this.modifyServices(providerData).subscribe((members:any)=>{
      let rowId = providerData.rowId;
      delete providerData.rowId;
      delete providerData.__name__;
      if(members){
        providerData.config.members = members;
      }
      let updater = new Updater(providerData);
      updater.addFilter(new Filter(Expr.eq('rowId', rowId)));
      this.gateway.put<any>('/api/v1/component', updater.get(), this.deviceUtil.getJsonHeaders({'isadminservice': 'true'})).subscribe((result:any)=>{   
        if(result.status === 0){
          this.loadComponents();
          this.deviceUtil.showToast("Component Updated.");
          this.clearPopup();
          this.isShowPopup = false;
        }
      }, ()=>{
        this.deviceUtil.showToast("Component Update failed.", true);
        this.clearPopup();
        this.isShowPopup = false;
      });
    });
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
    let found = this.providers.find((item:any)=>(item.class === this.newComponentClass && item.id === this.newComponentId));
    if(found){
      providerData = found;
      this.updateProviderData(providerData);
      this.modifyComponent(providerData);
    }else{
      providerData.class = this.newComponentClass;
      this.updateProviderData(providerData);
      this.addComponent(providerData);
    } 
  }
  addProviderData(){
    if(this.componentData.class === '')
      return;
    let found = this.providers.find((item:any)=>item.rowId === this.componentData.rowId);
    if(found){
      if(this.newComponentId)
        this.componentData.id = this.newComponentId;
      if(this.aConfigParams.length > 0 && !this.componentData.config)
      this.componentData.config = {};
      this.aConfigParams.forEach((item:any)=>{
        if(item.paramValue.startsWith("{") || item.paramValue.startsWith("["))
          this.componentData.config[item.paramName] = JSON.parse(item.paramValue);
        else
          this.componentData.config[item.paramName] = item.paramValue;
      });
      let rowId = this.componentData.rowId;
      delete this.componentData.rowId;
      let updater = new Updater(this.componentData);
      updater.addFilter(new Filter(Expr.eq('rowId', rowId)));
      this.gateway.put<any>('/api/v1/component', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{   
        if(result.status === 0 && result.results.length > 0){
          this.loadComponents();
          this.deviceUtil.showToast("Component Updated.");
        }
      }, ()=>{
        this.deviceUtil.showToast("Component Update failed.", true);
      });             
    }
  }
  addConfigParam(){
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
  onProviderChange(){
    if(this.componentData.class === 'createProv'){
      this.newComponentClass = '';
      this.newComponentId = '';
      return;
    }
      
      let data = this.providers.filter((item:any)=>item.class == this.componentData.class);
      if(data){
        if(Array.isArray(data)){
          this.componentIds = data;
        }else{
          this.newComponentId = data.id;
        }        
      }
      
      console.log(data);
      let filter = new Filter(Expr.eq('class', this.componentData.class));
      this.gateway.get<any>("/api/v1/component"+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        this.aConfigParams = [];
        if(result.status === 0 && result.results.length > 0){
          this.componentData = result.results[0];
          if(this.componentData.config){
            for(let [key,value] of Object.entries(this.componentData.config)){
              if(typeof value !== 'string')
                this.aConfigParams.push({paramName: key, paramValue: JSON.stringify(value)});
              else
                this.aConfigParams.push({paramName: key, paramValue: value});
            }
          }
        }
      });
  }
  onProviderChange2(){
    if(this.componentData.class === 'createProv')
      return;
    this.loadComponentsByClass();
    this.gateway.get<any>("/api/v1/services?select=components&filter="+this.componentData.class, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      this.componentData.id = '';
      this.aConfigParams = [];
      if(result.status === 0 && result.results.length > 0){
        this.componentData = result.results[0];
        if(this.componentData.config){
          for(let [key,value] of Object.entries(this.componentData.config)){
            if(typeof value !== 'string')
              this.aConfigParams.push({paramName: key, paramValue: JSON.stringify(value)});
            else
              this.aConfigParams.push({paramName: key, paramValue: value});
          }
        }
      }
    });
  }
  onDeleteConfig(param:any){
    //tag.disabled = true   
    this.isConfigParamNameTag  = true;

    let found = this.aConfigParams.findIndex((item:any)=>item.paramName === param.paramName);
    if(found > -1){
      this.aConfigParams.splice(found, 1);
    }
    this.aConfigParamName = '';
    this.aConfigParamValue = '';
  }
  onSelectConfig(param:any){
    //tag.disabled = true
    this.isConfigParamNameTag  = true;
    this.aConfigParamName = param.paramName;
    this.aConfigParamValue = param.paramValue;
  }
  addOutParam(outputparamSrc:any, outputparamTgt:any){
    outputparamSrc.disabled = false;
    this.currentOparam.source = outputparamSrc.value;
    this.currentOparam.target = outputparamTgt.value;
    let found:any = this.operation.output.params.find((item:any)=>item.source === outputparamSrc.value);
    if(found){
      found.target = outputparamTgt.value;
    }else{
      let item:any = {"source": outputparamSrc.value, "target": outputparamTgt.value, translator: this.currentOparam.translator};
      this.operation.output.params.push(item);
    }
    outputparamSrc.value = '';
    this.currentOparam.target = '';
  }
  addInParam(inputparamSrc:any, inputparamTgt:any){
    inputparamSrc.disabled = false;
    this.currentIparam.source = inputparamSrc.value;
    this.currentIparam.target = inputparamTgt.value;
    let found:any = this.operation.input.params.find((item:any)=>item.source === inputparamSrc.value);
    if(found){
      found.target = inputparamTgt.value;
    }else{
      let item:any = {"source": inputparamSrc.value, "target": inputparamTgt.value, translator: this.currentIparam.translator};
      this.operation.input.params.push(item);
    }
    inputparamSrc.value = '';
    this.currentIparam.target = '';    
  }
  onInPassThrough(){
    this.inputParams = [];
    if(this.ipPassThrough === true){
      if(!this.operation.input.params)
        this.operation.input.params = [];
      this.tableColumns.forEach((item:any)=>{
        this.inputParams.push(item);
        this.operation.input.params.push(item);
      });
      
    }
  }
  onOutPassThrough(){
    this.outputParams = [];
    if(this.opPassThrough === true){
      if(!this.operation.output.params)
        this.operation.output.params = [];
      this.tableColumns.forEach((item:any)=>{
        this.outputParams.push(item);
        this.operation.output.params.push(item);
      });      
    }
  }
  delProvider(){
    let found = this.providers.find((item:any)=>item.class === this.componentData.class);
    if(found){
      let filter = new Filter(Expr.eq('rowId', found.rowId));
      this.gateway.delete<any>('/api/v1/component'+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{   
          if(result.status === 0 && result.results.length > 0){
            this.loadComponents();
            this.deviceUtil.showToast("Component Deleted.");
            this.closePopup();
          }
        }, ()=>{
          this.deviceUtil.showToast("Component deletion failed.", true);
        });
    }
  }
  loadComponentsByClass(){
    this.componentIds = this.components.filter((item:any)=>item.class === this.componentData.class);
  }
  onProviderIdChange(provId:any){
    if(this.componentData.id === 'createProvId'){
      this.newComponentId = '';
      this.aConfigParams = [];
    }
  }
  onProviderIdChange2(provId:any){
    if(this.componentData.id === 'createProvId'){
      this.newComponentId = '';
      return;
    }
    let found = this.componentIds.find((item:any)=>item.id === this.componentData.id);
    if(found){
      this.aConfigParams = [];
      for(let [key,value] of Object.entries(found.config)){
        if(typeof value === 'object')
          value = JSON.stringify(value);      
        this.aConfigParams.push({paramName: key, paramValue: value});
      }
    }
  }

  getSelectedItem(event: any) {
    let found = this.syncServices.find(x => x.id === event.id);
    if (!found) {
      this.syncServices.push(event);
    }
    else {
      this.deviceUtil.showToast('Item already added.', true);
      return;
    }
  }

  removeItem(event: Event, item: any) {
    event.preventDefault();
    let index = this.syncServices.findIndex((x: any) => x.id === item.id);
    this.syncServices.splice(index, 1);
  }
  
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.syncServices, event.previousIndex, event.currentIndex);
  }
  addColumnParam(){
    this.serviceElementTag = false;
    if(this.serviceElement === '' || this.serviceElementType === '')
      return;
    let element:any = {paramName: this.serviceElement, paramType: this.serviceElementType};    
    this.serviceElements.push(element);
    this.serviceElement = '';
    this.serviceElementType = '';
    
  }
  onSelectParam(svcItem:any){
    this.serviceElementTag = true;
    this.serviceElement = svcItem.paramName;
    let found = this.serviceElementTypes.find((type:any)=>type.source === svcItem.paramType);
    if(found)
      this.serviceElementType = found.source;
    else
      this.serviceElementType = svcItem.paramType;
    if(svcItem.translator)
      this.translator = svcItem.translator;
  }
  onRequireParams(){
    console.log("isRequireParams "+this.isRequireParams);
    if(this.isRequireParams === true && this.serviceElements.length === 0){
      this.onTableChange2();
    }else{
      this.serviceElements = [];
    }
  }
  onTableChange2(){
    let memberConfig = this.components.find((item:any)=>item.id === this.model.endpoint.target);
    if(this.serviceTarget && this.serviceTarget !== '' && memberConfig.config && memberConfig.config.members){
      let filter = new Filter(Expr.eq("TABLE_NAME", this.serviceTarget));
      if(memberConfig.config.database)
        filter.and(Expr.eq('TABLE_SCHEMA', memberConfig.config.currentSchema));
        filter.and(Expr.eq('TABLE_CATALOG', memberConfig.config.catalog));
        //filter.and(Expr.eq('TABLE_SCHEMA', memberConfig.config.database)); // //commented by naresh, default schema is dbo for every DB
      this.gateway.get<any>("/api/v1/"+memberConfig.id+"_columns"+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          result.results.forEach((item:any)=>{
            let type = item.type;
            let found = this.serviceElementTypes.find((type:any)=>type.target === item.type);
            if(found)
              type = found.source;
            let element:any = {paramName: item.name.toUpperCase(), paramType: type};
            this.serviceElements.push(element);
          });
        }
      });
    }
  }
  closeFieldPopup(){
    this.isShowFieldPopup = false;
  }
  onDeleteElement(item:any){
    this.serviceElementTag = false;
    let foundIdx = this.serviceElements.findIndex((element:any)=>element.paramName === item.paramName); 
    if(foundIdx > -1){
      this.serviceElements.splice(foundIdx, 1);
    }
    this.serviceElement = '';
    this.serviceElementType = '';    
  }
  changeOrchType(){

  }
  addOrchService(){
    if(this.syncActionType !== '' && this.syncActionType === 'service')
      this.syncServices.push({type: this.syncActionType, id: {}, operation: {id: {}}, component: {}});
    this.syncActionType = "";
  }
  getSelectedOpr(item:any, event:any){
    if(typeof event !== 'string'){
      item.operation = {
        id : {
          source: event.data.id.source
        }        
      };
    }
  }
  getSelectedService(item:any, event:any){
    if(typeof event !== 'string'){
      item.id = {
        source: event.data.id.source
      };
    }
  }
  showMapping(action:any, item:any){   
    this.isShowFieldPopup = true;
    this.mappingType = action.id;
    this.fieldProvider = item;
    this.loadApiMapping();
  }
  
openModal(id: string) {
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
    if(this.isShowPopup){
      this.model.endpoint.target = 'chooseTarget';
      this.isShowPopup = false;
    }
}
loadApiMapping(){
  this.gateway.get<any>('/api/v1/services?select=&filter='+this.fieldProvider.id.source, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
    if(result.status === 0 && result.results.length > 0){
        this.sourceParams = [];
        this.targetParams = [];
        this.fieldProvider.elements = result.results[0].elements;
        result.results[0].elements.forEach((elem:any)=>{
          this.sourceParams.push({
            id: elem.paramName,
            name: elem.paramName,
            data: elem
          });
          if(this.mappingType === 'input'){
            this.targetParams.push({
              id: elem.paramName,
              name: elem.paramName,
              data: elem
            });
          }else{
            let found = this.targetParams.findIndex((item:any)=>item.id === elem.paramType);
            if(found === -1){
              this.targetParams.push({
                id: elem.paramType,
                name: elem.paramType,
                data: elem
              });
            }
          }
        });
        if(this.mappingType === 'input' && this.syncServices.length > 1){
          this.syncServices.forEach((lastSvc:any)=>{
            if(lastSvc.operation.mapping){
              let output = lastSvc.operation.mapping.find((ele:any)=>ele.type === 'output');
              if(output && output.data){
                output.data.forEach((elem:any)=>{
                  let found = this.targetParams.find((item:any)=>item.id === elem.source.paramName);
                  if(!found)
                    this.targetParams.push({
                      id: elem.source.paramName,
                      name: elem.source.paramName,
                      data: {paramName: elem.source.paramName, paramType: elem.target.paramType}
                    });
                });
              }              
            }
          });
        }
        this.openModal('custom-modal-2');     
    }
    });    
}

loadApiMapping2(){
  this.gateway.get<any>('/api/v1/services?select=&filter='+this.fieldProvider.id.source, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
    if(result.status === 0 && result.results.length > 0){
        this.sourceParams = [];
        this.targetParams = [];
        result.results[0].elements.forEach((elem:any)=>{
          this.sourceParams.push(elem);
          if(this.mappingType === 'input'){
            this.targetParams.push(elem);
          }else{
            let found = this.targetParams.findIndex((item:any)=>item.paramName === elem.paramType);
            if(found === -1){
              this.targetParams.push({paramName: elem.paramType, paramType: elem.paramType});
            }
          }
        });
        if(this.mappingType === 'input' && this.syncServices.length > 1){
          this.syncServices.forEach((lastSvc:any)=>{
            if(lastSvc.operation.mapping){
              let output = lastSvc.operation.mapping.find((ele:any)=>ele.type === 'output');
              if(output && output.data){
                output.data.forEach((elem:any)=>{
                  this.targetParams.push({paramName: elem.source.paramName, paramType: elem.target.paramType});
                });
              }              
            }
          });
        }
        this.openModal('custom-modal-2');     
    }
    });    
}
getTargetMember(event:any){
  if(event.name){
    let found = this.dbTables.find((item:any)=>item.id === event.name);
    if(found)
      this.serviceTarget = found.data.tableName;
  }
}
nothingFn(){
  return false;
}
serviceNotFound(event:any){
  
}
notFoundMember(event:any){
  this.serviceTarget = event.data;
}
}
