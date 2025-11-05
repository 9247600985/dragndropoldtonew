import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-matrix-popup',
  templateUrl: './matrix-popup.component.html',
  styleUrls: ['./matrix-popup.component.scss']
})
export class MatrixPopupComponent implements OnInit {
  isShowMdlFrmType:boolean = false;
  reqTabBorder:boolean;
  reqTabHead:boolean;
  txtTabColumns:any = 3;
  txtTabRows:number = 3;
  
  @Output() actionEvent = new EventEmitter<any>();
  @Input()
  controlIndex:any;
  constructor() { }

  ngOnInit() {
  }
  onSubmitFormTypeSelection(event: Event)
  {
    this.actionEvent.emit({action: 'onSubmitFormTypeSelection', params: [event]});
  }
  onSubmitTableModal(event: Event)
  {
    this.actionEvent.emit({action: 'onSubmitTableModal2', params: [{
      reqTabBorder: this.reqTabBorder, 
      reqTabHead: this.reqTabHead,
      txtTabColumns: this.txtTabColumns,
      txtTabRows: this.txtTabRows,
      controlIndex: this.controlIndex
    }]});
  }
  onChangeTableBorder(event: any){
    this.reqTabBorder = event.currentTarget.checked;
  }
  onChangeTableHeader(event: any){
    this.reqTabHead = event.currentTarget.checked;
  }
}
