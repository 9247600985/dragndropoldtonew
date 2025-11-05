import { DeviceUtil } from './../utils/DeviceUtil';
import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router, RouterState, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

export class Jumbotron {
  name: string;
  specialiation?: string;
  img?: string;
  icon?: string;
  stateData: any;
}

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements OnInit, OnDestroy {
  stateData:any;
  @Input() data: Jumbotron;
  @ViewChild('backBtn') myInputVariable: ElementRef;
  @Output() actionEvent = new EventEmitter<any>();
  constructor(private router: Router, private deviceUtil:DeviceUtil, private location:Location) {
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.deviceUtil.addRouteStack(this.location);
  }

  onClickBack(event:any)
  {
    this.actionEvent.emit(event);
    //this.deviceUtil.backRoute(this.router);
  }
}
