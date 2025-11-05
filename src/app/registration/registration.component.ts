import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from './custom-validators';
import { Router } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Jumbotron } from './../jumbotron/jumbotron.component';
import { Inserter } from '../utils/inserter';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  jumbotron: Jumbotron = {
    name: 'Registration',
    specialiation: '',
    img: '',
    icon: 'user',
    stateData: ''
  };

  maxDate: any;
  fieldTextType: boolean;
  registerForm: FormGroup;
  submitted = false;
  stateData: any;
  countries: any = [];
  isPatient:boolean = true;
  bloodGroups: any = [
    {id: 'A+', name: 'A+'},
    {id: 'A-', name: 'A-'},
    {id: 'B+', name: 'B+'},
    {id: 'B-', name: 'B-'},
    {id: 'AB+', name: 'AB+'},
    {id: 'AB-', name: 'AB-'},
    {id: 'O+', name: 'O+'},
    {id: 'O-', name: 'O-'}
  ];

  constructor(private _router:Router, private formBuilder: FormBuilder, private deviceUtil:DeviceUtil) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }
   ngOnInit() {
    if (!this.stateData){
      this._router.navigate(['/login']);
      return;
    }
    if(this.stateData.isDoctor){
      this.isPatient = false;
      this.deviceUtil.callApi("/api/v1/doctor?filter=mobileNo eq '"+this.stateData.userid+"'", 'get').subscribe((result:any)=>{
      /*let doctorService = this.injector.get(DoctorService);
      doctorService.getDoctorByMobile(this.stateData.userid,(result:any)=>{*/
        if(result.status === 0 && result.results.length > 0){
          let doctor:any = result.results[0];
          this.registerForm.controls['FirstName'].setValue(doctor.Firstname);
          this.registerForm.controls['FirstName'].disable();
        }
      });
    }else{
      this.isPatient = true;      
    }  
    this.registerInit();   
   }
  registerInit() {
    this.registerForm = this.formBuilder.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      //  Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      Dob: ['', Validators.required],
      Age: [''],
      Gender: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      Password: ['', [Validators.required,
        Validators.minLength(6),
        //Validators.pattern(/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])$/),

        // 1. check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // 2. check whether the entered password has a lower-case letter
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      ]],
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacy: [false, Validators.requiredTrue],
    });
    this.setMaxDate();
    if(!this.stateData.isDoctor)
      this.loadCountries();
  }

  onNavigateBack(event: any)
  {
    this._router.navigate(['/login']);
  }
  loadCountries(){
    this.countries = []; 
    this.deviceUtil.callApi("/api/v1/asiacountry", 'get').subscribe((result:any)=>{ 
      if(result.status === 0 && result.results.length > 0){
        result.results.forEach((item:any)=>{
          this.countries.push({'Country_ID': item.name, 'Country_Name': item.name});
        });
      }
    });
  }
  setMaxDate()
  {
    const dt = new Date();
    const date = dt.getDate();
    const month = dt.getMonth() + 1;
    this.maxDate = dt.getFullYear() + '-' +
            (month > 9 ? month : '0' + month) + '-' +
            (date > 9 ? date : '0' + date);
  }

  get f() { return this.registerForm.controls; }
    onSubmit() {

        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid && this.isPatient) {

            return;
        }
        if(!this.isPatient)
          this.doRegister();
        else
          this.doRegisterCustomer();
    }
    doRegister(){
      let defRole = 1;
      let userData = this.registerForm.value;
      userData.mobile = this.stateData.userid;
      userData.MOBILE = this.stateData.userid;
      userData.roleid = defRole;
      userData.PatientName = userData.FirstName;
      userData.Relation = '000';
      //userData.password = userData.Password;
      userData.CUST_NAME = userData['FirstName']+' '+userData['LastName'];
      userData.EMAIL = userData.Email;
     // userData.clientId = app.clientId;
     // userData.clientSecret = app.clientSecret;
      userData.data = userData.Password;
      let inserter = new Inserter(userData);
      this.deviceUtil.callApi('/api/v1/registration', 'post', inserter.get()).subscribe((result:any)=>{
      //this.gateway.post<any>('/api/v1/registration', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 || (result.results && result.results.length > 0)){
          this._router.navigate(['/login'], {state: {isRegister: true, userid:userData.mobile, passCode: userData.Password}});
        }else{
          this.deviceUtil.showToast('Registration Failed', true);
        }
      });
    }
    doRegisterCustomer(){
      
      let defRole = 1;
      let userData = this.registerForm.value;
      userData.mobile = this.stateData.userid;
      userData.MOBILE = this.stateData.userid;
      userData.roleid = defRole;
      userData.PatientName = userData.FirstName;
      userData.Relation = '000';
      userData.CUST_NAME = userData['FirstName']+' '+userData['LastName'];
      userData.EMAIL = userData.Email;
      userData.data = userData.Password;
      let custData = {
        CUST_NAME: userData['FirstName']+' '+userData['LastName'],
        MOBILE: this.stateData.userid,
        EMAIL : userData.Email,
        data: userData.Password
      };
      let inserter = new Inserter(custData);
      this.deviceUtil.callApi('/api/v1/addSecureCustomer', 'post', inserter.get()).subscribe((result:any)=>{
      //this.gateway.post<any>('/api/v1/addSecureCustomer', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 || (result.results && result.results.length > 0)){
          this._router.navigate(['/login'], {state: {isRegister: true, userid:userData.mobile, passCode: userData.Password}});
        }else{
          this.deviceUtil.showToast('Customer Registration Failed', true);
        }
      });    
    }
    togglePassword()
    {
      this.fieldTextType = !this.fieldTextType;
    }
    calculateAge()
    {
      let today = new Date();
      let tempDob = this.registerForm.value.Dob;
            //tempDob = tempDob.includes('-') ? tempDob.split('-') : tempDob.split('/');
            //tempDob = tempDob[1] + '/' + tempDob[0] + '/' + tempDob[2];
            let dob = new Date(tempDob);

            if (today.getTime() >= dob.getTime()) {
                let timeDiff = Math.abs(today.getTime() - dob.getTime());
                let totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                let totalYears = Math.floor(totalDays / 365.2425);
                let totalMonths = Math.floor((totalDays % 365.2425) / 30);
                let remainingDays = Math.ceil((totalDays % 365.2425) % 30);
                this.registerForm.controls["Age"].setValue(totalYears + '.' + totalMonths + '.' + remainingDays);
            }
    }
}
