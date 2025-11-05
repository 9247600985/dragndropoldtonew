import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { DeviceUtil } from '../utils/DeviceUtil';
import {Location} from '@angular/common';

@Component({
  selector: 'app-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit {


  stateData:any;
  mappingType:any;
  sourceParams:any;
  targetParams:any;
  apiParams:any = [];
  decisionType:any;
  decisionTypes:any = [];
  operatorTypes:any = [];
  @Input()
  provider:any='';
  constructor(private route: Router, private toast:ToastComponent, private gateway:HttpClient, private deviceUtil:DeviceUtil, private _location: Location) {
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    this.loadApiMapping(this.provider);
  }

  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
  }
  loadApiMapping(serviceId:any){    
    this.gateway.get<any>('/api/v1/services?select=&filter='+serviceId, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        if(this.mappingType === 'input'){
          this.sourceParams = [];
          result.results[0].elements.forEach((elem:any)=>{
            this.sourceParams.push({
              id: elem.paramName,
              name: elem.paramName,
              data: elem
            });
          });
          //this.targetParams = scopeParams;
          this.srcTagName = 'Src Element';
          this.tgtTagName = 'Tgt Element';
        }else if(this.mappingType === 'output'){
          this.targetParams = [];
          result.results[0].elements.forEach((elem:any)=>{
            this.targetParams.push({
              id: elem.paramName,
              name: elem.paramName,
              data: elem
            });
          });
          
          //this.sourceParams = scopeParams;
          this.tgtTagName = 'Src Element';
          this.srcTagName = 'Tgt Element';
        }
      }
      });    
  }
  getSelectedElement(event:any){

  }
  srcTagName:string = '';
  tgtTagName:string = '';
  paramSrc:any = 'Search Element';
  paramTgt:any = 'Search Element';
  operatorType:any = '';
  addApiMapping(){
    console.log()
  }
  onDeleteApi(item:any){}
  changeApiParam(item:any){}
  addParam(){

  }
  onInPassThrough(){}
  closeEditor(){
    this._location.back();
    //this.route.navigate
  }

}
