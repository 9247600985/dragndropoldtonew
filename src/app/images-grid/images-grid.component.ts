import { Component, OnInit, Input } from '@angular/core';
import {Location} from '@angular/common';
import { SpecialityService } from '../masters/speciality.service';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
declare var $: any;
@Component({
  selector: 'app-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.css']
})
export class ImagesGridComponent implements OnInit {
  @Input() title: string;
  @Input() imageItems: any[];
  transId:string;
  stateData:any;
  constructor(private router:Router,private _speciality:SpecialityService, private deviceUtil:DeviceUtil, private _location: Location) {
    /*let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;*/
   }

  ngOnInit() {
    /*$('app-hdrnav-bar').show();
    $('app-footer-bar').hide();
    this.deviceUtil.resetRoute();
    if(this.title === 'speciality'){
      this._speciality.loadSpecialities((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.imageItems = result.results.filter((imageItem:any)=>{
            imageItem.path = '/doctors';
            return true;
          });
        }
      });
      this.title = 'Doctor Speciality';
    }*/
  }
  navigateWithState(path:any){
    console.log(path);
  }
  ngAfterViewInit(): void{
    //this.deviceUtil.addRouteStack({path:this.router.routerState.snapshot.url, state:this.stateData});
  }
}
