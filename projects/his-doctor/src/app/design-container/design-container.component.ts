import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DeviceUtil } from '../utils/DeviceUtil';
import { control } from '../utils/control';
import { option } from '../utils/option';
import { DesignContainerService } from './design-container.service';
@Component({
  selector: 'app-design-container',
  templateUrl: './design-container.component.html',
  styleUrls: ['./design-container.component.css']
})
export class DesignContainerComponent implements OnInit {

  Object = Object;
  Array = Array;
  JSON = JSON;
  @Output() actionEvent = new EventEmitter<any>();
  @Input()
  controlType:any = {};
  eventTypes = ['load', 'change', 'click'];
  @Input()
  toolTypes:any = [];
  @Input()
  tabSet:any = [];
  matrixToolTypes:any = [];
  @Input()
  templates:any = [];  
  public tools: object = {
    items: [
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
        'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  containers = ['accordion', 'tabs', 'container'];
  widgetActions:any = [{id:'clone', desc:'Clone', icon:'fa-clone', type: 'all', class: 'text-success'},
    {id:'remove', desc:'Remove', icon:'fa-trash', type: 'all', class: 'text-danger'},
    {id:'addColumn', desc:'Add Column', icon:'fa-plus', type: 'matTable', class: 'text-primary'},
    {id:'addRow', desc:'Add Row', icon:'fa-plus', type: 'matTable', class: 'text-primary'},
  ];
  constructor(private deviceUtil:DeviceUtil, private service:DesignContainerService) { 
    service.changeEmitted$.subscribe(
      (result:any) => {
        if(result.toolTypes && result.toolTypes.length > 0){
          this.toolTypes = result.toolTypes;
          this.matrixToolTypes = [];
          this.matrixToolTypes = JSON.parse(JSON.stringify(this.toolTypes));
          this.matrixToolTypes.push({ name: 'Delete', icon: 'times', type: 'del' });          
        }
      });
  }

  ngOnInit() {
    //this.matrixToolTypes = JSON.parse(JSON.stringify(this.toolTypes));
    //this.matrixToolTypes.push({ name: 'Delete', icon: 'times', type: 'del' });
  }
  doWidgetAction(event:any, id:any, item:any){
    if(id === 'remove'){
      this.dismissControl(event, item);
    }else if(id === 'clone'){
      this.controlType.controls.push(JSON.parse(JSON.stringify(item)));
    }else if(id === 'addColumn'){      
      this.onUpdateTableColumnModal(event, item);
    }else if(id === 'addRow'){
      this.onUpdateTableRowModal(event, item);
    }
  }
  onUpdateTableColumnModal(event: Event, control?:any){
    this.actionEvent.emit({action: 'onUpdateTableColumnModal', params: [event, control]});
  }
  onUpdateTableRowModal(event: Event, control?:any){
    this.actionEvent.emit({action: 'onUpdateTableRowModal', params: [event, control]});
  }
  onAcceptAction(event:any){
    this.actionEvent.emit({action: 'onAcceptAction', params: [event]});
  }
  makeOptionEditable(event:any, control:control){
    this.actionEvent.emit({action: 'makeOptionEditable', params: [event, control]});
  }
  removeLogic(event:any, item:any, type:string, dispLogic:any){
    this.actionEvent.emit({action: 'removeLogic', params: [event, item, type, dispLogic]});
  }
  finalizeDisplayLogic(event: Event, queSelected: string, selected: string, option: string, control: control)
  {
    this.actionEvent.emit({action: 'finalizeDisplayLogic', params: [event, queSelected, selected, option, control]});
  }
  finalizeSkipLogic(event: Event, skipTo: string, skipSelected: string, skipBy: string, control: control)
  {
    this.actionEvent.emit({action: 'finalizeSkipLogic', params: [event, skipTo, skipSelected, skipBy, control]});
  }
  getSelectedItem(event:any){
    this.actionEvent.emit({action: 'getSelectedItem', params: [event]});
  }
  modifyOption(event: any, que: any, opt: any, type: string)
  {
    this.actionEvent.emit({action: 'modifyOption', params: [event, que, opt, type]});
  }
  onRowClick(event:any){
    this.actionEvent.emit({action: 'onRowClick', params: [event]});
  }
  addNewOption(event: Event, item: control)
  {
    this.actionEvent.emit({action: 'addNewOption', params: [event, item]});
  }
  checkChanged(event: Event, que: control, opt: option)
  {
    this.actionEvent.emit({action: 'checkChanged', params: [event, que, opt]});
  }
  removeOption(event: Event, item: control, opt: option)
  {
    this.actionEvent.emit({action: 'removeOption', params: [event, item, opt]});
  }
  addNewOptionInCell(event: Event, item: control, rowIndex: number, tabCol: number)
  {
    this.actionEvent.emit({action: 'addNewOptionInCell', params: [event, item, rowIndex, tabCol]});
  }
  getBase64(event: any, control: control) {
    this.actionEvent.emit({action: 'getBase64', params: [event, control]});
  }
  makeActiveControl(event: any, que: control)
  {
    this.actionEvent.emit({action: 'makeActiveControl', params: [event, que]});
  }
  createControlInCell(event: any, control: control, type: string, rowIndex: number, tabCol: number, cellkey: string, content?:string)
  {
    if(event.target && event.target.text.trim() === 'Delete'){
      this.actionEvent.emit({action: 'doDeleteMatControl', params: [event, control, type, rowIndex, tabCol, cellkey, content]});
    }else
      this.actionEvent.emit({action: 'createControlInCell', params: [event, control, type, rowIndex, tabCol, cellkey, content]});
  }
  onChangeTableBorder(event: any, control: any)
  {
    this.actionEvent.emit({action: 'onChangeTableBorder', params: [event, control]});
  }
  onChangeTableHeader(event: any, control: any)
  {
    this.actionEvent.emit({action: 'onChangeTableHeader', params: [event, control]});
  }
  getEditorText(event: Event)
  {
    this.actionEvent.emit({action: 'getEditorText', params: [event]});
  }
  findEditorItem(question:control){
    let item:any = this.controlType.controls.find((x: any) => x.id === question.id);
    if(question.id.indexOf('_')> -1){
      let idArray = question.id.split('_');
      if(idArray.length > 0){
        let controlId = idArray[0];
        let rootItem:any = this.controlType.controls.find((x: any) => x.id === controlId);
        if(rootItem){
          item = rootItem.controls.find((x: any) => x.id === question.id);
        }
      }
    }
    return item;    
  }
  openEditor(event: Event, question:  control, iframeId: string)
  {
    (document.getElementById('question' + iframeId) as HTMLElement).classList.add('d-none');
    (document.getElementById('iframe' + iframeId) as HTMLElement).classList.remove('d-none');
    (document.getElementById('editorBtn' + iframeId) as HTMLElement).classList.remove('d-none');
    /*this.value = (document.getElementById('question' + iframeId) as HTMLElement).innerHTML;
    this.text = (document.getElementById('question' + iframeId) as HTMLElement).innerText;*/
    question.ejsValue = (document.getElementById('question' + iframeId) as HTMLElement).innerHTML;    
    question.ejsText = (document.getElementById('question' + iframeId) as HTMLElement).innerText;
    setTimeout(() => {
      $('#iframe'+iframeId+'_toolbar_Preview').parent().removeClass('e-overlay');
    }, 200);
  }
  hideEditor(event: Event, question: control, questionId: string)
  {
    (document.getElementById('iframe' + questionId) as HTMLElement).classList.add('d-none');
    (document.getElementById('question' + questionId) as HTMLElement).classList.remove('d-none');
    (document.getElementById('editorBtn' + questionId) as HTMLElement).classList.add('d-none');
    (document.getElementById('question' + questionId) as HTMLElement).innerHTML = question.ejsValue?question.ejsValue:'';
    let item:any = this.controlType.controls.find((x: any) => x.id === question.id);
    if(item !== undefined)
    {
      /*item.text = this.text;
      item.label = this.value;*/
      item.text = question.ejsText;
      item.label = question.ejsValue;
    }
  }
  addCurrentEvent(event: Event, control: control, eventType: string)
  {
    this.actionEvent.emit({action: 'addCurrentEvent', params: [event, control, eventType]});
  }
  dismissControl(event: Event, item: control)
  {    
    this.deviceUtil.showAlert("dismissControl","Do you want to Remove it?", (aEvent:any)=>{
      if(aEvent.value === 1)
        this.actionEvent.emit({action: 'dismissControl', params: [event, item]});
    });
    
  }
  createControlInMiddle(event: Event, control: control, type: string)
  {
    this.actionEvent.emit({action: 'createControlInMiddle', params: [event, control, type]});
  }
  /*widgetActionEvent(event:any){
    this.actionEvent.emit(event);
  }*/
  widgetActionEvent(event: any) {
    let action = event.action;
    let currentInstance: any = this;
    currentInstance[action].apply(this, event.params);
  }
  toggleAccordion(item:any) {
    console.log(item)
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.controlType.controls, event.previousIndex, event.currentIndex);
  }
  importWidget(){    
    this.actionEvent.emit({action: 'importWidget', params: []});
  }
  matHdrSort(elem1:string, elem2:string){
    try{
      if (parseInt(elem1) < parseInt(elem2)) {
        return -1;
      }
      if (parseInt(elem1) > parseInt(elem2)) {
        return 1;
      }    
      // names must be equal
      return 0;
    }catch(err){}
    if (elem1.toUpperCase() < elem2.toUpperCase()) {
      return -1;
    }
    if (elem1.toUpperCase() > elem2.toUpperCase()) {
      return 1;
    }  
    // names must be equal
    return 0;
  }
  onChangeAutoGrow(event:any, item:any){
    item.autoGrow = event.target.checked;
  }
}
