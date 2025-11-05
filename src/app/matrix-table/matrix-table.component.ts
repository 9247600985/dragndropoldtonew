import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { control } from '../utils/control';
import { option } from '../utils/option';

@Component({
  selector: 'app-matrix-table',
  templateUrl: './matrix-table.component.html',
  styleUrls: ['./matrix-table.component.scss']
})
export class MatrixTableComponent implements OnInit {

  Object = Object;
  Array = Array;
  JSON = JSON;
  @Input()
  toolTypes:any = [];
  @Input()
  item:any;
  @Output() actionEvent = new EventEmitter<any>();
  ngOnInit() {
   }
   createControlInCell(event: Event, control: control, type: string, rowIndex: number, tabCol: number, cellkey: string, content?:string)
   {
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
   removeOption(event: Event, item: control, opt: option)
   {
     this.actionEvent.emit({action: 'removeOption', params: [event, item, opt]});
   }
   addNewOptionInCell(event: Event, item: control, rowIndex: number, tabCol: number)
   {
     this.actionEvent.emit({action: 'addNewOptionInCell', params: [event, item, rowIndex, tabCol]});
   }
   modifyOption(event: any, que: any, opt: any, type: string)
   {
     this.actionEvent.emit({action: 'modifyOption', params: [event, que, opt, type]});
   }
   checkChanged(event: Event, que: control, opt: option)
   {
     this.actionEvent.emit({action: 'checkChanged', params: [event, que, opt]});
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
