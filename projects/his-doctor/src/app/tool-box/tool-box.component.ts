import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { StyleClass } from '../utils/style-class';


declare var document:any;
@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss']
})
export class ToolBoxComponent implements OnInit {
  Object = Object;
  Array = Array;
  JSON:JSON;
  @Output() actionEvent = new EventEmitter<any>();
  @Input()
  currentControl:any;
  @Input()
  inputType:any = [];
  @Input()
  controlOptions:any = [];
  @Input()
  rangeSlider:any = {};
  deviceTypes: any = ['sm', 'md', 'lg', 'xl'];
  eventTypes = ['load', 'change', 'click', 'Remove'];
  styleClasses:any = '';
  selectedStyleClass:string='Choose';
  selectedStyleSource:string='';
  styleEditorType:string = '';
  toolTypes: any = [];
  /*toolTypes: any = [
    {name: 'Text', icon: 'font', type: 'text'},
    {name: 'Input', icon: 'i-cursor', type: 'input'},
    {name: 'Multiline Input', icon: 'i-cursor', type: 'textarea'},
    {name: 'Dropdown', icon: 'angle-down', type: 'dropdown'},
    {name: 'Yes / No', icon: 'dot-circle', type: 'condition'},
    {name: 'Radio Group', icon: 'dot-circle', type: 'radio'},
    {name: 'Checkbox Group', icon: 'check-square', type: 'checkbox'},
    {name: 'Table', icon: 'table', type: 'table'},
    {name: 'DataTable', icon: 'table', type: 'data-table'},
    {name: 'Matrix Table', icon: 'table', type: 'matTable'},
    {name: 'Button', icon: 'hand-pointer', type: 'button'},
    {name: 'Accordion', icon: 'angle-double-down', type: 'accordion'},
    {name: 'Tabs', icon: 'indent', type: 'tabs'},
    {name: 'Container', icon: 'box', type: 'container'},
    { name: 'Import Template', icon: 'download', type: 'template' },
    { name: 'Auto Complete', icon: 'list-ul', type: 'autoComplete' },
  ];*/
  isShowPopup:boolean;
  masterData:any = {};  
  popupHdrName:string = '';
  dataItem:any = '';
  hdrItem:any = '';
  hdrOption:any = '';
  dataName:any = '';
  masterDataOption:any = '';
  isShowDesigner:boolean;
  @Input()
  toolboxData:any = {};
  isShowTwoPopup:boolean;
  widgetImageSrc:any;
  isShowImagePopup:boolean;
  newWidgetId:any;
  isShowWidgets:boolean = true;
  showWidgetIcon:string = 'fa-chevron-down';
  isShowStylePopup:boolean = false;
  style:any;
  styleProperties: any = {
    padding: {
      top: null,
      right: '15',
      bottom: null,
      left: '15',
    },
    margin: {
      top: null,
      right: null,
      bottom: null,
      left: null,
    },
    border: {
      top: null,
      right: null,
      bottom: null,
      left: null,
    },
    fontColor: '#333333',
    borderColor: '#ced4da',
    backgroundColor: '#f5f5f5',
    fontWeight: '600',
    transform: 'rotate(15deg) translate(30px, 85px)'
  };
  @ViewChild('myInput') myInputVariable: ElementRef;
  @ViewChild('preview') preview: ElementRef;
  isShowImportHTML = false;
  widgetContent:any;
  customWidgetName:string;
  isShowStyleEditor:boolean;
  
  constructor() {
  }

