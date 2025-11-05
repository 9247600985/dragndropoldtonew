import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css']
})
export class HeaderMenuComponent implements OnInit {

  constructor(private _router:Router, private deviceUtil:DeviceUtil) { }

  ngOnInit(): void {
  }
  logout(){
    let id = this.deviceUtil.getGlobalData("appTimeout");
    if(id){
      clearInterval(id);
    }
    this.deviceUtil.removeSessionData("TokenInfo");
    this._router.navigate(['/login']);
  }
  editRegister(){
    let userid = this.deviceUtil.getUserId();
    this._router.navigate(['/profile'], {state:{"userid": userid, isFromProfile:true, lblHeader: 'Modify Profile'}});
  }
}
