import { CountryService } from './../masters/country.service';
import { Component, OnInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { LoaderComponent } from '../loader/loader.component';
declare var $: any;
@Component({
  selector: 'app-hdrnav-bar',
  templateUrl: './hdrnav-bar.component.html',
  styleUrls: ['./hdrnav-bar.component.css']
})
export class HdrnavBarComponent implements OnInit {

  country: any = {};
  constructor(private deviceUtil: DeviceUtil, private countryServ: CountryService, private loader:LoaderComponent) { }

  ngOnInit() {
    /*if(!this.deviceUtil.isMobile()){
      $('#menu-toggle').hide();
    }*/
    this.deviceUtil.resetRoute();
    //this.loader.dismiss();
   // this.getCountry();
  }

  getCountry()
  {
    const timezoneName = this.deviceUtil.getCurrentTimeZone();
      this.countryServ.loadCountryMobile((result: any) => {
        if (result.status === 0 && result.results.length > 0)
        {
          const countryCodeList = result.results;
          this.country = countryCodeList.find((item: any) => {
            return timezoneName.indexOf(item.countryName) > -1;
          });
        }
      });
  }
  isDisplayHeader(){
    return true;
  }
  isDisplayToggle(){
    return false;
  }

}
