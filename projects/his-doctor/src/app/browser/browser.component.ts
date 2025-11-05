import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DeviceUtil } from '../utils/DeviceUtil';


declare var $: any;
@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {
  externalWindow :any;
  params:any;
  stateData: any;
  urlSafe: SafeResourceUrl;
  
  constructor(private _router: Router, private activeRoute:ActivatedRoute, private deviceUtil:DeviceUtil,    
    public sanitizer: DomSanitizer) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
      this.activeRoute.queryParams.subscribe(params => {
        this.params = params;
      });
  }
  ngOnInit() {
    if(!this.stateData && !this.params.deeplink){
      this._router.navigate(['/']);
      return;
    }
    let tokenInfo = this.deviceUtil.getSessionData('TokenInfo');
    if(!tokenInfo){
      this._router.navigate(['/login'], { state: {callbackRoute: 'browser', params: this.params}});
    }
    if(!this.params.deeplink)
      this.params = this.stateData.params;   
      if(this.params.paymentURL)  
        this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.params.paymentURL);
    /* too early to issue http post to the iFrame loaded from this.demoEndpoint */
  }

  myLoadEvent(){
    console.log("myLoadEvent called.");
  }
}
