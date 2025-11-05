import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
//import { ToolbarService, LinkService, ImageService, HtmlEditorService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
import { ToastComponent } from '../toast/toast.component';
import { HttpClient } from '@angular/common/http';
import { Inserter } from '../utils/inserter';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Updater } from '../utils/updater';


import { Observable } from 'rxjs';
import { Selector } from '../utils/selector';
import { form } from '../utils/form';
import { option } from '../utils/option';
import { EventAction } from '../utils/event-action';
import { control } from '../utils/control';
import { DesignContainerService } from '../design-container/design-container.service';
import { StyleClass } from '../utils/style-class';

declare var $: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
  // providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class TemplateComponent implements OnInit, AfterViewInit, OnDestroy {
  templateClass:string = '';
  actionEditorClass:string = 'd-none';
  eventTypes = ['load', 'change', 'click', 'Remove'];
  containers = ['accordion', 'tabs', 'container'];
  formLoadActions = [{ id: 'init', desc: 'Init', icon: 'fa-level-up-alt' }, { id: 'preShow', desc: 'Pre Display', icon: 'fa-level-up-alt' }, { id: 'postShow', desc: 'Post Display', icon: 'fa-cog' }];

  public tools: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink', 'CreateTable',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  toolTypes: any = [];
  /*toolTypes: any = [
    { name: 'Text', icon: 'font', type: 'text' },
    { name: 'Line', icon: 'grip-lines', type: 'line' },
    { name: 'Input', icon: 'i-cursor', type: 'input' },
    { name: 'Multiline Input', icon: 'i-cursor', type: 'textarea' },
    { name: 'Dropdown', icon: 'angle-down', type: 'dropdown' },
    { name: 'Yes / No', icon: 'dot-circle', type: 'condition' },
    { name: 'Radio Group', icon: 'dot-circle', type: 'radio' },
    { name: 'Checkbox Group', icon: 'check-square', type: 'checkbox' },
    { name: 'Table', icon: 'table', type: 'table' },
    { name: 'DataTable', icon: 'table', type: 'data-table' },
    { name: 'Matrix Table', icon: 'table', type: 'matTable' },
    { name: 'Button', icon: 'hand-pointer', type: 'button' },
    { name: 'Accordion', icon: 'angle-double-down', type: 'accordion' },
    { name: 'Tabs', icon: 'indent', type: 'tabs' },
    { name: 'Container', icon: 'box', type: 'container' },
    { name: 'Import Template', icon: 'download', type: 'template' },
    { name: 'Auto Complete', icon: 'list-ul', type: 'autoComplete' },
  ];*/

  alignments: any = [
    { id: 'left', align: 'left', type: 'button', selected: true },
    { id: 'center', align: 'center', type: 'button', selected: false },
    { id: 'right', align: 'right', type: 'button', selected: false },
    { id: 'horizontal', align: 'horizontal', type: '', selected: false },
    { id: 'vertical', align: 'vertical', type: '', selected: true },
  ];

  inputType: any = [
    { id: 'text', value: 'text', selected: true },
    { id: 'date', value: 'date', selected: false },
    { id: 'time', value: 'time', selected: false },
    { id: 'number', value: 'number', selected: false },
    { id: 'file', value: 'file', selected: false },
    { id: 'range', value: 'range', selected: false },
    { id: 'password', value: 'password', selected: false },
    { id: 'email', value: 'email', selected: false },
  ];

  //holds tex editor value;
  public value: string = '';
  text: string = '';
  rangeSlider = {
    min: 0,
    max: 0,
    step: 1
  };
  Object = Object;
  Array = Array;
  stateData: any;
  formType: form;
  defControlWidth: any = 'col-sm-11';
  currentControl: any = { width: 12 };
  controlOptions: any;
  options: option[] = [];
  allTemplates: form[];
  isNewTemplate: boolean = false;
  isShowMdlFrmType: boolean = false;

  departments: any = [];
  deptSections: any = [];
  templates: form[] = [];
  currTemplate: any;
  currTemplateControls: any;
  departmentTemplates: any = [];
  serviceElements: any;
  loadControl: any = { "type": "form" };
  selectedCntrol: any = {};
  actionElements: any[] = [];
  actionType: string = '';
  serviceData: any = [];
  isShowImportTemplate = false;
  mapperTypes: any = [];
  deptCode: string;
  mappedDeptCode: string = '';

  mappedSectionCode: string = '';

  frmActionSet: any = [];
  actionEventSet: any = [];
  mapperSet: any = [];
  frmMappingSet: any = [];
  isShowActionEditor: boolean = false;
  isShowMatrixPopup: boolean;
  isShowDelCntrlInCell = false;
  delCntrlRowIndex: number;
  delCntrlTabCol: number;
  delCntrl: any;
  cellkey:any;
  deleteControlType: any;
  mapperAction: EventAction;
  eventType: string = '';
  toolboxData: any = {
    currentControl: {
      style: ''
    },
    toolTypes: this.toolTypes,
    inputType: '',
    controlOptions: [],
    rangeSlider: {},
    isShowDesigner: true,
    eventType: '',
    isModified: false
  };
  tblControlIndex: any;
  templateList:any = [];
  constructor(private route: Router,
    private deviceUtil: DeviceUtil,
    private toast: ToastComponent,
    private designContainer:DesignContainerService,
    private gateway: HttpClient) {
    let navigation = this.route.getCurrentNavigation();
    if (navigation)
      this.stateData = navigation.extras.state;
  }
  ngOnDestroy(): void {

  }
  onBack(): void {
    if (this.toolboxData.isModified) {
      this.deviceUtil.showAlert("updater", "Template has been updated Do you want to loose the Update?", (event: any) => {
        if (event.value === 1) {
          this.route.navigate(['/template-list'], { state: {} });
        }
      });
    } else {
      this.route.navigate(['/template-list'], { state: {} });
    }
  }

  ngOnInit(): void {
    if (!this.stateData) {
      this.route.navigate(['/']);
      return;
    }
    this.loadControlTypes();
    this.actionType = "";
    if (this.stateData.eventAction) {
      this.addUpdateActions(this.stateData.mapperAction);
    }
    if (this.stateData.isNewTemplate && !this.stateData.template) {
      this.isShowMdlFrmType = true;
      this.allTemplates = this.deviceUtil.getSessionData('templates');
      this.stateData.template = {
        id: this.deviceUtil.uuidv4(),
        tempId: this.allTemplates === null ? 'form0' : 'form' + this.allTemplates.length.toString(),
        tempType: 'single',
        checked: false,
        tempName: 'Edit template name',
        controls: []
      };
    }
    this.formType = this.stateData.template;

    if (this.formType.controls.length > 0)
      this.makeActiveControl(null, this.formType.controls[0]);
    if (this.stateData.departments) {
      this.departments = this.stateData.departments;
    }
    this.serviceData = this.deviceUtil.getAllServices();
    if (this.stateData.deptCode) {
      this.mappedDeptCode = this.stateData.deptCode;
    }

    if (this.stateData.sectionId) {
      this.mappedSectionCode = this.stateData.sectionId;
      this.onchangeDepartment();
    }
    if (this.stateData.actions)
      this.loadTemplateMapping(this.stateData.actions);
    this.toolboxData.isShowDesigner = true;
    this.toolboxData.currentControl = this.currentControl;
    this.toolboxData.inputType = this.inputType;
    this.toolboxData.controlOptions = this.controlOptions;
    this.toolboxData.rangeSlider = this.rangeSlider;
    if (!this.stateData.isNewTemplate && this.stateData.template.TEMPID)
      this.loadPageActions(this.stateData.template.TEMPID);
      this.stateData.templates.forEach((item:any)=>{
        this.templateList.push({id: item.TEMPNAME, name: item.TEMPNAME, data: item});
      });
    this.getAllRptTemplates();
  }
  loadControlTypes(){
    let filter = new Filter(Expr.eq('STATUS', 0));
    this.gateway.get("/api/v1/controlType" + filter.get()).subscribe((result: any) => {
      if (result.status === 0) {
        this.toolboxData.toolTypes = [];
        result.results.forEach((item:any)=>{
          item.name = item.NAME;
          item.icon = item.ICON;
          item.type = item.TYPE;
          item.content = item.CONTENT;
          this.toolboxData.toolTypes.push(item);
        });
        this.toolTypes = this.toolboxData.toolTypes;
        this.designContainer.emitChange({toolTypes: this.toolTypes, templates: this.stateData.templates});
      }
    });
  }
  ngAfterViewInit() {
    $('.scrollableDiv').height($(window).height() - 230);
  }
  onChangeHttpType(event: Event, control: control, value: string) {
    if (control.formData !== undefined)
      control.formData.action = value;
  }

  onChangeElement(value: string, cntrl: control) {
    //cntrl.formData.element = value;
  }


  getFormType(event: Event, frmType: string) {
    this.formType.tempType = frmType;
  }

  onSubmitFormTypeSelection(event: Event) {
    this.isShowMdlFrmType = false;
    this.isShowMatrixPopup = false;
  }

  onSubmitTemplateImport(event: Event) {
    this.isShowImportTemplate = false;
    this.templates.forEach((element: any) => {
      if (element.checked === true) {
        JSON.parse(element.CONTROLS).forEach((cntrl: any) => {
          this.formType.controls.push(cntrl);
        });
        element.checked = false;
      }
    });
  }
  onUpdateTableColumnModal(event: Event, item?: any) {
    let controlIndex = this.formType.controls.findIndex((cntrl: any) => cntrl.id === item.id);
    if (controlIndex > -1) {
      let matTable = item.controls ? item.controls : item.matTable;
      for (let j = 0; j < matTable.length; j++) {
        let temp = matTable[j];
        let hdrKeys = Object.keys(temp).sort();         
        let hdrNum = hdrKeys.length;
        let lastHdr = hdrKeys[hdrNum-1];
        let lastHdrNum = lastHdr.replace('Header', '');
        if(hdrNum <= parseInt(lastHdrNum)){
          hdrNum++;
        }
        let hdrIdx = 'Header' +hdrNum;
        temp[hdrIdx] = {
          headerName: hdrIdx,
          control: new control()
        };
      }
      this.formType.controls[controlIndex] = item;
    }
  }
  onUpdateTableRowModal1(event: Event, item?: any) {
    let controlIndex = this.formType.controls.findIndex((cntrl: any) => cntrl.id === item.id);
    if (controlIndex > -1) {
      let matTable = item.controls ? item.controls : item.matTable;
      let row = matTable[matTable.length - 1];      
      matTable.push(JSON.parse(JSON.stringify(row)));
      this.formType.controls[controlIndex] = item;
    }
  }
  onUpdateTableRowModal(event: Event, item:any){
    let controlIndex = this.formType.controls.findIndex((cntrl: any) => cntrl.id === item.id);
    if (controlIndex > -1) {
      let row = item.controls[0];
      let newRow = JSON.parse(JSON.stringify(row));
      let index = 0;
      let rowNum = item.controls.length;
      let lastRow = item.controls[rowNum-1];
      let controlId = lastRow.Header0.control.id;
      controlId = controlId.replace(item.id+'_', '');
      let lastRowNum = controlId.charAt(0);
      if(rowNum <= parseInt(lastRowNum)){
        rowNum ++;
      }
      Object.keys(newRow).forEach((key:string)=>{
        if(key !== 'isLinked' && key !== 'selected'){        
          let tempCntrl = newRow[key].control;
          tempCntrl.id = item.id+'_'+rowNum+''+index;
          tempCntrl.value = '';
          if(tempCntrl.options){
            let idx=0;
            tempCntrl.options.forEach((opt:any)=>{
              opt.id += rowNum+''+idx;
              idx++;
            });
          }
          index++
        }
      });
      newRow.isLinked = true;
      item.controls.push(newRow);
    }
  }  
  onSubmitTableModal(event: Event, column?: any, row?: any, reqTabHeadCheck?: any, cntrlInd?: any) {
    let matTable = [];
    this.isShowMatrixPopup = false;
    this.isShowMdlFrmType = false;
    if (!column)
      column = parseInt((document.getElementById('txtTabColumns') as HTMLInputElement).value);
    if (!row)
      row = parseInt((document.getElementById('txtTabRows') as HTMLInputElement).value);
    /*const column = parseInt((document.getElementById('txtTabColumns') as HTMLInputElement).value);
    const row = parseInt((document.getElementById('txtTabRows') as HTMLInputElement).value);*/
    if (!reqTabHeadCheck)
      reqTabHeadCheck = (document.getElementById('reqTabHead') as HTMLInputElement).checked;
    for (let i = 0; i < row; i++) {
      let header: any = {};
      for (let j = 0; j < column; j++) {
        header['Header' + j] = {
          headerName: 'Header' + j,
          control: new control()
        };
      }
      matTable.push(header);
    }

    let currentControl;
    if (this.formType.controls.length > 0) {
      currentControl = this.formType.controls.reduce((acc: any, count: any) => {
        return parseInt(acc.id.substr(1)) >= parseInt(count.id.substr(1)) ? acc : count;
      });
    }

    let currentControlId;
    if (!currentControl)
      currentControlId = 0;
    else
      currentControlId = parseInt(currentControl.id.substr(1)) + 1;

    let data = {
      id: 'Q' + currentControlId,
      name: 'matTable' + currentControlId,
      label: 'Click to edit text',
      type: 'matTable',
      defaultType: 'matTable',
      options: [],
      alignment: '',
      checked: true,
      /*logic: {
        type: '',
        value: '',
        selected: '',
        skipTo: '',
        canEditable: false
      },*/
      displayLogic: [],
      //matTable: matTable,
      controls: matTable,
      reqTabBorder: false,
      reqTabHead: reqTabHeadCheck,//(document.getElementById('reqTabHead') as HTMLInputElement).checked,
      canShow: true,
      /*formData: {
          type: '',
          inputParams: [],
          outputParams: []
        }*/
    };
    //this.currentControl = data;
    this.cloneControl(this.currentControl, data);
    //let cntrlInd = document.getElementById('controlIndex') as HTMLInputElement;
    if (!cntrlInd)
      cntrlInd = document.getElementById('controlIndex') as HTMLInputElement;
    if (parseInt(cntrlInd.value) > -1) {
      this.formType.controls.splice(parseInt(cntrlInd.value), 0, data);
    }
    else
      this.formType.controls.push(data);
    cntrlInd.value = '';
  }
  onSubmitTableModal2(event: any, column:number, row:number, reqTabHeadCheck:boolean, cntrlInd:any) {
    let matTable = [];
    this.isShowMatrixPopup = false;
    this.isShowMdlFrmType = false;
    for (let i = 0; i < row; i++) {
      let header: any = {};
      for (let j = 0; j < column; j++) {
        header['Header' + j] = {
          headerName: 'Header' + j,
          control: new control()
        };
      }
      matTable.push(header);
    }

    let currentControl;
    if (this.formType.controls.length > 0) {
      currentControl = this.formType.controls.reduce((acc: any, count: any) => {
        return parseInt(acc.id.substr(1)) >= parseInt(count.id.substr(1)) ? acc : count;
      });
    }

    let currentControlId;
    if (!currentControl)
      currentControlId = 0;
    else
      currentControlId = parseInt(currentControl.id.substr(1)) + 1;

    let data = {
      id: 'Q' + currentControlId,
      name: 'matTable' + currentControlId,
      label: 'Click to edit text',
      type: 'matTable',
      defaultType: 'matTable',
      options: [],
      alignment: '',
      checked: true,
      displayLogic: [],
      controls: matTable,
      reqTabBorder: false,
      reqTabHead: reqTabHeadCheck,
      canShow: true,
    };
    this.cloneControl(this.currentControl, data);
    if (!cntrlInd)
      cntrlInd = document.getElementById('controlIndex') as HTMLInputElement;
    if (parseInt(cntrlInd.value) > -1) {
      this.formType.controls.splice(parseInt(cntrlInd.value), 0, data);
    }
    else
      this.formType.controls.push(data);
    cntrlInd.value = '';    
  }
  disableCurrentCheckBox() {
    let currControl;
    let matTables = this.formType.controls.filter((x: any) => x.type === 'matTable');
    matTables.forEach((element: any) => {
      let controls = element.controls ? element.controls : element.matTable;
      for (let i = 0; i < controls.length; i++) {
        let keys = Object.keys(controls[i]);
        for (let j = 0; j < keys.length; j++) {
          currControl = controls[i][keys[j]];
          if (currControl.control !== undefined) {
            currControl.control.checked = false;
          }
        }
      }
    });
  }
  dismissActiveControl() {
    let cntrl: any = this.formType;
    cntrl.controls.forEach((item: any) => {
      item.checked = false;
      if (item.controls && item.controls.length > 0) {
        item.controls.forEach((subItem: any) => {
          if (item.defaultType === "matTable") {
            Object.keys(subItem).forEach((key: string) => {
              if(typeof(key) == 'object')
                subItem[key].control.checked = false;
            });
          } else
            subItem.checked = false;
        });
      }
    });
  }
  findMatTableControl(que: any) {
    let result: any;
    let control: any = this.formType.controls.find((item: any) => item.id === que.parent);
    if (control) {
      control.controls.find((cntrl: any) => {
        let hdrKey = Object.keys(cntrl).find((col: any) => (typeof cntrl[col].control === 'object' && cntrl[col].control.id === que.id))
        if (hdrKey) {
          result = cntrl[hdrKey];
          return result;
        }
      });
    }
    if (result) {
      return result.control;
    }
  }
  findParentControl(que: any) {
    let result: any;
    let control: any = this.formType.controls.find((item: any) => item.id === que.parent);
    if (control) {
      if (control.defaultType === 'matTable') {
        let controls = control.controls;
        if (!controls)
          controls = control.matTable;
        controls.find((cntrl: any) => {
          let hdrKey = Object.keys(cntrl).find((col: any) => (typeof cntrl[col].control === 'object' && cntrl[col].control.id === que.id))
          if (hdrKey) {
            result = cntrl[hdrKey];
            return result;
          }
        });
        if (result) {
          return result.control;
        }
      } else {
        return control;
      }
    }
  }

  makeActiveControl(event: any, que: control) {
    this.dismissActiveControl();
    let cntrl: any = this.formType;
    if (que.parent) {
      cntrl = this.findParentControl(que);
    }
    let item = cntrl?.controls?.find((x: any) => x.checked === true);
    if (item === undefined) {
      this.disableCurrentCheckBox();
    }
    else if (item !== null && item !== undefined) {
      item.checked = false;
      if (item.controls && item.controls.length > 0) {
        let subItem = item.controls.find((x: any) => x.checked === true);
        if (subItem)
          subItem.checked = false;
      }
    }
    que.checked = true;
    if (que.type === 'radio' || que.type === 'checkbox' || que.type === 'condition')
      this.controlOptions = this.alignments.filter((x: any) => x.type === '');
    else
      this.controlOptions = this.alignments.filter((x: any) => x.type === que.type);

    this.controlOptions.forEach((element: any) => {
      if (element.align === que.alignment) {
        element.selected = true;
      }
      else {
        element.selected = false;
      }
    });
    this.cloneControl(this.currentControl, que);
    if (que.defaultType === 'input') {
      let checkedInputType = this.inputType.find((x: any) => x.selected === true);
      if (checkedInputType !== undefined)
        checkedInputType.selected = false;

      checkedInputType = this.inputType.find((x: any) => x.id === que.type);
      if (checkedInputType !== undefined)
        checkedInputType.selected = true;
    }
    this.rangeSlider.min = que.min === undefined ? 0 : que.min;
    this.rangeSlider.max = que.max === undefined ? 0 : que.max;
    this.rangeSlider.step = que.step === undefined ? 0 : que.step;

  }

  createControlInMiddle(event: Event, control: control, type: string) {
    const index = this.formType.controls.findIndex((x: any) => x.id === control.id);
    this.createControl(event, type, index, '');
  }

  createControlInCell(event: any, matControl: control, type: string, rowIndex: number, tabCol: number, cellkey: string, content?: string) {
    event.preventDefault();
    $('input[type=checkbox][name=control]').prop('checked', false);
    let item = this.formType.controls.find((x: any) => x.checked === true);
    if (item !== undefined)
      item.checked = false;

    let label = 'Click to edit text';
    let options: any = [];
    let data: any = {
      id: matControl.id + '_' + rowIndex + tabCol,
      name: matControl.id + '_' + type + rowIndex + tabCol,
      label: 'Click to edit text',
      text: 'Click to edit text',
      value: '',
      type: type,
      defaultType: type,
      options: [],
      alignment: '',
      checked: true,
      displayLogic: [],
      canShow: true
    };
    if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
      let length = options.length;
      options = [
        {
          id: type + rowIndex + tabCol + (++length),
          value: 'Choose',
          //value: 'opt ' + (length),
          defaultSelect: type === 'dropdown' ? false : true,
        },
        {
          id: type + rowIndex + tabCol + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        },
        {
          id: type + rowIndex + tabCol + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        }
      ];
      data.value = options[0].value;
      data.alignment = 'vertical';
    }
    if (type === 'condition') {
      let length = options.length;
      options = [
        {
          id: type + rowIndex + tabCol + (++length),
          value: 'Yes',
          defaultSelect: true,
        },
        {
          id: type + rowIndex + tabCol + (++length),
          value: 'No',
          defaultSelect: false,
        }
      ];
      data.value = 'Yes';
      data.alignment = 'vertical';
    }
    if (type === 'button') {
      label = 'Button';
      data.alignment = 'left';
    }
    if (type === 'input') {
      data.type = 'text';
      data.defaultType = 'input';
      let input = this.inputType.find((x: any) => x.selected === true);
      if (input !== undefined) {
        input.selected = false;
      }
      input = this.inputType.find((x: any) => x.id === 'text');
      if (input !== undefined) {
        input.selected = true;
      }
    }
    if (data.defaultType === 'custom') {
      data.text = this.deviceUtil.prepareCustomTemplate(data, content);

      //data.text = content;
    }
    data.options = options;
    data.parent = matControl.id;
    data.parentType = matControl.defaultType;
    if (event.target && event.target.text.trim() === 'Delete') {
      // this.deviceUtil.showAlert('template', 'Do you want to Remove the Row?', (event:any)=>{
      //   if(event.value === 1){
      //     matControl.controls.splice(rowIndex, 1);
      //   }else{
      //     matControl.controls[rowIndex]['Header'+tabCol].control = new control();
      //   }
      // });


      this.isShowDelCntrlInCell = true;
      this.delCntrlRowIndex = rowIndex;
      this.delCntrlTabCol = tabCol;
      this.delCntrl = matControl;
    } else {
      if (matControl.controls[rowIndex]['Header' + tabCol])
        matControl.controls[rowIndex]['Header' + tabCol].control = data;
      else
        matControl.controls[rowIndex][tabCol].control = data;
    }


    /*
          this.isShowDelCntrlInCell = true;
          this.delCntrlRowIndex = rowIndex;
          this.delCntrlTabCol = tabCol;
          this.delCntrl = matControl;
          //matControl.controls[rowIndex][tabCol].control = new control();
        }else
          matControl.controls[rowIndex][tabCol].control = data
    */
    this.cloneControl(this.currentControl, data);
    this.makeActiveControl(event, data);
    this.toolboxData.isModified = true;
  }
  doDeleteMatControl(event: any, matControl: control, type: string, rowIndex: number, tabCol: number, cellkey: string, content?: string){
    event.preventDefault();
    this.isShowDelCntrlInCell = true;
    this.delCntrlRowIndex = rowIndex;
    this.delCntrlTabCol = tabCol;
    this.delCntrl = matControl;
    this.cellkey = cellkey;
  }
  onChangeLoadForm(event: any) {
    if (event.currentTarget.checked)
      this.createControl(event, 'button', 0, 'loadForm');
    else {
      let index = this.formType.controls.findIndex((x: any) => x.type == 'loadForm');
      if (index > -1)
        this.formType.controls.splice(index, 1);
    }
  }
  createControl(event: Event, type: string, index: number, id: any, content?: string) {
    let currentControl;
    if (this.formType.controls.length > 0) {
      currentControl = this.formType.controls.reduce((acc: any, count: any) => {
        return parseInt(acc.id.substr(1)) >= parseInt(count.id.substr(1)) ? acc : count;
      });
    }

    let currentControlId;
    if (!currentControl)
      currentControlId = 0;
    else
      currentControlId = parseInt(currentControl.id.substr(1)) + 1;

    event.preventDefault();
    let isContainer = false;
    $('input[type=checkbox][name=control]').prop('checked', false);
    let label = 'Click to edit text';
    let options: any = [];
    let data: any = {
      id: id !== '' ? id : 'Q' + currentControlId,
      name: type + currentControlId,
      value: '',
      label: id !== '' ? id : label,
      text: 'Click to edit text',
      type: id !== '' ? id : type,
      defaultType: type,
      options: [],
      alignment: '',
      checked: true,
      canShow: true,
      width: 12
    };
    if(type === 'image'){
      data.value = './assets/images/avatar.png';
    }
    if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
      let length = options.length;
      options = [
        {
          id: type + currentControlId + (++length),
          value: 'Choose',
          //value: 'opt ' + (length),
          defaultSelect: type === 'dropdown' ? false : true,
        },
        {
          id: type + currentControlId + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        },
        {
          id: type + currentControlId + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        }
      ];
      data.value = options[0].value;
      data.alignment = 'vertical';
    }
    if (type === 'condition') {
      let length = options.length;
      options = [
        {
          id: type + currentControlId + (++length),
          value: 'Yes',
          defaultSelect: true,
        },
        {
          id: type + currentControlId + (++length),
          value: 'No',
          defaultSelect: false,
        }
      ];
      data.value = 'Yes';
      data.alignment = 'vertical';
    }
    if (type === 'button') {
      label = 'Button';
      data.alignment = 'left';
    }
    if (type === 'input') {
      data.type = 'text';
      data.defaultType = 'input';
    }
    if (this.containers.includes(type) || type === 'table') {
      data.data = [];
      data.type = '0';
      data.controls = [];
    }
    if (type === 'data-table' || type === 'table') {
      let tableData = {
        dtCaption: 'SampleTable',
        dtHeader: [
          { title: 'Column1', data: 'Column1' },
          { title: 'Column2', data: 'Column2' }
        ],
        dtBody: [
          { 'Column1': 'Test1', 'Column2': 'Test2' },
          { 'Column1': 'Test1', 'Column2': 'Test2' },
        ]
      };
      data.data = tableData;
    }
    if (type === 'matTable') {
      if (index > -1) {
        let cntrlInd = (document.getElementById('controlIndex') as HTMLInputElement)
        cntrlInd.value = index.toString();
      }
      this.onSubmitTableModal2(null,1, 1, true, new Number(index));
      //this.onSubmitTableModal(new Event(""),1, 1, true, new Number(index));
      //$('#mdlMatrixTable').modal('show');
    }
    if (type === 'table') {
      //if(index>-1){
      /*let cntrlInd = (document.getElementById('controlIndex') as HTMLInputElement)
      cntrlInd.value = index.toString();*/
      //this.tblControlIndex = index;
      //}
      //this.isShowMatrixPopup = true;
      //return;
    }
    if (type === 'template') {
      this.isShowImportTemplate = true;
    }
    data.options = options;
    // to add in middle of the control
    if (data.defaultType === 'custom') {
      data.text = this.deviceUtil.prepareCustomTemplate(data, content);
      //data.text = content;
    }
    if (index > -1 && type !== 'matTable' && type !== 'template') {
      this.formType.controls.splice(index, 0, data);

    }
    else if (type !== 'matTable' && type !== 'template') {
      let item: any = this.formType.controls.find((x: any) => x.checked === true);
      if (item && (this.containers.includes(item.defaultType) || item.defaultType === 'table')) {
        data.id = 'Q' + item.controls.length;
        data.parent = item.id;
        data.parentType = item.defaultType;
        item.controls.push(data);
        isContainer = true;
      } else {
        this.formType.controls.push(data);
      }
      this.cloneControl(this.currentControl, data);
      this.makeActiveControl(event, data);
    }
    this.toolboxData.isModified = true;
    setTimeout(() => {
      let elem: any = (document.getElementById(data.id) as HTMLInputElement);
      if (elem && !isContainer)
        elem.checked = true;
      const El = document.getElementById('develop');
      if (El !== null)
        El.scrollTo({ top: El.scrollHeight, behavior: 'smooth' });
    }, 200);
    if(data.type === 'popup'){
      data.canShow = false;
      this.designContainer.emitChange({templates: this.stateData.templates});
      //this.designContainer.complete();
    }
  }

  dismissControl(event: Event, item: control) {
    let itemId = item.id;
    let cntrl: any = item;
    if (cntrl.parent) {
      cntrl = this.formType.controls.find((x: any) => x.id === cntrl.parent);
      if (cntrl && cntrl.controls) {
        let cIndex = cntrl.controls.findIndex((x: any) => x.id === itemId);
        cntrl.controls.splice(cIndex, 1);
      }
      this.makeActiveControl(event, cntrl);
    } else {
      let index = this.formType.controls.findIndex((x: any) => x.id === item.id);
      this.formType.controls.splice(index, 1);
      if (index > -1) {
        let cntrl = this.formType.controls[index - 1];
        this.makeActiveControl(event, cntrl);
      }
    }
    this.removeMapping(item);
  }
  getEditorText(event: Event) {
  }

  addNewOption(event: Event, item: control) {
    event.preventDefault();
    if (item.parent) {
      let que = this.formType.controls.find((x: any) => x.id === item.parent);
      if (que !== undefined) {
        const index = que.controls.findIndex((x: any) => x.id === item.id);
        let length = item.options.length;
        item.options.push({
          id: item.type + index + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        });
      }
    } else {
      let que = this.formType.controls.find((x: any) => x.id === item.id);
      if (que !== undefined) {
        const index = this.formType.controls.findIndex((x: any) => x.id === item.id);
        let length = que.options.length;
        que.options.push({
          id: item.type + index + (++length),
          value: 'opt ' + (length),
          defaultSelect: false,
        });
      }
    }
  }

  addNewOptionInCell(event: Event, item: control, rowIndex: number, tabCol: number) {
    event.preventDefault();
    if (item !== undefined) {
      let length = item.options.length;
      item.options.push({
        id: item.type + rowIndex + tabCol + (++length),
        value: 'opt ' + (length),
        defaultSelect: false,
      });
    }
  }

  removeOption(event: Event, item: control, opt: option) {
    event.preventDefault();
    if (item !== undefined) {
      let index = item.options.findIndex((x: any) => x.id === opt.id);
      item.options.splice(index, 1);
    }
  }

  removeOptionInCell(event: Event, item: control, opt: option) {
    event.preventDefault();
    if (item !== undefined) {
      let index = item.options.findIndex((x: any) => x.id === opt.id);
      item.options.splice(index, 1);
    }
  }

  modifyOption(event: any, que: any, opt: any, type: string) {
    if (!event.isEditing) {
      if (type === 'option' || type === 'tabCell') {
        let item = que.options.find((x: any) => x.id === opt.id);
        if (item !== undefined)
          item.value = event.value;
      }
      else if (type === 'button') {
        que.label = event.value;
      }
      else if (type === 'template') {
        this.formType.tempName = event.value;
      }
      else if (type === 'tabCellText') {
        que.label = event.value;
      }
      else if (type === 'thead') {
        let controls = que.controls ? que.controls : que.matTable;
        controls[0][opt].headerName = event.value;
      }
      else {
        que.id = event.value;
      }
    }
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

  alignmentChanged(event: Event, align: any) {
    let que = this.formType.controls.find((x: any) => x.id === this.currentControl.id);
    if (que !== null && que !== undefined) {
      que.alignment = align.align;
    }
    let item = this.controlOptions.find((x: any) => x.selected === true)
    if (item !== null && item !== undefined) {
      item.selected = false;
      align.selected = true;
    }
  }
  cloneControl(target: any, source: any) {
    if (!source.width)
      source.width = 12;
    this.currentControl = source;
    this.toolboxData.currentControl = source;
  }
  onChangeInputWidth(event: Event) {
    let cntrl: any = this.formType;
    let input: any = event.currentTarget;
    let controlId = this.currentControl.id;
    if (this.currentControl.parent) {
      cntrl = cntrl.controls.find((x: any) => x.id === this.currentControl.parent);
    }
    let que = cntrl.controls.find((x: any) => x.id === controlId);
    if (que) {
      que.width = parseInt(input.value);      
    }    
  }
  inputTypeChanged(event: Event) {
    let input: any = event.currentTarget;
    let matTables: any = [];
    let keys: string[];
    let currControl: any;
    let que = this.formType.controls.find((x: any) => x.id === this.currentControl.id);
    if (que === undefined) {
      matTables = this.formType.controls.filter((x: any) => x.type === 'matTable');

      matTables.forEach((element: any) => {
        let controls = element.controls ? element.controls : element.matTable;
        for (let i = 0; i < controls.length; i++) {
          let keys = Object.keys(controls[i]);
          for (let j = 0; j < keys.length; j++) {
            currControl = controls[i][keys[j]];
            if (currControl.control !== undefined) {
              if (currControl.control.id === this.currentControl.id) {
                currControl.control.type = input.value;
                break;
              }
            }
          }
        }
      });
    }
    if (que !== null && que !== undefined) {
      que.type = input.value;

      if (this.currentControl.type !== 'range') {
        this.rangeSlider = {
          min: 0,
          max: 0,
          step: 0
        }
        que.min = 0;
        que.max = 0;
        que.step = 0;
      }
    }
    (document.getElementById(this.currentControl.id) as HTMLInputElement).value = '';
  }

  changeRangeValuese(event: any, type: string) {
    let que = this.formType.controls.find((x: any) => x.id === this.currentControl.id);
    if (que !== null && que !== undefined) {
      if (type === 'min')
        que.min = event.target.value;
      else if (type === 'max')
        que.max = event.target.value;
      else
        que.step = event.target.value;
    }
  }

  previewTemplate(event: Event) {
    let previewData = {
      template: this.formType,
      deptCode: this.mappedDeptCode,
      sectionId: this.mappedSectionCode,
      departments: this.departments
    };
    //sessionStorage.setItem('tempPreview', JSON.stringify(this.formType));
    this.deviceUtil.addSessionData('tempPreview', previewData);
    //this.route.navigate([], {state: {title: 'asdf'}}).then(result => {  window.open('/#/templatePreview', '_self'); });
    this.route.navigate(['templatePreview'], { state: { title: 'asdf', indicator: 'preview', templates: this.stateData.templates } });
  }

  addControlLogic(event: Event, control: control, type: string) {
    event.preventDefault();
    /*if('form' !== control.type)
      this.mapperTypes.push(type);
    if(type === 'element'){
      
      control.logic.type=type;
      control.logic.canEditable=true;
    }*/
  }
  createTemplate(event: Event, callback?: CallableFunction) {
    if (this.formType.tempName.toLowerCase() === 'edit template name') {
      this.toast.showError('Add template name to proceed');
      return;
    }
    if (this.formType.controls.length === 0) {
      this.toast.showError('Add atleast one component to proceed');
      return;
    }
    let matTable: any = this.formType.controls.filter((item: any) => item.defaultType === 'matTable' && item.controls === undefined);
    if (matTable) {
      matTable.forEach((cntrl: any) => {
        if (cntrl.matTable){
          cntrl.matTable.forEach((hdr: any) => {
            Object.keys(hdr).forEach((hdrKey: any) => {
              if (hdr[hdrKey].control?.parent)
                return;
              if (hdr[hdrKey].control)
                hdr[hdrKey].control.parent = cntrl.id;
            });
          });
        }
        if(cntrl.controls && cntrl.controls.length > 0)
          delete cntrl.matTable;
      });      
    }
    let data: any = {
      TEMPTYPE: this.formType.tempType,
      TEMPNAME: this.formType.tempName,
      CONTROLS: this.formType.controls,
      STATUS: 0
    }

    if (this.stateData.isNewTemplate) {
      let inserter = new Inserter(data);
      this.gateway.post<any>('/api/v1/template', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
        if (result.status === 0 && result.results.length > 0) {
          this.deviceUtil.setGlobalData('TEMPLATE_UPD', true);
          if (this.mappedSectionCode === '') {
            this.toast.showSuccess('Template created Successfully.');
            this.route.navigate(['/template-list'], { state: {} });
          } else {
            this.updateTemplateMapping(result.results[0].id);
          }
        }
      });
    } else {
      if (callback) {
        data.STATUS = 1;
      }
      let updater = new Updater(data);
      let filter = new Filter(Expr.eq("rowId", this.formType.tempId));
      updater.addFilter(filter);
      this.gateway.put<any>('/api/v1/template', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
        if (result.status === 0 && result.results.length > 0) {
          if (callback) {
            callback();
          } else
            this.updateTemplateMapping(this.formType.tempId);
        }
      });
    }
  }
  updateTemplateMapping(tempId: string) {
    if (!tempId)
      return;
    if (this.mappedSectionCode === '') {
      this.toast.showSuccess('Template updated Successfully.');
      this.route.navigate(['/template-list'], { state: {} });
      return;
    }
    let filter = new Filter(Expr.eq('TEMPID', tempId));
    this.gateway.delete("/api/v1/tempdepartment" + filter.get()).subscribe((result: any) => {
      if (result.status === 0) {
        this.addTemplateMapping({ TEMPID: tempId });
      }
    });
  }
  addTemplateMapping(element: any) {
    let inserter = new Inserter({
      'TEMPID': element.TEMPID,
      'DEPTCODE': '' + this.mappedDeptCode,
      'SECTIONID': parseInt(this.mappedSectionCode),
      'ACTIONS': this.stateData.actionEventSet,
      'STATUS': 0
    });
    this.gateway.post("/api/v1/tempdepartment", inserter.get()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.toast.showSuccess('Templates are mapped with department.');
        this.route.navigate(['/template-list'], { state: {} });
      }
    });
  }
  makeOptionEditable(event: Event, que: control) {
    //que.logic.canEditable=true;
  }

  getBase64(event: any, control: control) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (imgsrc: any) {
      control.value = imgsrc.target.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  onChangeTableBorder(event: any, control: any) {
    if (event.currentTarget.checked)
      control.reqTabBorder = true;
    else
      control.reqTabBorder = false;
  }
  onChangeTableHeader(event: any, control: any) {
    if (event.currentTarget.checked)
      control.reqTabHead = true;
    else
      control.reqTabHead = false;
  }
  onchangeDepartment() {
    if (this.stateData.deptSections) {
      this.deptSections = this.stateData.deptSections;
      return;
    }
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.eq('DEPTCODE', this.mappedDeptCode));
    this.gateway.get("/api/v1/deptsection" + filter.get()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.deptSections = result.results;
        this.stateData.deptSections = this.deptSections;
      } else {
        this.toast.showError('No Sections exists');
        this.mappedSectionCode = '';
        this.deptSections = [];
      }
    });
  }
  loadTemplateMapping(actions: any) {
    actions.forEach((item: any) => {
      if (item.actionSet.length > 0) {
        let foundIndex = this.actionEventSet.findIndex((action: any) => action.id === item.id);
        if (foundIndex === -1) {
          this.actionEventSet.push(item);
        }
      }
    });
  }
  loadServiceById(action: any) {
    return new Observable<any>((observer) => {
      this.gateway.get<any>('/api/v1/services?select=&filter=' + action.serviceId, this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
        if (result.status === 0 && result.results.length > 0) {
          result.results[0].elements.forEach((item: any) => {
            this.frmMappingSet.push(item);
          });
        }
        observer.next();
        observer.complete();
      });
    });

  }

  private loadPageActions(tempId: any) {
    if (this.stateData.actionEventSet)
      return;
    if (!this.stateData.actionEventSet)
      this.stateData.actionEventSet = [];
    let selector = new Selector('ACTIONS');
    let filter2 = new Filter(Expr.eq("TEMPID", tempId));
    selector.addFilter(filter2);
    this.gateway.get<any>("/api/v1/tempdepartment" + selector.get(), this.deviceUtil.getJsonHeaders()).subscribe((result) => {
      if (result.status === 0 && result.results.length > 0) {        
        result.results[0].ACTIONS.forEach((action: any) => {
          let found = this.stateData.actionEventSet.find((item: any) => item.id === action.id);
          if (!found) {
            this.stateData.actionEventSet.push(action);
          }
        });
      }
    });
  }
  getTemplateMapping() {
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.eq('SECTIONID', '' + this.mappedSectionCode));

    this.gateway.get("/api/v1/tempdepartment" + filter.get()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        let tempMappings = result.results[0];
        if (tempMappings.ACTIONS) {
          this.actionEventSet = tempMappings.ACTIONS;
          let found = this.actionEventSet.find((item: any) => item.controlId === this.formType.id);
          if (found) {
            this.frmActionSet = found.actionSet;
          }
        }
      }
    });
  }
  getTemplateById(tempId: string) {
    let filter = new Filter(Expr.eq('status', 0));
    filter.and(Expr.eq('TEMPID', tempId));
    this.gateway.get("/api/v1/template" + filter.get()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.formType = result.results.find((item: any) => {
          item.checked = false;
          item.tempName = item.TEMPNAME;
          item.tempType = item.TEMPTYPE;
          item.tempId = item.TEMPID;
          item.controls = item.CONTROLS;
          return item;
        });
        this.currTemplate = this.formType;
      }
    });
  }

  getAllDepartments() {
    this.gateway.get("/api/v1/department").subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.departments = result.results;
      }
    });
  }
  addCurrentEvent(event: Event, control: control, eventType: string) {
    event.preventDefault();
    this.addControlEventLogic(event, control, eventType);
  }
  addFormActionLogic(event: Event, type: string) {
    event.preventDefault();
    this.addControlActionLogic2({ currentTarget: { value: type } }, { type: 'form', id: this.formType.tempId }, type);
  }
  addControlActionLogic(event: any, eventType?: any) {
    event.preventDefault();
    this.addControlActionLogic2(event, this.currentControl, eventType);
  }
  addControlActionLogic2(event: any, control: any, eventType?: any) {
    this.toolboxData.isShowDesigner = false;
    this.isShowActionEditor = true;
    //this.stateData.actionEventSet = this.actionEventSet;
    this.stateData.controlActionLogic = [control, eventType];
    this.stateData.serviceData = this.serviceData;
    //this.stateData.actionEventSet = this.controlActionSet;
    let found = this.actionEventSet.find((item: any) => item.type === eventType && item.controlId === control.id);
    if (found) {
      this.stateData.mapperAction = found;
    } else {
      delete this.stateData.mapperAction;
    }
    let elements: any = [];
    this.formType.controls.forEach((elem:any)=>{
      elements.push({ id: elem.name, name: elem.name, data: elem });
    });
    if (elements.length > 0) {
      this.stateData.elements = elements;
    }
    //this.templateClass = 'd-none';
    //this.actionEditorClass = '';
    //this.actionEditor.emitChange({stateData: this.stateData, source:this});
    this.route.navigate(['/action-editor'], { state: this.stateData });
  }
  closeEditor(){
    this.actionEditorClass = 'd-none';
    this.templateClass = '';    
  }
  addControlActionLogic3(event: any, control: any, eventType?: any) {
    this.toolboxData.isShowDesigner = false;
    this.isShowActionEditor = true;
    let found = this.actionEventSet.find((item: any) => item.type === eventType && item.controlId === control.id);
    if (!found) {
      let eAction = new EventAction();
      eAction.id = this.deviceUtil.uuidv4();
      eAction.controlId = control.id;//this.currentControl.id;
      eAction.controlType = control.type;//this.currentControl.type;
      eAction.type = eventType;//event.currentTarget.value;
      found = eAction;
    }
    let frmInitAction: any = this.actionEventSet.find((item: any) => item.controlType === 'form');
    if (frmInitAction) {
      let mapping = frmInitAction.actionSet[0].operation.mapping.find((item: any) => item.type === 'output');
      if (mapping) {
        let elements: any = [];
        mapping.data.forEach((elem: any) => {
          elements.push({ id: elem.element, name: elem.element, data: elem });
        });
        if (elements.length > 0) {
          this.stateData.elements = elements;
        }
      }
    }
    this.stateData.mapperAction = found;
    this.stateData.serviceData = this.serviceData;
    this.route.navigate(['/action-editor'], { state: this.stateData });
    this.mapperAction = found;
  }
  addControlEventLogic(event: Event, control: any, type: string) {
    let cntrlAction = this.actionEventSet.find((item: any) => item.controlId === control.id && item.type === type);
    if (cntrlAction) {
      this.toast.showSuccess('Action already added.');
      return;
    }
    let eAction = new EventAction();
    eAction.id = this.deviceUtil.uuidv4();
    eAction.controlId = control.id;
    eAction.controlType = control.type;
    eAction.type = type;
    this.actionEventSet.push(eAction);
  }
  removeMapping(control: control) {
    let actionIndex = this.actionEventSet.findIndex((item: any) => item.controlId === control.id);
    if (actionIndex > -1) {
      this.actionEventSet.splice(actionIndex, 1);
    }

  }
  getSelectedItem(event: any) {
    console.log(event);
  }
  widgetActionEvent(event: any) {
    let action = event.action;
    let currentInstance: any = this;
    currentInstance[action].apply(this, event.params);
  }
  addUpdateActions(action: any) {
    if (action) {
      let actionIndex = this.stateData.actionEventSet.findIndex((item: any) => item.controlId === action.controlId && item.type === action.type && item.id === action.id);
      if (actionIndex > -1) {
        this.stateData.actionEventSet.splice(actionIndex, 1);
      }
      if (action.actionSet.length > 0)
        this.stateData.actionEventSet.push(action);
    }
    this.toolboxData.isShowDesigner = true;
    this.isShowActionEditor = false;
    this.toolboxData.eventType = '';
  }
  addMasterData(event: any) {
    let id = event.id;
    let found: any = this.formType.controls.find((item: any) => item.id === id);
    if (found) {
      found.data = event.data;
    }
  }

  changeWidgetId(widgetId: any, newWidgetId: any) {
    if (this.toolboxData.currentControl.name === widgetId) {
      this.toolboxData.currentControl.name = newWidgetId;
    }
  }
  changeWidgetId2(widgetId: any, newWidgetId: any) {
    if (this.currentControl.name === widgetId) {
      if (this.currentControl.parent) {
        let found = this.findParentControl(this.currentControl);
        if (found) {
          found.name = newWidgetId;
        }
      } else {
        let found = this.formType.controls.find((item: any) => item.name === widgetId);
        if (found) {
          found.name = newWidgetId;
        }
      }
    }
  }

  asignStyleProperties(event: Event, style: any) {
    let cntrl: any = this.formType;
    let controlId = this.currentControl.id;
    let que = cntrl.controls.find((x: any) => x.id === controlId);
    if (que) {
      que.styles = style;
    }
  }
  asignStyle(event: Event, style: any) {
    let cntrl: any = this.formType;
    let controlId = this.currentControl.id;
    let que = cntrl.controls.find((x: any) => x.id === controlId);
    if (que) {
      que.styles = style;
    }
  }
  deleteTemplate(event: any) {
    this.deviceUtil.showAlert('delete', 'Do you want to remove the Template?', (aEvent: any) => {
      if (aEvent.value === 1) {
        this.removeTemplate(() => {
          this.route.navigate(['/template-list'], { state: {} });
        });
      }
    });
  }
  removeTemplate(callback:CallableFunction){
    let data = {STATUS: 1};
    let updater = new Updater(data);
    let filter = new Filter(Expr.eq("rowId", this.formType.tempId));
    updater.addFilter(filter);
    this.gateway.put<any>('/api/v1/template', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
          this.removeTemplateMapping(callback);
      }
    });
  }
  removeTemplateMapping(callback:CallableFunction){
    let filter = new Filter(Expr.eq('TEMPID', this.formType.tempId));
    this.gateway.delete("/api/v1/tempdepartment" + filter.get()).subscribe((result: any) => {
      if (result.status === 0) {
        callback();        
      }
    });
  }
  importWidget(customWidgetName: string, content: any) {
    //this.toolTypes.push({ name: customWidgetName, icon: 'columns', type: 'custom', 'content': content });
    let inserter = new Inserter({ NAME: customWidgetName, ICON: 'columns', TYPE: 'custom', 'CONTENT': content, STATUS: 0 });
    this.gateway.post('/api/v1/controlType', inserter.get()).subscribe((result:any)=>{
      if(result.status === 0){
        this.toast.showSuccess('Custom Control added.');
        this.loadControlTypes();
      }
    });
  }

  onSubmitDeleteAction(event: any) {
    console.log(this.deleteControlType);
    console.log(event);
    if(!this.delCntrl.controls)
      this.delCntrl.controls = this.delCntrl.matTable;
    if (this.deleteControlType == 'empty') {
      if(this.delCntrl.controls[this.delCntrlRowIndex][this.delCntrlTabCol])
        this.delCntrl.controls[this.delCntrlRowIndex][this.delCntrlTabCol].control = new control();
      else
      this.delCntrl.controls[this.delCntrlRowIndex]['Header'+this.delCntrlTabCol].control = new control();
    }
    else if (this.deleteControlType == 'row') {
      let control = this.delCntrl.controls ? this.delCntrl.controls : this.delCntrl.matTable;
      if(this.delCntrl.controls.length === 1){
        this.deviceUtil.showAlert('','Do you want delete the Parent Control', (event:any)=>{
          if(event.value === 1){
            let foundIdx = this.formType.controls.findIndex((item:any)=>item.id = this.delCntrl.id);
            if(foundIdx > -1)
              this.formType.controls.splice(foundIdx, 1);
          }
        });
      }else
        control.splice(this.delCntrlRowIndex, 1);
    }
    else if (this.deleteControlType == 'col') {
      if (this.delCntrl.controls) {
        let columns = 0
        columns = Object.keys(this.delCntrl.controls[0]).length;
        if(columns === 1){          
          this.deviceUtil.showAlert('','Do you want delete the Parent Control', (event:any)=>{
            if(event.value === 1){
              let foundIdx = this.formType.controls.findIndex((item:any)=>item.id = this.delCntrl.id);
              if(foundIdx > -1)
                this.formType.controls.splice(foundIdx, 1);
            }
          });
        }else{
          this.delCntrl.controls.forEach((elem:any)=>{
            delete elem[this.cellkey];
          });
          /*let tempControl = this.delCntrl.controls[0][this.cellkey];
          if(tempControl)
            delete this.delCntrl.controls[0][this.cellkey];*/
        }
      }
    }
    this.isShowDelCntrlInCell = false;
  }
  getAllRptTemplates(){
    let selector = new Selector('TEMPNAME');
    selector.addColumn('TEMPTYPE');
    selector.addColumn('TEMPID');
    let tempFilter = new Filter(Expr.eq('STATUS', 0));
    selector.addFilter(tempFilter);
    this.gateway.get<any>('/api/v1/rpttemplate'+selector.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.stateData.reports = result.results;
      }
    });
  }
}