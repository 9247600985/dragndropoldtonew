import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceUtil } from '../utils/DeviceUtil';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { LoaderService } from '../loader/loader.service';
@Injectable({
  providedIn: 'root'
})
export class GatewayService {  
  private NO_NETWORK:any = {status: 1};  
  constructor(private _http: HttpClient, private deviceUtil:DeviceUtil, private router:Router, private loader: LoaderService) { }
  addObservable<T>(message:any){
    let observable = new Observable<T>(observer => {
      if(message.error){
        observer.error(message);
      }else{
          observer.next(message);
      }
      observer.complete();
    });
    return observable;
  }
  appendObservable<T>(provider:Observable<T>){
    let observable = new Observable<T>(observer => {
      provider/*.pipe(retry(3), // you retry 3 times
      delay(1000), // each retry will start after 1 second,
      retryWhen(errors => errors.pipe(
        
      ))
      )*/.subscribe((data:any)=>{
        //this.loader.emitChange(false);
        //this.loader.dismiss();
        observer.next(data);
        observer.complete();
      }, (failure:any)=>{
        //this.loader.emitChange(false);
        //this.loader.dismiss();
        observer.error(failure);
        observer.complete();
      });
    });
    return observable;
  }
  get<T>(url: string, options?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }):Observable<T>{  
    /*if(!this.deviceUtil.isNetWorkAvailable()){
      return this.addObservable(this.NO_NETWORK);
    }      
    this.addToken(options);*/
    //url = this.getUrl(url);
    return this.appendObservable(this._http.get<T>(url, options));
  }
  post<T>(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>{
    if(!this.deviceUtil.isNetWorkAvailable()){
      this.addObservable(this.NO_NETWORK);
    }    
    url = this.getUrl(url);
    this.addToken(options);
    return this.appendObservable(this._http.post<T>(url, body, options));
  }
  postUpload<T>(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>{
    if(!this.deviceUtil.isNetWorkAvailable()){
      this.addObservable(this.NO_NETWORK);
    }    
    url = this.getUrl(url);
    this.addToken(options);
    return this.appendObservable(this._http.post<T>(url, body, options));
  }  
  put<T>(url: string, body: any | null, options?: {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<T>{
    if(!this.deviceUtil.isNetWorkAvailable()){
      this.addObservable(this.NO_NETWORK);
    }    
    url = this.getUrl(url);
    this.addToken(options);
    return this.appendObservable(this._http.put<T>(url, body, options));
  }
  delete<T>(url: string, options?: {
      headers?: HttpHeaders | {
          [header: string]: string | string[];
      };
      observe?: 'body';
      params?: HttpParams | {
          [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
  }): Observable<T>{
    if(!this.deviceUtil.isNetWorkAvailable()){
      this.addObservable(this.NO_NETWORK);
    }    
    url = this.getUrl(url);
    this.addToken(options);
    return this.appendObservable(this._http.delete<T>(url, options));
  }
  patch<T>(url: string, body: any | null, options?: {
      headers?: HttpHeaders | {
          [header: string]: string | string[];
      };
      observe?: 'body';
      params?: HttpParams | {
          [param: string]: string | string[];
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
  }): Observable<T>{
    if(!this.deviceUtil.isNetWorkAvailable()){
      this.addObservable(this.NO_NETWORK);
    }    
    url = this.getUrl(url);
    this.addToken(options);
    return this.appendObservable(this._http.patch<T>(url, body, options));
  }
  getSuccessCallback(result:any){
    
  }  
  getErrorCallback(error:any){
  }
  addToken(options:any){
    //this.loader.emitChange(true);
    //this.loader.show();
  }
  getUrlHeaders(){
    let options = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        rejectUnauthorized: 'false',
        })
      }; 
      return options;  
  }
  getJsonHeaders(){
    let options = {
      headers: new HttpHeaders({
        "Accept": "application/json",
        'Content-Type':  'application/json',
        rejectUnauthorized: 'false',
        })
      }; 
      return options;
  }
  /*addJsonHeaders(serviceIndex:string){
    let options = {
      headers: new HttpHeaders({
        "Accept": "application/json",
        'Content-Type':  'application/json',
        'serviceIndex': serviceIndex,
        rejectUnauthorized: 'false',
        })
      }; 
      return options;
  }*/
  addJsonHeaders(hdrs:any){
    let baseHdrs:any = {
      "Accept": "application/json",
      'Content-Type':  'application/json',        
      rejectUnauthorized: 'false',
      };
      if(hdrs){
        for(let [key,value] of Object.entries(hdrs)){
          baseHdrs[key] = value;
        }
      }
    let options = {      
      headers: new HttpHeaders(baseHdrs)
      }; 
      return options;
  }
  getUrl(url:string){
    let contextPath = environment.appcontextpath;
    if(contextPath)
      url = contextPath+url;
      return url;  
  }
  reAuth(token:string){
    let body:string = "refresh_token="+token;    
    body += "&grant_type=refresh_token"
    body += "&client_id="+ environment.clientId;
    body += "&client_secret="+ environment.clientSecret;
    let url = '/oauth/token';
    url = this.getUrl(url);
    return this.appendObservable(this._http.post<any>(url, body, this.getUrlHeaders()));
  } 
}
