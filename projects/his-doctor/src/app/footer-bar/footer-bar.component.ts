import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
declare var $: any;

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.css']
})
export class FooterBarComponent implements OnInit {

  constructor(private _router: Router, private deviceUtil:DeviceUtil) { }

  ngOnInit() {
    if(this.deviceUtil.isMobile()){
      //this.deviceUtil.hideFooterBar();
    }
    //$('#consult').hide();
  }

  goToAction(event: Event)
  {
    event.preventDefault();
    this._router.navigate(['/main']);
  }

  goToConsult(event: Event)
  {
    this._router.navigate(['/specialty'], {state: {id: ''}});
  }

}
