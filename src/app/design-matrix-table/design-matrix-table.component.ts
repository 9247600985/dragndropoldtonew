import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { control } from '../utils/control';
import { option } from '../utils/option';

@Component({
  selector: 'app-design-matrix-table',
  templateUrl: './design-matrix-table.component.html',
  styleUrls: ['./design-matrix-table.component.css']
})
export class DesignMatrixTableComponent implements OnInit {
  Object = Object;
  Array = Array;
  JSON = JSON;
  @Input()
  item:any;
  @Input()
  toolTypes:any;
  @Input()
  matrixToolTypes:any = [];
  @Output() actionEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  onChangeTableBorder(event: any, control: any)
  {
    this.actionEvent.emit({action: 'onChangeTableBorder', params: [event, control]});
  }
  onChangeTableHeader(event: any, control: any)
  {
    this.actionEvent.emit({action: 'onChangeTableHeader', params: [event, control]});
  }
  onChangeAutoGrow(event:any, item:any){
    item.autoGrow = event.target.checked;
  }
  modifyOption(event: any, que: any, opt: any, type: string)
  {
    this.actionEvent.emit({action: 'modifyOption', params: [event, que, opt, type]});
  }
  createControlInCell(event: any, control: control, type: string, rowIndex: number, tabCol: number, cellkey: string, content?:string)
  {
    if(event.target && event.target.text.trim() === 'Delete'){
      this.actionEvent.emit({action: 'doDeleteMatControl', params: [event, control, type, rowIndex, tabCol, cellkey, content]});
    }else
      this.actionEvent.emit({action: 'createControlInCell', params: [event, control, type, rowIndex, tabCol, cellkey, content]});
  }
  addNewOptionInCell(event: Event, item: control, rowIndex: number, tabCol: number)
  {
    this.actionEvent.emit({action: 'addNewOptionInCell', params: [event, item, rowIndex, tabCol]});
  }
  checkChanged(event: Event, que: control, opt: option)
  {
    this.actionEvent.emit({action: 'checkChanged', params: [event, que, opt]});
  }
  removeOption(event: Event, item: control, opt: option)
  {
    this.actionEvent.emit({action: 'removeOption', params: [event, item, opt]});
  }
  getBase64(event: any, control: control) {
    this.actionEvent.emit({action: 'getBase64', params: [event, control]});
  }
  getSelectedItem(event:any){
    this.actionEvent.emit({action: 'getSelectedItem', params: [event]});
  }
  makeActiveControl(event: any, que: control)
  {
    this.actionEvent.emit({action: 'makeActiveControl', params: [event, que]});
  }
}
