import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Router, NavigationExtras } from '@angular/router';
import { environment } from '../../environments/environment';

declare interface RouteInfo {
  path: string;
  id: string;
  title: string;
  icon: string;
  class: string;
  state: any;
  selected: false;
  subItems?: RouteInfo[];  
}
declare interface RouteSet {
  title: string;
  routes: RouteInfo[];
}

@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css'],
  providers: [DeviceUtil]
})
export class SidenavBarComponent implements OnInit,AfterViewInit {
  @Input()
  menuItems: RouteSet[] = [];
  userFullName: string;
  user: any;
  url: any;
  count:boolean = false;
  isGlobal:boolean = false;
  stateData:any;
  constructor(public deviceUtil: DeviceUtil, private _router:Router) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }
  ngOnInit() {
    this.isGlobal = (environment.appId === 'global')?true:false;
      this.user = this.deviceUtil.findPrimaryUser();
      //console.log(this.user)
      if(!this.user)
        return;
      if (!this.user.Image || this.user.Image === '' || this.user.Image === null) {
        this.url =  './assets/images/avatar.png';
      }
      else {
        this.url = 'data:image/png;base64,' + this.user.Image;
      }
      if(this.deviceUtil.isPatient() || this.deviceUtil.isDoctorApp()){
        this.userFullName = this.user.Firstname || this.user.FIRSTNAME;  
      }else{
        this.userFullName = this.user.CUST_NAME;
      }
  }
  isShowProfile(){
    return this.userFullName && this.userFullName !== '';
  }
  ngAfterViewInit() {
  }
  clearMenuItems(){
    this.menuItems.forEach((element: RouteSet) => {
      element.routes.forEach((item: any) => {
        if (item.selected === true){
          item.selected = false;
          return;
        }
      });
    });
  }
  addActiveMenu(id: string){
    this.menuItems.forEach((element: RouteSet) => {
      element.routes.forEach((item: any) => {
        if (item.id === id && item.selected !== true){
          item.selected = true;
        }else{
          item.selected = false;
        }
      });
    });
  }
  setActiveMenu(menu: any)
  {
    this.deviceUtil.addSessionData('TEMPLATE', menu.title);
    this.clearMenuItems();
    menu.selected = true;
    if(menu.id === 'home'){
      if(environment.appId.startsWith('apps.')){
        let found = this.menuItems.findIndex((item:any)=> item.title === 'mnuTemplate');
        this.menuItems.splice(found, 1);
        let foundMenu = this.menuItems.find((item:any)=> item.title === 'Dashboard');
        if(foundMenu){
          let foundIdx = foundMenu.routes.findIndex((item:any)=>item.id === 'appdetails');
          foundMenu.routes.splice(foundIdx, 1);
          let designerIdx = this.menuItems.findIndex((item:any)=> item.title === 'Designer');
          if(designerIdx > -1)
            this.menuItems.splice(designerIdx, 1);
        }
      }else{
        let menuSet:any = this.deviceUtil.getGlobalData('app-dept-menu');
        if(menuSet && menuSet.length > 0){
          let found = this.menuItems.findIndex((item:any)=> item.title === 'Drawing Board');
          //this.menuItems.splice(found, 1);
          if(found)
            this.deviceUtil.fetchBuilderMenu(this.menuItems, found, true, true);        
          menuSet.forEach((mItem:any)=>{
            found = this.menuItems.findIndex((item:any)=> item.title === mItem.DEPTNAME);
            if(found > -1)
            this.menuItems.splice(found, 1);
          });
        }
      }
    }else if(menu.id === 'logout'){
      this.deviceUtil.logout();
    }
  }
  navigateToProfile(){
    let isDoctor = this.deviceUtil.isDoctorApp();
    if(isDoctor)
      return;
    this.user = this.deviceUtil.findPrimaryUser();
    const navigationExtras: NavigationExtras = {
      state: {
        userid: this.user.mobileNo,
        workQueue: false,
        isDoctor: isDoctor,
        services: 10,
        code: '003'
      }
    };
    this._router.navigate(['/registration'], navigationExtras);
  }
}
