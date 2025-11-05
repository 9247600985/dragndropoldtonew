import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';
declare var $: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Output() actionEvent = new EventEmitter<any>();
  @Input() data : any;
  constructor() { }

  ngOnInit(): void {
    //$('[data-toggle="tooltip"]').tooltip();
  }

  viewMore(item: any)
  {
    item.index = 0;
    this.actionEvent.emit(item);
  }

  navigateTo(item: any)
  {
    item.index = 1;
    this.actionEvent.emit(item);
  }
  cancelCall(item: any){
    item.index = 2;
    this.actionEvent.emit(item);
  }

  reSchedule(item: any)
  {
    item.index = 3;
    this.actionEvent.emit(item);
  }

  menuAction(event: any, item: any)
  {
    item.menuAction = event.menuAction;
    this.actionEvent.emit(item);
  }
}
