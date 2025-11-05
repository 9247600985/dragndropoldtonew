import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  @Input() message: string;
  @ViewChild('myInput') myInputVariable: ElementRef;
  @Output() actionEvent = new EventEmitter<Number>();

  constructor() { }

  ngOnInit(): void {
  }

  navigateTo(value: Number)
  {
    this.actionEvent.emit(value);
  }

}
