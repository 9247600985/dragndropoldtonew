import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { AlertService } from './alert.service';

//declare var $: any;

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  isShowAlert:boolean;
  @Input() message: string;  
  @Input() id: string; 
  @ViewChild('myInput') myInputVariable: ElementRef;
  @Output() actionEvent = new EventEmitter<any>();
  callback:CallableFunction;
  constructor(private service:AlertService) { 
    service.changeEmitted$.subscribe(
      (result:any) => {
        if(result && result.type === 'alert'){
          if(result.message){
            this.message = result.message;
            this.id = result.id;
            this.callback = result.callback;
          }else{
              this.message = '';
          }
          this.isShowAlert = true;
        }
      });
  }

  ngOnInit(): void {

  }
  navigateTo(value: Number)
  {
    //this.dismiss();
    this.message = "";
    let event:any = {};
    event.value = value;
    event.id = this.id;
    this.actionEvent.emit(event);
    if(this.callback)
      this.callback(event);
    this.isShowAlert = false;
  }
  show(){
    //this.isShowAlert = true;
    //$('#alertPopup').show();
  }
  dismiss(){
    //this.isShowAlert = false;
    //$('#alertPopup').hide();
  }
  
  isDisplayAlert(){
    return this.message && this.message !== '';
  }
}
