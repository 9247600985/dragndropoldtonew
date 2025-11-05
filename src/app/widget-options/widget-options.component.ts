import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-widget-options',
  templateUrl: './widget-options.component.html',
  styleUrls: ['./widget-options.component.css']
})
export class WidgetOptionsComponent implements OnInit {
  @Input()
  item:any;
  @Input()
  widgetActions:any;
  @Output() actionEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    
  }
  makeActiveControl(event:any, item:any){
    this.actionEvent.emit({action: 'makeActiveControl', params: [event, item]});
  }
  doWidgetAction(event:any, actonId:any, item:any){
    this.actionEvent.emit({action: 'doWidgetAction', params: [event, actonId, item]});
  }
}
