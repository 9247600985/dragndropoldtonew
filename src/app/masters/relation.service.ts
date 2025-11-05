import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { Masters } from './masters';

@Injectable({
  providedIn: 'root'
})
export class RelationService {

constructor(private _http: GatewayService) { }
loadRelations(successCallback:CallableFunction = this._http.getSuccessCallback, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
  return this._http.get<Masters>('/api/v1/master/getRelations', this._http.getJsonHeaders()).subscribe((result)=>{
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