  ngOnInit() {
    this.currentControl = this.toolboxData.currentControl;
    this.inputType = this.toolboxData.inputType;
    this.controlOptions = this.toolboxData.controlOptions;
    this.rangeSlider = this.toolboxData.rangeSlider;
    this.isShowDesigner = this.toolboxData.isShowDesigner;
    if(!this.toolboxData.toolTypes)
      this.toolboxData.toolTypes = this.toolTypes;
    if(!this.toolboxData.currentControl.style)
      this.toolboxData.currentControl.style = '';
    this.toolTypes = this.toolboxData.toolTypes;
  }
  createControl(event: Event, type: string, index: number, id: any, content?:string)
  {
    this.toolboxData.isModified = true;
    this.actionEvent.emit({action: 'createControl', params: [event, type, index, id, content]});
  }
  inputTypeChanged(event: Event)
  {
    this.toolboxData.isModified = true;
    this.actionEvent.emit({action: 'inputTypeChanged', params: [event]});
  }
  onChangeInputWidth(event: Event){
    this.actionEvent.emit({action: 'onChangeInputWidth', params: [event]});
  }
  changeRangeValuese(event: any, type: string)
  {
    this.toolboxData.isModified = true;
    this.actionEvent.emit({action: 'changeRangeValuese', params: [event, type]});
  }
  alignmentChanged(event: Event, align: any)
  {
    this.toolboxData.isModified = true;
    this.actionEvent.emit({action: 'alignmentChanged', params: [event, align]});
  }
  addControlActionLogic(event:any, eventType?:string){
    if(!eventType)
      eventType = this.toolboxData.eventType;
    this.actionEvent.emit({action: 'addControlActionLogic', params: [event, eventType]});
  }
  showMasterData(event:any){
      this.isShowPopup = true;
  }
  addHeaderData(){
    
  }
  closePopup(){
    this.isShowPopup = false;
    this.masterData = [];
    this.hdrItem = '';
    this.masterDataOption = '';
    this.hdrOption = '';
  }
  addMasterData(){
    //let element:any = {};
    //element[this.dataName] = this.dataItem;    
    //this.masterData.push(element);    
    this.masterData[this.dataName] = this.dataItem;
    this.dataName = '';
    this.dataItem = '';
  }
  changeMasterData(item:any){}
  updateMasterData(){
    let found = this.toolboxData.currentControl.data.find((item:any)=>item.title === this.hdrOption);
    if(found){
      found.data = this.masterData;
    }else{
      if(!this.hdrItem)
        this.hdrItem = this.hdrOption;
      this.toolboxData.currentControl.data.push({
        "title": this.hdrItem,
        "data": this.masterData
      }); 
    }
    this.closePopup();
    this.actionEvent.emit({action: 'addMasterData', params: [this.toolboxData.currentControl]});
  }
  changeHeader(){
    let found = this.toolboxData.currentControl.data.find((item:any)=>item.title === this.hdrOption);
    if(found){
      this.masterData = found.data;
    }else{
      this.masterData = {};      
      this.toolboxData.currentControl.controls.forEach((item:any)=>{        
        this.masterData[item.id] = ''; 
      });
    }
  }
  changeDataItem(event:any, key:any){
    this.masterData[key] = event.currentTarget.value;
  }
  changeWidgetId(){
    this.closeWidgetId();
    //let widgetId = this.toolboxData.currentControl.name;
    //this.actionEvent.emit({action: 'changeWidgetId', params: [widgetId, this.newWidgetId]});
    this.toolboxData.currentControl.name = this.newWidgetId;
    this.toolboxData.isModified = true;
  }
   showWidgetId(event:any){
     this.newWidgetId = this.toolboxData.currentControl.name;
     this.isShowTwoPopup = true;
  //   (<HTMLInputElement>document.getElementById("widgetId")).select();
   }
   showWidgetImageSrc(event:any){
    this.widgetImageSrc = this.toolboxData.currentControl.value;
    this.isShowImagePopup = true;
   }
   changeWidgetImageSrc(){
    this.closeImageSrc();
    this.toolboxData.currentControl.value = this.widgetImageSrc;
    this.toolboxData.isModified = true;
   }
   closeImageSrc(){
    this.isShowImagePopup = false;
   }
  closeWidgetId(){
    this.isShowTwoPopup = false;
  }
  collapseTools(){
    if(this.isShowWidgets){
      this.isShowWidgets = false;
      this.showWidgetIcon = 'fa-chevron-up';
    }else{
      this.isShowWidgets = true;
      this.showWidgetIcon = 'fa-chevron-down';
    }
  }
  importWidget(){
    this.isShowImportHTML = true;
    //this.uploadWidget();
  }
  uploadWidget(){
    //let content = '<div class="col-sm-12"><hr style="width:300px;border-color:#aaa;transform:rotate(15deg) translate(30px,85px)"><div class="row"><div class="form-group col-sm-4 col-sm-offset-4"><select class="form-control"><option value>Choose</option></select></div></div><div class="row" align="center"><div class="form-group col-sm-3 col-sm-push-1"><select class="form-control"><option value>Choose</option></select></div><div class="form-group col-sm-3 col-sm-offset-5"><select class="form-control"><option value>Choose</option></select></div></div><div class="row"><div class="form-group col-sm-4 col-sm-offset-4"><select class="form-control"><option value>Choose</option></select></div></div><hr style="width:300px;border-color:#aaa;transform:rotate(345deg) translate(25px,-95px)"></div>';
    //this.toolTypes.push({name: 'Custom', icon: 'columns', type: 'custom', 'content': content});
    //let content = '<div class="col-sm-12"><hr style="width:300px;border-color:#aaa;transform:rotate(15deg) translate(30px,85px)"><div class="row"><div class="form-group col-sm-4 col-sm-offset-4"><select class="form-control"><option value>Choose</option></select></div></div><div class="row" align="center"><div class="form-group col-sm-3 col-sm-push-1"><select class="form-control"><option value>Choose</option></select></div><div class="form-group col-sm-3 col-sm-offset-5"><select class="form-control"><option value>Choose</option></select></div></div><div class="row"><div class="form-group col-sm-4 col-sm-offset-4"><select class="form-control"><option value>Choose</option></select></div></div><hr style="width:300px;border-color:#aaa;transform:rotate(345deg) translate(25px,-95px)"></div>';
    this.toolboxData.isModified = true;
    this.actionEvent.emit({action: 'importWidget', params: [this.customWidgetName, this.widgetContent]});
    this.isShowImportHTML = false;
  }

