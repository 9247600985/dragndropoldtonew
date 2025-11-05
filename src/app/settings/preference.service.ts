import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

constructor(private http:GatewayService) { }

  getPreferences(mobile:string, successCallback:CallableFunction){
    return this.http.get('/api/v1/master/getPreferences?userId='+mobile, this.http.getUrlHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }      
    }); 
  }
  addPreferences(prefData:any, successCallback:CallableFunction){
    return this.http.post('/api/v1/master/addPreferences', prefData, this.http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }      
    }); 
  }
}
