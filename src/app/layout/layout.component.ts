import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DeviceUtil } from '../utils/DeviceUtil';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
  isSideBar = true;
  routeSet: any[] = [];
  stateData:any;
  
  constructor(private router: Router, public deviceUtil:DeviceUtil) {
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;     
  }

  isLoggedIn(){
    return true;
  }
  isSideNavBar(){
    return this.isSideBar;
  }
  isRequired(){
    let status = false;
    status = this.deviceUtil.isMobile();
    status = status && !this.isSideBar;
    return status;
  }

  ngOnInit2(): void {    
    if (this.stateData && this.stateData.routeId && this.stateData.routeId.type === 'history'){
      this.router.navigate(['/mnMedicalHistory'], {state: this.stateData});
    }else{      
      this.deviceUtil.fetchTopMenuSet(this.routeSet, true);
      this.deviceUtil.fetchBuilderMenu(this.routeSet); 
      this.deviceUtil.fetchBottomMenuSet(this.routeSet);
    }
  }
  ngOnInit(): void {
    let isDoctor;
    let consultFlag = this.stateData && this.stateData.routeId && this.stateData.routeId.type === 'history';
    let app = this.deviceUtil.getGlobalData('selectedApp');
    if(app && environment.appId === 'apps.'+app.APP_NAME){
        this.routeSet = [];        
        this.deviceUtil.fetchAppMenuSet(this.routeSet, true, app.isTemplates, app.isReports); 
        //this.deviceUtil.fetchBuilderMenu(this.routeSet);      
    }else{
      isDoctor = this.deviceUtil.isDoctorApp();
      if(isDoctor)
        this.deviceUtil.fetchTopMenuSet(this.routeSet, !consultFlag);
      else
        this.deviceUtil.fetchHomeMenuSet(this.routeSet, true);
        if(environment.appType && !consultFlag){
          this.deviceUtil.fetchBuilderMenu(this.routeSet, -1, true, true); 
        }      
    }
    if (consultFlag){      
      this.deviceUtil.fetchHistorySet(this.routeSet, true);
      let deptMenuSet = this.deviceUtil.getGlobalData('app-dept-menu');
      this.deviceUtil.appendMenuSet(this.routeSet, deptMenuSet, true);
      let tempId = deptMenuSet[0].tempId;
      this.stateData.tempId = tempId;
      this.router.navigate(['/examForm/'+tempId], {state: this.stateData});
    }else if (isDoctor && this.stateData && this.router.url === '/main'){
            
      this.router.navigate(['patient-details'], {state: this.stateData});
    }
    this.deviceUtil.fetchBottomMenuSet(this.routeSet);
    
  }
}