  applyStyleforControl(event: any)
  {
    console.log(event.target.value);
    if(event.target.value === 'new')
      this.isShowStylePopup = true;
      this.toolboxData.isModified = true;
  }

  closeStyleModel(event: Event)
  {
    this.isShowStylePopup = false;
    this.toolboxData.currentControl.style = '';
  }

  updateStyleProperties(event: any)
  {
    this.isShowStylePopup = false;
    this.actionEvent.emit({action: 'asignStyleProperties', params: [event, this.styleProperties]});
    this.toolboxData.isModified = true;
  }

  handleFileInputs(evt: any)
  {
    const file = evt.target.files[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        //console.log(reader.result);
        this.widgetContent =reader.result;
        this.preview.nativeElement.innerHTML = reader.result;
      }
      reader.readAsText(file);
    }
  }

  callUpload()
  {
    this.myInputVariable.nativeElement.click();
  }
  changeTransform(event:any){
    if(!this.toolboxData.currentControl.style){
      this.toolboxData.currentControl.style = {};
    }
    this.toolboxData.currentControl.style.transform = event.target.value;
    this.actionEvent.emit({action: 'asignStyle', params: [event, this.toolboxData.currentControl.style]});
    this.toolboxData.isModified = true;
  }
  applyCanShow(event:any){
    this.toolboxData.currentControl.canShow = event.target.value === 'true'?true:false;
  }
  applyLabelShow(event:any){
    this.toolboxData.currentControl.needLabel = event.target.value === 'true'?true:false;
  }
  chooseStyleEditor(type:string){
    this.styleEditorType = type;
    this.isShowStyleEditor = true;
    this.selectedStyleSource = '';
    if(this.styleEditorType === 'class'){      
      if(this.toolboxData.currentControl.styleClasses)
        this.selectedStyleSource = this.toolboxData.currentControl.styleClasses.split(' ').join('\n');
    }else if(this.styleEditorType === 'source'){
      if(this.toolboxData.currentControl.styleSource)
      for(let [key,value] of Object.entries(this.toolboxData.currentControl.styleSource)){
        this.selectedStyleSource += key+':'+value+';\n';
      }
    }        
  }
  closeStyleEditor(){
    this.isShowStyleEditor = false;
  }
  changeStyleEditor(){
    if(this.styleEditorType === 'class'){      
      this.toolboxData.currentControl.styleClasses = this.selectedStyleSource.split('\n').join(' ');
    }else if(this.styleEditorType === 'source'){
      if(!this.toolboxData.currentControl.styleSource)
        this.toolboxData.currentControl.styleSource = {};        
        this.selectedStyleSource.split(';').reduce((ruleMap:any, ruleString)=>{
            var rulePair:any = ruleString.split(':');
            if(rulePair.length > 1)
              ruleMap[rulePair[0].trim()] = rulePair[1].trim();        
            return ruleMap;
        }, this.toolboxData.currentControl.styleSource);
      this.selectedStyleSource = '';
    }
    this.closeStyleEditor();
  }
  getClasses() {
    var classes:any = {};
    // Extract the stylesheets
    return Array.prototype.concat.apply([], Array.prototype.slice.call(document.styleSheets)
        .map((sheet:any)=>{
          try{
            if(null == sheet || null == sheet.cssRules) return;
            // Extract the rules
            return Array.prototype.concat.apply([], Array.prototype.slice.call(sheet.cssRules)
                .map((rule:any)=>{
                    // Grab a list of classNames from each selector
                    return rule.selectorText?.match(/\.[\w\-]+/g) || [];
                    /*let classList = rule.selectorText?.match(/\.[\w\-]+/g) || [];
                    return classList;*/
                })
            );
              }catch(err){
                console.log(err.toString());
              }
        })
    ).filter((name:any)=>{      
        // Reduce the list of classNames to a unique list
        return !classes[name] && (classes[name] = true);
    });
  }
}
