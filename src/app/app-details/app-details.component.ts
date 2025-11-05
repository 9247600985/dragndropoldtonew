
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
import { ToastComponent } from '../toast/toast.component';
import { Jumbotron } from './../jumbotron/jumbotron.component';
import { HttpClient } from '@angular/common/http';
import { Inserter } from '../utils/inserter';
import { Updater } from '../utils/updater';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.css']
})
export class AppDetailsComponent implements OnInit {

  jumbotron: Jumbotron = {
    name: 'App Details',
    specialiation: '',
    img: '',
    icon: 'desktop',
    stateData: ''
  };
  
  registerForm: FormGroup;
  submitted = false;
  stateData: any;
  password:any;
  refreshToken:any;
  client_credentials:any;
  authorization_code:any;
  selectedApp:any;
  constructor(private _router:Router, private formBuilder: FormBuilder, private gateway:HttpClient, private deviceUtil:DeviceUtil, private toaster:ToastComponent) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
      
   }
   ngOnInit() {
    if (!this.stateData){
      this._router.navigate(['/login']);
      return;
    }
    this.registerInit();
    this.selectedApp = this.deviceUtil.getGlobalData('selectedApp');
    if(this.selectedApp && this.selectedApp.CREDENTIALS){
      let item = JSON.parse(JSON.stringify(this.selectedApp)); 
      item.password = item.grantType[0]?true:false;
      item.refreshToken = item.grantType[1]?true:false;
      item.client_credentials = (item.grantType.length > 2 && item.grantType[2])?true:false;
      item.authorization_code = (item.grantType.length > 3 && item.grantType[3])?true:false;
      //item.grantTypes = '';
      delete item.EMAIL;
      delete item.MOBILE;
      delete item.CUST_NAME;
      delete item.IS_DELETED;
      delete item.grantType;
      delete item.issuer;
      delete item.CUST_ID;
      delete item.IS_DEFAULT;
      delete item.CREDENTIALS;
      delete item.isTemplates;
      delete item.isReports;
      this.loadAppData(item);
    }
    
          
   }
   loadAppData(item:any){
    this.registerForm.setValue(item);
   }
  registerInit() {
    this.registerForm = this.formBuilder.group({
      APP_NAME: ['', Validators.required],
      accessTokenExpiry: ['', Validators.required],
      accessTokenSecret: ['', Validators.required],
      authURL: ['', Validators.required],      
      //IS_DEFAULT: ['', Validators.required],
      checkAuthURL: ['', Validators.required],
      password : [false, Validators.required],
      refreshToken : [false, Validators.required],
      client_credentials : [false, Validators.required],
      authorization_code : [false, Validators.required],      
      refreshTokenExpiry: ['', Validators.required],
      refreshTokenSecret: ['', Validators.required],
      serviceContext: ['', Validators.required]
    });
    
  }
  getFormValidationErrors() {
    Object.keys(this.registerForm.controls).forEach(key => {
  
    let controlErrors: any = this.registerForm.get(key)?.errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
  onNavigateBack(event: any)
  {
    this._router.navigate(['/']);
  }

  get f() { return this.registerForm.controls; }
    onSubmit() {

        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
          this.getFormValidationErrors();
            return;
        }
        let userData = this.registerForm.value;
        userData.grantType = [];
        if(this.registerForm.value.password){
          userData.grantType.push('password');
        }
        if(this.registerForm.value.refreshToken){
          userData.grantType.push('refresh_token');
        }
        if(this.registerForm.value.client_credentials){
          userData.grantType.push('client_credentials');
        }
        if(this.registerForm.value.authorization_code){
          userData.grantType.push('authorization_code');
        }        
        delete userData.password;
        delete userData.refreshToken;
        delete userData.client_credentials;
        delete userData.authorization_code;
        this.doRegister(userData);
    }

    doRegister(userData:any){
      if(!this.selectedApp || !this.selectedApp.CREDENTIALS){
        userData.CUST_ID = this.selectedApp.CUST_ID;
        userData.issuer = 'ThiragatiSoft';
        let inserter = new Inserter(userData);
        this.gateway.post<any>('/api/v1/registerGrpApp', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
          if(result.status === 0 || (result.results && result.results.length > 0)){
            this._router.navigate(['/login'], {state: {}});
          }else{
            this.toaster.showError('Registration Failed');
          }
        });
      }else{
        userData.grantType = this.selectedApp.grantType;
        userData.CUST_ID = this.selectedApp.CUST_ID;
        userData.CREDENTIALS = this.selectedApp.CREDENTIALS;
        let updater = new Updater(userData);
        updater.addFilter(new Filter(Expr.eq('CREDENTIALS', this.selectedApp.CREDENTIALS)))
        console.log(updater.get());
        this.gateway.put<any>('/api/v1/registerApp', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
          if(result.status === 0 || (result.results && result.results.length > 0)){
            this._router.navigate(['/login'], {state: {}});
          }else{
            this.toaster.showError('Registration Failed');
          }
        });        
      }
    }
}
