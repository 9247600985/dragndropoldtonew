import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { control } from '../utils/control';
import { option } from '../utils/option';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit {
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
  data:any;  
  tblBody:any = [];
  matTblHeaders:any = [];
  matTblRows:any = [];
  constructor(private toast: ToastComponent) { }

  ngOnInit() {
    if(!this.data){
      this.data = this.item.data;
    }
  }
  onChoose(event: any, question: control, value: string){
    let defFound = question.options.find((item:any)=> item.defaultSelect === true);
    if(defFound)
      defFound.defaultSelect = false;
    let found = question.options.find((item:any)=>item.value === value);
    if(found){
      found.defaultSelect = true;
    }
    this.actionEvent.emit({action: 'onChoose', params: [event, question, value]});
  }
  onSubmit(event: Event, operationType: any) {
    this.actionEvent.emit({action: 'onSubmit', params: [event, operationType]});
  }
  openDrawingTool(event: Event, control: control) {
    this.actionEvent.emit({action: 'openDrawingTool', params: [event, control]});
  }
  onRowClick(event: any)
  {
    this.actionEvent.emit({action: 'onRowClick', params: [event]});
  }
  skipTo(event: any, question: control, value: string) {
    this.actionEvent.emit({action: 'skipTo', params: [event, question, value]});
  }
  widgetActionEvent(event:any){
    this.actionEvent.emit(event);
  }
  checkChanged(event: Event, que: control, opt: option) {
    this.actionEvent.emit({action: 'checkChanged', params: [event, que, opt]});
  }
  getSelectedItem(event: any, control: control)
  {
    this.actionEvent.emit({action: 'getSelectedItem', params: [event, control]});
  }
  addMatTableRow(item:any){
    let row = item.controls[0];
    let newRow = JSON.parse(JSON.stringify(row));
    let index = 0;
    let rowNum = item.controls.length;
    let lastRow = item.controls[rowNum-1];
    let hdr = lastRow.Header0?lastRow.Header0:lastRow['0'];
    let controlId = hdr.control.id;
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
  removeMatTableRow(item:any , event:any){
    console.log($(event.currentTarget).parent().parent());
    let row:any = $(event.currentTarget).parent().parent().find('tr.active-control');
    if(row.length>0)
      item.controls.splice(row[0].rowIndex-1, 1)
    else
      this.toast.showError('Select the row to remove');
  }
  selectRow(event:any, item:any){
    //console.log($(event.currentTarget).parent());
    $(event.currentTarget).parent().find('tr').removeClass('active-control');
    $(event.currentTarget).parent().find('tr').removeAttr('selected');
    event.currentTarget.classList.add('active-control');
    event.currentTarget.setAttribute('selected','selected');
  }
}
