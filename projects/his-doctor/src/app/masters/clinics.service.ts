import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicsService {

  constructor(private http: GatewayService) { }

  getClinics(successCallback:CallableFunction, failureCallback:CallableFunction = this.http.getErrorCallback.bind(this.http))
  {
    return this.http.get('/api/v1/clinic/getClinics', this.http.getUrlHeaders()).subscribe((result) => {
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

  getDiagCenters(successCallback:CallableFunction, failureCallback:CallableFunction = this.http.getErrorCallback.bind(this.http))
  {
    return this.http.get('/api/v1/diagnostic/getDiagCenters', this.http.getUrlHeaders()).subscribe((result) => {
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

  getDiagnostics(successCallback:CallableFunction, failureCallback:CallableFunction = this.http.getErrorCallback.bind(this.http))
  {
    return this.http.get('/api/v1/master/getDiagnostics', this.http.getUrlHeaders()).subscribe((result) => {
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
