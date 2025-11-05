import { ToastComponent } from './../toast/toast.component';
import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
declare var $: any;
export class Filter {
  isAppointment: boolean;
    isAppointmentDate: boolean;
    isVisitStatus: boolean;
  fromDate: string;
  toDate: string;
  appointmentNo: string;
  visitStatus: string;
};

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  filter = {
    isAppointment: false,
    isAppointmentDate: false,
    isVisitStatus: false,
    fromDate: '',
    toDate: '',
    appointmentNo: '',
    visitStatus: ''
  };

  @Input() visitStatus: any;
  @Output() actionEvent = new EventEmitter<Filter>();

  constructor(private toast: ToastComponent) { }

  ngOnInit(): void {

  }

  onSubmit()
  {
    if (this.filter.isAppointmentDate === true)
    {
      if (this.filter.fromDate === ''){
        this.toast.showError('From date is mandatory');
        $('#mdlFilter').modal('show');
        return;
      }
      if (this.filter.toDate === ''){
        this.toast.showError('To date is mandatory');
        $('#mdlFilter').modal('show');
        return;
      }
    }
    if (this.filter.isAppointment === true){
      if(this.filter.appointmentNo.trim() === '')
      {
        this.toast.showError('Enter appointment number');
        return;
      }
    }
    if (this.filter.isVisitStatus === true){
      if(this.filter.visitStatus === '')
      {
        this.toast.showError('Choose visit status');
        return;
      }
    }
    this.actionEvent.emit(this.filter);
  }

  changeCheckBox(id: string)
  {
    if (id === 'appNo')
    {
      if (this.filter.isAppointment === false){
        this.filter.appointmentNo = '';
      }
    }
    else if (id === 'appDate')
    {
      if (this.filter.isAppointmentDate === false){
        this.filter.fromDate = '';
        this.filter.toDate = '';
      }
    }
    else
    {
      if (this.filter.isVisitStatus === false){
        this.filter.visitStatus = '';
      }
    }
  }

  clearForm()
  {
    this.filter = {
      isAppointment: false,
      isAppointmentDate: false,
      isVisitStatus: false,
      fromDate: '',
      toDate: '',
      appointmentNo: '',
      visitStatus: ''
    };
    this.actionEvent.emit(this.filter);
  }

}
