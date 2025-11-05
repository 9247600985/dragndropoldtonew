import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { Masters } from './masters';


@Injectable({
  providedIn: 'root'
})
export class SpecialityService {
 
constructor(private _http: GatewayService) { }

  loadSpecialities(successCallback:CallableFunction){
    return this._http.get<any>('/api/v1/doctor/getSpecializations', this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
    });  
  }
}
