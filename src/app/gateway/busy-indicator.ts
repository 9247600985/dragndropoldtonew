import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable, pipe } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BusyNotifierService } from './busy-notifier.service';
import { LoaderService } from '../loader/loader.service';
import { DeviceUtil } from '../utils/DeviceUtil';



@Injectable({
  providedIn: 'root'
})
export class BusyIndicator implements HttpInterceptor {

    constructor(private abns: BusyNotifierService, private loader:LoaderService, private deviceUtil:DeviceUtil) { }
  
    requestCounter = 0;
    private NO_NETWORK:any = {status: 1}; 
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(!this.deviceUtil.isNetWorkAvailable()){
        return this.addObservable(this.NO_NETWORK);
      } 
      this.beginRequest();
      return next.handle(req).pipe(
        
        finalize(() => {
          this.endRequest();
        })
      );
    }
  
    beginRequest() {
      this.requestCounter = Math.max(this.requestCounter, 0) + 1;
  
      if (this.requestCounter === 1) {
        this.loader.emitChange(true);
        this.abns.busy.next(true);
      }
    }
  
    endRequest() {
      this.requestCounter = Math.max(this.requestCounter, 1) - 1;
  
      if (this.requestCounter === 0) {
        this.abns.busy.next(false);
        this.loader.emitChange(false);
      }
    }
    addObservable<T>(message:any){
      let observable = new Observable<T>(observer => {
        if(message.error){
          this.loader.emitChange(false);
          observer.error(message);
        }else{
          this.loader.emitChange(false);
            observer.next(message);
            observer.complete();
        }
        
      });
      return observable;
    }
  }