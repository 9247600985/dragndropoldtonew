import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  @Input() patient: any = {};
  @Output() actionEvent = new EventEmitter<any>();

  constructor() {
    
  }

  ngOnInit(): void {
    if(!this.patient)
      this.patient = {};
    this.patient.img = '../assets/images/avatar.png'
  }

  onClickBack(event:any)
  {
    this.actionEvent.emit(event);
    //this.deviceUtil.backRoute(this.router);
  }

}
