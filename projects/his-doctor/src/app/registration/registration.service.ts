import { Injectable } from '@angular/core';
import { GatewayService } from '../gateway/gateway.service';
import { UserList } from './UserList';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private _http: GatewayService) { }
  getUserProfile(userid:string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.get<UserList>("/api/v1/users?select=userid&filter=userid eq 'string|"+userid+"'", this._http.getJsonHeaders()).subscribe((result)=>{
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
  doRegister(regsterUser:any, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.post<UserList>('/api/v1/registration/registerUser', regsterUser, this._http.getJsonHeaders()).subscribe((result)=>{
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
  addAditionalRegister(regsterUser:any, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.post<UserList>('/auth/registration/registerPatient', regsterUser, this._http.getJsonHeaders()).subscribe((result)=>{
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
  getPatientProfile(userid:string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.get<UserList>('/api/patient/v1/userid/'+userid, this._http.getJsonHeaders()).subscribe((result)=>{
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
  getPatientByTrNum(trNum:string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.get<UserList>("/api/v1/patient?filter=TRNUMBER eq 'string|"+trNum+"'", this._http.getJsonHeaders()).subscribe((result)=>{
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
  getFullProfile(userid:string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.get<UserList>('/api/v1/registration/getPatientByMobile?mobile='+userid, this._http.getJsonHeaders()).subscribe((result)=>{
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
  changePassword(userId: string, Password: string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.post<any>('/api/v1/registration/changePassword', JSON.stringify({username: userId, password: Password}), this._http.getJsonHeaders()).subscribe((result)=>{
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

  forgotPassword(userId: string, Password: string, successCallback:CallableFunction, failureCallback:CallableFunction = this._http.getErrorCallback.bind(this._http)){
    return this._http.post<any>('/auth/registration/changePassword', JSON.stringify({username: userId, password: Password}), this._http.getJsonHeaders()).subscribe((result)=>{
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
