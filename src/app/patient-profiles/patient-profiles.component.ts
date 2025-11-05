import { DeviceUtil } from './../utils/DeviceUtil';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
@Component({
  selector: 'app-patient-profiles',
  templateUrl: './patient-profiles.component.html',
  styleUrls: ['./patient-profiles.component.css']
})
export class PatientProfilesComponent implements OnInit {

  @Input() profiles : any = [];
  @Output() ProfileSelectEvent = new EventEmitter<any>();

  constructor(private deviceUtil: DeviceUtil) { }

  ngOnInit(): void {
    let patients = this.deviceUtil.getGlobalData("UserProfileData");
    // this.profiles = patients.filter((item:any)=>{
    //   return item.Relation !== '000';
    // });
    this.profiles = patients;
  }

  makeprofileSelected(event: Event, profile: any)
  {
    event.preventDefault();
    this.profiles.forEach((element: any) => {
      if (element.PatientTrno === profile.PatientTrno)
      {
        element.selected = element.selected === true ? false : true;

        if (element.selected === true) {
        }
        else
        {
        }
      }
      else
      {
        element.selected = false;
      }
    });
    this.ProfileSelectEvent.emit(profile);
  }

  hidePrimaryProfile(disableStatus: boolean)
  {
    this.profiles = this.deviceUtil.getGlobalData("UserProfileData");
    const item = this.profiles.find((x: any) => x.Relation === '000');
    if(item!=null && item!=undefined)
        item.canHide = disableStatus;
  }

  deselectProfile(trnumber: string, disableStatus: boolean)
  {
    this.profiles = this.deviceUtil.getGlobalData("UserProfileData");
    const item = this.profiles.find((x: any) => x.PatientTrno === trnumber);
    if(item!=null && item!=undefined)
        item.selected = disableStatus;
  }

  deselectAllProfile()
  {
    this.profiles = this.deviceUtil.getGlobalData("UserProfileData");
    this.profiles.forEach((element: any) => {
      element.selected = false;
    });
  }

}
