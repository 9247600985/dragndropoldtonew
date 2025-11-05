import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastComponent } from '../toast/toast.component';
import { control } from '../utils/control';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Inserter } from '../utils/inserter';
import { Updater } from '../utils/updater';

@Component({
  selector: 'app-report-template',
  templateUrl: './report-template.component.html',
  styleUrls: ['./report-template.component.css']
})
export class ReportTemplateComponent implements OnInit {
  isNewTemplate:boolean;
  currentControl:any={};
  departments:any;
  deptSections:any;
  mappedDeptCode:any='';
  mappedSectionCode:any='';
  containers:any = [];
  toolTypes:any = [
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
    {name: 'Container', icon: 'box', type: 'container'},
    { name: 'Import Template', icon: 'download', type: 'template' },
    { name: 'Auto Complete', icon: 'list-ul', type: 'autoComplete' }];
  toolboxData:any={
    currentControl:{
      width:''
    },
    isShowDesigner:true,
    toolTypes: [
      {name: 'Text', icon: 'font', type: 'text'},
      {name: 'DataTable', icon: 'table', type: 'data-table'},      
      {name: 'Table', icon: 'table', type: 'table'}]
  };
  formType:any={};
  formLoadActions:any;
  allTemplates: any = [];
  stateData:any;
  controlOptions: any;
  alignments: any = [
    {id: 'left', align: 'left', type: 'button', selected: true},
    {id: 'center', align: 'center', type: 'button', selected: false},
    {id: 'right', align: 'right', type: 'button', selected: false},
    {id: 'horizontal', align: 'horizontal', type: '', selected: false},
    {id: 'vertical', align: 'vertical', type: '', selected: true},
  ];
  constructor(private route: Router, private deviceUtil:DeviceUtil, private gateway:HttpClient, private toast:ToastComponent) { 
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit() {
    if (!this.stateData){
      this.route.navigate(['/']);
      return;
   }
    this.getAllDepartments();
    this.formType = this.stateData.template;
    if(!this.formType){
      this.stateData.isNewTemplate = true;
      this.formType = {
        id:this.deviceUtil.uuidv4(),
        tempId: this.allTemplates === null ? 'rpt0' : 'rpt' + this.allTemplates.length.toString(),
        tempType: 'single',
        checked: false,
        ISLOADFORM: 'N',
        tempName: 'Edit Report name',
        controls: []
      };
      this.stateData.template = this.formType;
    }
    this.toolboxData.currentControl = this.currentControl;
    if(this.formType.controls.length > 0)
      this.makeActiveControl(null, this.formType.controls[0]);    
  }
  onchangeDepartment() {
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.eq('DEPTCODE', this.mappedDeptCode));
    this.gateway.get("/api/v1/deptsection"+filter.get()).subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.deptSections = result.results;
      }else{
        this.toast.showError('No Sections exists');
        this.mappedSectionCode = '';
        this.deptSections = [];
      }
    });
  }
previewTemplate(event:any){
  let previewData = {
    template: this.formType,
    deptCode : this.mappedDeptCode,
    sectionId: this.mappedSectionCode,
    departments:this.departments
  };
  //sessionStorage.setItem('tempPreview', JSON.stringify(this.formType));
  this.deviceUtil.addSessionData('report-preview', previewData);
  this.route.navigate([], {state: {title: 'asdf'}}).then(result => {  window.open('/#/report-preview', '_self'); });
}

