import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { Masters } from './masters';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(private _http: GatewayService) { }
  loadDoctors(SpecializationId:string, successCallback:CallableFunction){
    return this._http.get<Masters>('/api/master/v1/doctor/SpecializationId/'+SpecializationId, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
      this._http.getSuccessCallback(result);
    });
  }
  getDoctorProfiles(specialityId: string, successCallback:CallableFunction){
    return this._http.get<any>('/api/v1/doctor/getDoctorProfiles?specializationId='+specialityId, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
    });
  }  
  getDoctorProfile(doctorId: string, successCallback:CallableFunction){

    return this._http.get<any>('/api/v1/doctor/getDoctorFullProfile?doctId='+doctorId, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
    });
  }
  getFullProfile(mobile: string, successCallback:CallableFunction){
    return this.getDoctorByMobile(mobile, successCallback);
  }
  getDoctorByMobile(mobile: string, successCallback:CallableFunction){
    return this._http.get<any>("/api/v1/doctor?filter=mobileNo eq 'string|"+mobile+"'", this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }
    });
  }  
  addWishList(wishdata: any, successCallback:CallableFunction){
    return this._http.post<any>('/api/v1/favDoctor/addDoctorFavourite', wishdata, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }      
    });
  }
  getWishList(userid: string, successCallback:CallableFunction){
    return this._http.get<any>('/api/v1/favDoctor/getDoctorFavourites?userId='+userid, this._http.getJsonHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }     
    });
  }
  removeWishList(userid: string, doctorId:string, successCallback:CallableFunction){
    return this._http.delete<any>('/api/v1/favDoctor/removeDoctorFavourite?userId='+userid+'&doctorId='+doctorId, this._http.getUrlHeaders()).subscribe((result)=>{
      try{
        successCallback(result);
      }catch(err){
        console.log(err.toString());
      }      
    });
  }  
}
