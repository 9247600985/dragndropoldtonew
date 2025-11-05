import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { control } from '../utils/control';
import { option } from '../utils/option';
@Component({
  selector: 'app-design-widget',
  templateUrl: './design-widget.component.html',
  styleUrls: ['./design-widget.component.css']
})
export class DesignWidgetComponent implements OnInit {

  Object = Object;
  Array = Array;
  @Output() actionEvent = new EventEmitter<any>();
  @Input()
  actionEventSet:any = [];
  @Input()
  frmMappingSet:any = [];
  @Input()
  serviceData:any = [];
  @Input()
  controlType:any = {};
  eventTypes = ['load', 'change', 'click'];
  @Input()
  toolTypes:any = [];
  @Input()
  item:any;
  @Input()
  templates:any;
  /*public value: string = '';
  text:string = '';*/
  public tools: object = {
    items: [
        'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
        'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
        'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
        'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
        'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  constructor() { 
  }

  ngOnInit() {
    console.log();
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
  createControlInCell(event: Event, control: control, type: string, rowIndex: number, tabCol: number, cellkey: string)
  {
    this.actionEvent.emit({action: 'createControlInCell', params: [event, control, type, rowIndex, tabCol, cellkey]});
  }
  onChangeTableBorder(event: any, control: any)
  {
    this.actionEvent.emit({action: 'onChangeTableBorder', params: [event, control]});
  }
  getEditorText(event: Event)
  {
    this.actionEvent.emit({action: 'getEditorText', params: [event]});
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
    this.actionEvent.emit({action: 'dismissControl', params: [event, item]});
  }
  createControlInMiddle(event: Event, control: control, type: string)
  {
    this.actionEvent.emit({action: 'createControlInMiddle', params: [event, control, type]});
  }
  widgetActionEvent(event:any){
    this.actionEvent.emit(event);
  }
  getSelectedElement(item:any,event: any){
    if(!item.attrs)
      item.attrs = {};
    item.attrs['tempName'] = event.name;
    item.attrs['tempId'] = event.data.tempId;
  }
}