widgetActionEvent(event:any){
  let action = event.action;
  let currentInstance:any = this;
  currentInstance[action].apply(this, event.params);
}
modifyOption(event:any, name:any, type:any, details:any){}
addFormActionLogic(event:any, id:any){}
createControl(event: Event, type: string, index: number, id: any)
  {
    event.preventDefault();
    $('input[type=checkbox][name=control]').prop('checked', false);
    let label = 'Click to edit text';
    let options: any = [];
    let data:any = {
      id: id!==''?id : 'Q' + this.formType.controls.length,
      name: type + this.formType.controls.length,
      value: '',
      label: id!==''?id: label,
      text: 'Click to edit text',
      type: id!==''?id : type,
      defaultType: type,
      options: [],
      alignment: '',
      checked: true,
      canShow: true,
      width: 12
    };
    if(type === 'radio' || type === 'checkbox' || type === 'dropdown')
    {
      let length = options.length;
      options = [
        {
          id: type+this.formType.controls.length+(++length),
          value: 'opt ' + (length),
          defaultSelect: type === 'dropdown' ? false : true,
        },
        {
          id: type+this.formType.controls.length+(++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        },
        {
          id: type+this.formType.controls.length+(++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        }
      ];
      data.value = options[0].value;
      data.alignment = 'vertical';
    }
    if(type === 'condition')
    {
      let length = options.length;
      options = [
        {
          id: type+this.formType.controls.length+(++length),
          value: 'Yes',
          defaultSelect: true,
        },
        {
          id: type+this.formType.controls.length+(++length),
          value: 'No',
          defaultSelect: false,
        }
      ];
      data.value = 'Yes';
      data.alignment = 'vertical';
    }
    if(type === 'button')
    {
      label = 'Button';
      data.alignment = 'left';
    }
    if(type === 'input')
    {
      data.type = 'text';
      data.defaultType = 'input';
    }
    if(this.containers.includes(type) || type === 'table')
    {
        data.data = [];
      data.type = '0';
      data.controls = [];
    }
    if(type === 'data-table')
    {
      let tableData = {
        dtCaption: 'SampleTable',
        dtHeader: [
          { title: 'Column1', data: 'Column1' },
          { title: 'Column2', data: 'Column2' }
        ],
        dtBody: [
          {'Column1': 'Test1', 'Column2': 'Test2'},
          {'Column1': 'Test1', 'Column2': 'Test2'},
        ]
      };
      data.data = tableData;
    }
    if(type === 'table')
    {
      let tableData = {
        dtHeader: [
          { title: 'Column1', data: 'Column1' },
          { title: 'Column2', data: 'Column2' }
        ],
        dtBody: [
          {'Column1': 'Test1', 'Column2': 'Test2'},
          {'Column1': 'Test1', 'Column2': 'Test2'},
        ]
      };
      data.data = tableData;
    }    

    data.options = options;
    // to add in middle of the control
    if(index > -1 && type !== 'matTable' && type !== 'template')
    {
      this.formType.controls.splice(index, 0, data);
      
    }
    else if(type !== 'matTable' && type !== 'template')
    {
      let item:any = this.formType.controls.find((x: any) => x.checked === true);
      if(item && (this.containers.includes(item.defaultType) || item.defaultType === 'table')){
        data.id = 'Q'+item.controls.length;
        data.parent = item.id;
        item.controls.push(data);
      }else{
        this.formType.controls.push(data);              
      }
      this.cloneControl(this.currentControl, data);      
      this.makeActiveControl(event, data);
    }
    setTimeout(() => {
      (document.getElementById(data.id) as HTMLInputElement).checked = true;
      const El = document.getElementById('develop');
      if(El !== null)
        El.scrollTo({top: El.scrollHeight, behavior: 'smooth'});
    }, 200);
  }
  cloneControl(target:control, source:control){
    if(!source.width)
      source.width = 12;
    Object.assign(target, source);
  }
  dismissActiveControl(){
    
    let cntrl:any = this.formType;
    cntrl.controls.forEach((item:any)=>{
      item.checked = false;
      if(item.controls && item.controls.length > 0){
        item.controls.forEach((subItem:any)=>{
          subItem.checked = false;
        });
      }
    });
  }
  makeActiveControl(event: any, que: control)
  {
    this.dismissActiveControl();
    let cntrl:any = this.formType;
    if(que.parent){      
      cntrl = cntrl.controls.find((x: any) => x.id === que.parent); 
    }    
    let item = cntrl.controls.find((x: any) => x.checked === true);
    if(item === undefined)
    {
      this.disableCurrentCheckBox();  
    }
    else if(item!==null && item!==undefined)
    {
      item.checked = false;
      if(item.controls && item.controls.length > 0){
        let subItem = item.controls.find((x: any) => x.checked === true);
        if(subItem)
          subItem.checked = false;
      }
    }
    que.checked = true;
    if(que.type === 'radio' || que.type === 'checkbox' || que.type === 'condition')
    this.controlOptions = this.alignments.filter((x: any) => x.type==='');
  else
    this.controlOptions = this.alignments.filter((x: any) => x.type===que.type);

    this.controlOptions.forEach((element: any) => {
      if(element.align === que.alignment)
      {
        element.selected = true;
      }
      else
      {
        element.selected = false;
      }
    });
  this.cloneControl(this.currentControl, que);
  }
  getAllDepartments() {
    this.gateway.get("/api/v1/department").subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.departments = result.results;
      }
    });
  }
  disableCurrentCheckBox()
  {
    let currControl;
    let matTables = this.formType.controls.filter((x: any) => x.type ==='matTable');
      matTables.forEach((element: any) => {
        for(let i=0;i<element.matTable.length;i++)
          {
            let keys = Object.keys(element.matTable[i]);
            for(let j=0;j<keys.length;j++)
            {
              currControl = element.matTable[i][keys[j]];
              if(currControl.control !== undefined){
                currControl.control.checked = false;
              }
            }
          }
      });
  }
  onChangeInputWidth(event: Event){
    let cntrl:any = this.formType;
    let input:any = event.currentTarget;
    let controlId = this.currentControl.id;
    if(this.currentControl.parent){
      cntrl = cntrl.controls.find((x: any) => x.id === this.currentControl.parent); 
    }
      let que = cntrl.controls.find((x: any) => x.id === controlId);
      if(que){
        que.width = parseInt(input.value);
      }
  }
  dismissControl(event: Event, item: control)
  {
    let itemId = item.id;
    let cntrl:any = item;
    if(cntrl.parent){
      cntrl = this.formType.controls.find((x: any) => x.id === cntrl.parent);
      if(cntrl && cntrl.controls){
        let cIndex = cntrl.controls.findIndex((x: any) => x.id === itemId);
          cntrl.controls.splice(cIndex, 1);
      }
      this.makeActiveControl(event, cntrl);
    }else{
      let index = this.formType.controls.findIndex((x: any) => x.id === item.id);
      this.formType.controls.splice(index, 1);
      if(index > -1){
        let cntrl = this.formType.controls[index-1];
        this.makeActiveControl(event, cntrl);
      }      
    }
  }
  createTemplate(event:any){
    let data:any = {
      TEMPTYPE: this.formType.tempType,
      TEMPNAME: this.formType.tempName,
      CONTROLS: this.formType.controls,
      STATUS: 0
    };    
    if(this.stateData.isNewTemplate){
      let inserter = new Inserter(data);
      this.gateway.post<any>('/api/v1/rpttemplate', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          if(this.mappedSectionCode === ''){
            this.toast.showSuccess('Template created Successfully.');
            this.route.navigate(['/report-details'], {state: {}});
          }else{
            //this.updateTemplateMapping(result.results[0].id);
          }
        }
      });
    }else{
      let updater = new Updater(data);
      let filter = new Filter(Expr.eq("rowId", this.formType.tempId));
      updater.addFilter(filter);
      this.gateway.put<any>('/api/v1/rpttemplate', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          //this.updateTemplateMapping(this.formType.tempId);
        }
      });
    }
  }
  deleteTemplate(event:any){    
    let filter = new Filter(Expr.eq("rowId", this.formType.tempId));    
    this.gateway.delete<any>('/api/v1/rpttemplate'+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        //this.updateTemplateMapping(this.formType.tempId);
      }
    });
  }
}
