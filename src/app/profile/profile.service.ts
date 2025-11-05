import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private _http: GatewayService) { }

  addPatientProfile(data:any, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.post<any>('/api/v1/registration/registerPatient', data, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }      
    }, (error)=>{
      try{
        failureCallback(error);
      }catch(err){
        console.log(err.toString());
      }      
    });
    }

    updatePatientProfile(data:any, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
      return this._http.post<any>('/api/v1/registration/updatePatientProfile', data, this._http.getJsonHeaders()).subscribe((result)=>{
        try{
          successCallback(result);
        }catch(err){
          console.log(err.toString());
        }        
      }, (error)=>{
        try{
          failureCallback(error);
        }catch(err){
          console.log(err.toString());
        }        
      });
      }

      deletePatientProfile(trnumber:string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
        return this._http.delete<any>('/api/v1/registration/deactiviateUser?trnumber=' + trnumber, this._http.getJsonHeaders()).subscribe((result)=>{
          try{
            successCallback(result);
          }catch(err){
            console.log(err.toString());
          }
         
        }, (error)=>{
          try{
            failureCallback(error);
          }catch(err){
            console.log(err.toString());
          }
          
        });
        }
}
