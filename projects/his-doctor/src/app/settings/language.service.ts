import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

constructor(private _http: GatewayService) { }
  loadLanguages(successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.get<any>('/api/v1/master/getLanguages', this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
      this._http.getSuccessCallback(result);
    }, (error)=>{      
      try{
        failureCallback(error);
      }catch(err){
        console.log(err.toString());
      }
      this._http.getErrorCallback(error);
    });
  }
}
