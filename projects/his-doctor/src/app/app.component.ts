import { Component, OnInit, OnDestroy, NgZone, Pipe } from '@angular/core';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { DeviceUtil } from './utils/DeviceUtil';
import { ToastComponent } from './toast/toast.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'auth-app';
  displayLoader:boolean = true;
  public onlineEvent: Observable<Event>;
    public offlineEvent: Observable<Event>;
    public subscriptions: Subscription[] = [];
    constructor(private deviceUtil:DeviceUtil, private toast:ToastComponent, private activeRoute:ActivatedRoute, private zone: NgZone, private router:Router, private gateway:HttpClient){
      this.activeRoute.queryParams.subscribe(params => {
        this.deviceUtil.setDeepLinkData(params);        
      });
    }
    ngOnInit(): void {
      this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');
        this.subscriptions.push(this.onlineEvent.subscribe(event => {          
          this.toast.showSuccess('app_online');
        }));
        this.subscriptions.push(this.offlineEvent.subscribe(e => {
          this.toast.showError('app_offline');
        }));
        //this.deviceUtil.loadServices(this.gateway);
    }
    ngOnDestroy(): void {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

}
@Pipe({name: 'safeHtml'})
export class Safe {
  constructor(private sanitizer:DomSanitizer){}

  transform(html:any) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}