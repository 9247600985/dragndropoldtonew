import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DeviceUtil } from '../utils/DeviceUtil';
import { ToastComponent } from '../toast/toast.component';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { faChevronRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  icons: any = {
    faChevronRight : faChevronRight,
    faEye: faEye,
    faEyeSlash: faEyeSlash
  }
  resizeListener:boolean = false;
  fieldTextType: boolean;
  showRegister: boolean = false;
  gender: string;
  userNum: string;
  countryCode: string;
  isOTP: boolean = false;
  stateData: any;
  currentCountryCd:string;
  countryCodeList: any[];
  //userData:any[];
  passwordSize:Number;
  isLoginProcessed:boolean = false;
  //slideImg:any;
  //slide1Img:any;
  //logoImg:any;
  mobileNo: string;
  message: string;
  callerId: string;
  loginHdrDesc:string = 'Consult super specialist doctors from best hospitals globally';
  loginHdrDescInfo:string = 'the minute you need to';
  loginMobileText:string = 'Enter whatsapp number';
  constructor(private _router:Router, private aRoute:ActivatedRoute, private deviceUtil:DeviceUtil, private toast:ToastComponent, private gateway:HttpClient) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }
   addLaunchData(){
    let launchData = this.deviceUtil.getSessionData('LaunchInfo');
    if(launchData){
      this.deviceUtil.removeSessionData('LaunchInfo');
      if(launchData.appId)
        environment.appId = launchData.appId;
      if(launchData.appType)
        environment.appType = launchData.appType;
      if(launchData.appcontextpath)
        environment.appcontextpath = launchData.appcontextpath;
        if(launchData.clientId){
          environment.clientId = launchData.clientId;
          environment.clientSecret = launchData.clientSecret;
        }
    }
   }
  ngOnInit(): void {
    $('.forgot').slideUp();
    $('.loginDiv i').css('-webkit-transform', 'scale(0)');
    $('.loginDiv .form-group:not(:first-child), .loginDiv .button').slideToggle();
    $('.loginDiv .form-group:nth-child(1) input').focus();
    let filter;
    if(!this.stateData){
      let tokenString = this.deviceUtil.getSessionData('TokenInfo');
      if (tokenString){
        let userKey = 'MOBILES';
        this.addLaunchData();
        let serviceUri:string = '/api/v1/registerUser';
        filter = new Filter(Expr.in(userKey, [tokenString.userid]));
        if(environment.appType === 'doctor'){
          userKey = 'mobileNo';
          serviceUri = '/api/v1/doctor';
          this.deviceUtil.setGlobalData('appType', 'doctor');
          filter = new Filter(Expr.eq(userKey, tokenString.userid));          
        }
        if(!tokenString.userid){
          this.callWithNoSession();
          return;
        }         
        this.gateway.get<any>(serviceUri+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result)=>{
          if (result.status === 0 && result.results.length > 0) {
            this.deviceUtil.setGlobalData('UserProfileData', result.results.filter((item:any)=>{
              if(item.CUST_NAME !== 'ThiragatiSoft')
                return item;
            }));
            this.deviceUtil.loadServices(this.gateway);
            this._router.navigate(['/main'], {state: {}});
            return;
          }
          this.callWithNoSession();
          return;
        }, err=>{
          this.callWithNoSession();
        });  
      }else{
        this.callWithNoSession();
      }      
    }else if(this.stateData.isRegister){
      this.callAuthenticateApp(this.stateData.userid, this.stateData.passCode);
    }else{
      this._router.navigate(['/main'], {state: this.stateData });
    }
  }
  callWithNoSession(){
    this.deviceUtil.removeSessionData('TokenInfo');
    this.loadCountries();
  }
  loadCountries(){
    this.countryCodeList = [{'mobile_code': 91, 'Country_Name': 'India'}];
    let timezoneName = this.deviceUtil.getCurrentTimeZone();
    let filter = new Filter(Expr.ne('mobile_code', 'null'));
    this.deviceUtil.callApi('/api/v1/asiacountry'+filter.get(), 'get').subscribe((result)=>{
    //this.gateway.get<any>('/api/v1/asiacountry', this.deviceUtil.getJsonHeaders()).subscribe((result)=>{
      if(result.results.length > 0){
        this.countryCodeList = [];
        result.results.forEach((item:any)=>{
          //this.countryCodeList.push({'mobile_code': item.callingCodes[0], 'Country_Name': item.name});
          this.countryCodeList.push({'mobile_code': item.mobile_code, 'Country_Name': item.Country_Name});
        });        
      }
      let country:any = this.countryCodeList.find((item:any)=>{
        return timezoneName.indexOf(item.Country_Name)>-1;
      });
      if(country){
        this.currentCountryCd = '+'+country.mobile_code;
      }
    });
  }
  loadCountries2(){
    let timezoneName = this.deviceUtil.getCurrentTimeZone();
    let filter = new Filter(Expr.ne('mobile_code', 'null'));
    this.gateway.get<any>('/api/v1/country'+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result)=>{
      if(result.status === 0 && result.results.length > 0){
        this.countryCodeList = result.results;
        let country:any = this.countryCodeList.find((item:any)=>{
          return timezoneName.indexOf(item.Country_Name)>-1;
        });
        if(country){
          this.currentCountryCd = '+'+country.mobile_code;
        }
      }
    });
  }
  changeCountry(event: any)
  {
    this.checkMobile(event);
  }
  checkMobile(event: any)
  {
    if(event.target.value.length === 10)
    {
      $('.loginDiv i').css('-webkit-transform', 'scale(1)');
      $('.loginDiv .icon').removeAttr('disabled');
      $('#userNum').blur();
    }
    else{
      $('.loginDiv i').css('-webkit-transform', 'scale(0)');
      //$('.loginDiv .submitDiv, .loginDiv .passwordDiv').css('-webkit-transform', 'scale(0)');
      (document.getElementById('userPassword') as HTMLInputElement ).value = '';
    }
  }

  sendOTP()
  {
    this.userNum = $('#userNum').val();
    if(this.userNum === '')
        return;

   let txtCountryCode = $('select option:selected').text().trim();
   this.userNum = $('#userNum').val();
   let filter;
   this.countryCode = txtCountryCode.replace('+', '');
    let userKey = 'MOBILES';
    let serviceUri = "/api/v1/registerUser";
    filter = new Filter(Expr.in(userKey, [this.countryCode+this.userNum]));
    if(environment.appType === 'doctor'){
      serviceUri = "/api/v1/users";
      userKey = 'USERID';
      filter = new Filter(Expr.eq(userKey, this.countryCode+this.userNum));
    }
    this.gateway.get<any>(serviceUri+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result)=>{ 
     if(result.status === 0 && result.results.length > 0){
      let CREDENTIALS = result.results[0].CREDENTIALS;
      if(CREDENTIALS){
        environment.clientId = CREDENTIALS.clientId;
        environment.clientSecret = CREDENTIALS.clientSecret;
      }
       $('.loginDiv .form-group:nth-child(2)').show();
       $('.loginDiv .form-group:nth-child(2) input').attr('placeholder', 'Enter Password');
       $('.loginDiv .form-group:nth-child(2) input').focus();
       $('.forgot').slideDown();
       this.passwordSize = 6;
       this.isLoginProcessed = false;
     }else{
      this.deviceUtil.showAlert('noReg', 'Mobile number not found. Do you want to register.?', this.doAlertAction.bind(this));
     }
   });
    $(".loginDiv input[type='password']").val('').focus();
  }

  doSendOtp()
  {    
    let filter = new Filter(Expr.eq('mobile', this.countryCode+this.userNum));
    this.gateway.post<any>('/api/v1/sendotp', {filter: filter.get(true)}, this.deviceUtil.getJsonHeaders()).subscribe((authResult:any)=>{
         if(authResult.status === 0){
           $(".loginDiv .form-group:nth-child(2)").show();
           $(".loginDiv .form-group:nth-child(2) input").attr("placeholder", "Enter OTP");
           $(".loginDiv .form-group:nth-child(2) input").focus();
           $('.forgot').slideUp();
           this.passwordSize = 6;
           this.isOTP=true;
           this.isLoginProcessed = false;
           this.toast.showSuccess('OTP for login has been sent to your whatsapp');
         }
       });
  }

  checkOTP(event:any)
  {
    if(event.target.value.length >= this.passwordSize)
    {
     // console.log("Hits "+event.target.value.length)
      $(".loginDiv .form-group:last-child").show();
    }
    else
    {
      $(".loginDiv .form-group:last-child").hide();
    }
  }
  login()
  {
    document.body.focus();
    setTimeout(()=>{
      this.login2();
    }, 300);
  }
  login2()
  {
    let passCode = $(".loginDiv .form-group:nth-child(2) input").val();
    if(!passCode || passCode === '')
        return;
    this.isLoginProcessed = true;
    if(this.isOTP){
      let filter = new Filter(Expr.eq('mobile', this.countryCode+this.userNum));
      filter.and(Expr.eq('otpcode', passCode));
      this.gateway.post<any>('/api/v1/verifyotp', {"filter": filter.get(true)}, this.deviceUtil.getJsonHeaders()).subscribe((authResult:any)=>{
        if(authResult.status === 0 && authResult.results.length > 0 && authResult.results[0].status === 0){
          this.callRegistration();
        }else{
           $(".loginDiv input[type='password']").val('').focus();
          //this.pwdError = 'Invalid OTP';
          this.toast.showError("Invalid OTP");
       }
      });
    }else{
      this.callAuthenticateApp(this.countryCode+this.userNum, passCode);
    }
  }
  callRegistration(){
    const navigationExtras: NavigationExtras = {
      state: {
        CountryMobileCode: this.countryCode,
        userid: this.countryCode + this.userNum,
        workQueue: false,
        isDoctor: this.deviceUtil.isDoctorApp(),
        services: 10,
        code: '003'
      }
    };
    this._router.navigate(['/registration'], navigationExtras);
  }
  callAuthenticateApp(userid:string, passCode:any){
    let body = this.deviceUtil.getAuthRequest(userid, passCode);
    this.gateway.post<any>('/oauth/token',body, this.deviceUtil.getUrlHeaders()).subscribe((authResult:any)=>{
      if(!authResult.code && authResult.access_token){
        authResult.userid = userid;
        this.deviceUtil.addSessionData("TokenInfo", authResult);
        this.isLoginProcessed = false;
        this.navigateToMain();
      }
    }, (error:any)=>{
      this.isLoginProcessed = false;
      this.toast.showError("Authentication failed");
      if(!this.countryCodeList || this.countryCodeList.length === 0)
        this.loadCountries();
    });
  }
  navigateToMain(){
    if(this.stateData && this.stateData.callbackRoute)
    this._router.navigate(['/'+this.stateData.callbackRoute], {state: this.stateData});
  else
    this._router.navigate(['/main']);
  }
  /*callAppConfig(){
    this.gateway.get<any>('/api/v1/registerGrpApp', this.deviceUtil.getUrlHeaders()).subscribe((result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        console.log(result)
        environment.appcontextpath = result.results[0].serviceContext;        
        let tokenData = this.deviceUtil.getSessionData("TokenInfo");
        tokenData.serviceContext = environment.appcontextpath;
        this.deviceUtil.addSessionData("TokenInfo", tokenData);
        this.navigateToMain();
      }
    });
  }*/
  addAppTokenRefresh(interval:any){
    let id = setInterval(() => {
      let tokenInfo = this.deviceUtil.getSessionData('TokenInfo');
      if(!tokenInfo){
        this._router.navigate(['/login']);
      }
      let userid = tokenInfo.userid;
      let request = this.deviceUtil.getReAuthRequest(tokenInfo.refresh_token);
      this.gateway.post<any>('/oauth/token',request, this.deviceUtil.getUrlHeaders()).subscribe((authResult:any)=>{
        this.deviceUtil.removeSessionData("TokenInfo");
        authResult.userid = userid;        
        this.deviceUtil.addSessionData("TokenInfo", authResult);
        //this._router.navigate(['/main']);
      });
      }, interval*60);
      this.deviceUtil.setGlobalData("appTimeout", id);
  }
  showRegistrationScreen(){
    this.showRegister=true;
    $(".header").css({'transform':'translateY(-150px)', '-webkit-transition':'all .5s ease-in-out'});
    $(".loginDiv").hide();
    $(".register .form-group:nth-child(1) input").focus();
  }
  togglePassword()
  {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleGender(value:string)
  {
    this.gender = value;
  }
  doRegister(){
    let defRole = 1;
    let passCode = $('#userPwd').val();
    let mobileNum =  this.countryCode+this.userNum;
    let userData = {
      PatientName: '',
      FatherName : 1,
      gender:0,
      email:'',
      region:'',
      addharNo: '',
			DOB: $('#dob').val(),
			PatinetTrno :'MR1',
			mobile: mobileNum,
			password : passCode,
			roleid : defRole,
			status : '0'
		}
    this.gateway.post<any>('/api/v1/registration/registerUser', userData, this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
    //this._regservice.doRegister(userData, (result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.callAuthenticateApp(passCode, mobileNum);
      }
    });
  }
  /*refreshAuth(passCode:string, countryCd:string, mobile:string){
    let tokenString:string = this.deviceUtil.getSessionData("TokenInfo");
    let tokenData = JSON.parse(tokenString);
    this._service.reAuth(tokenData.refresh_token, (result:any)=>{});
  }*/
  ngAfterViewInit(){

  }
  ngOnDestroy(){

  }

  forgotPassword()
  {
    if($('#userNum').val().length !== 10)
    {
      this.toast.showError('Enter valid mobile number');
      $('#userNum').focus();
      return;
    }

    let txtCountryCode = $('select option:selected').text().trim();
   this.userNum = $('#userNum').val();
   this.countryCode = txtCountryCode.replace('+', '');
   let filter = new Filter(Expr.eq('mobile', this.countryCode+this.userNum, 'string'));
   this.gateway.post<any>('/api/v1/sendotp', {"filter": filter.get()}, this.deviceUtil.getJsonHeaders()).subscribe((authResult:any)=>{
   // this._otpservice.generateAuth(this.countryCode, this.userNum, (authResult:AuthResponse)=>{
      if(authResult.status === 0){
        this.passwordSize = 6;
        this.isOTP = true;
        //this.deviceUtil.addKeyPadDownListener(this.login.bind(this));
        this.toast.showSuccess('OTP for reset password has been sent to your whatsapp');
        this._router.navigate(['/forgot-password'], {state: {passwordSize: this.passwordSize, countryCode: this.countryCode, userNum: this.userNum}});
      }
    });
  }

  doAlertAction(event: any)
  {
    if(event.id === 'noReg' && event.value === 1)
    {
      //this.doSendOtp();
      this.callRegistration();
    }
  }
}