import { GatewayService } from './../gateway/gateway.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: GatewayService) { }

  getBanners(successCallback:CallableFunction, failureCallback:CallableFunction = this.http.getErrorCallback.bind(this.http))
  {
    return this.http.get('/api/v1/patient/getBanners', this.http.getUrlHeaders()).subscribe((result) => {
      try{
        successCallback(result);
      }catch (err){
        console.log(err.toString());
      }
      this.http.getSuccessCallback(result);
    }, (error) => {
      try{
        failureCallback(error);
      }catch (err){
        console.log(err.toString());
      }
      this.http.getErrorCallback(error);
    });
  }
}
