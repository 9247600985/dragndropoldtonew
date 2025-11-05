import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from '../registration/custom-validators';
import { DeviceUtil } from '../utils/DeviceUtil';
declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  stateData: any;
  fieldTextType: boolean;
  otpTextType: boolean;
  form: FormGroup;
  submitted = false;
  buttonName = 'Submit OTP';
  isOtpValid = false;

  constructor(private deviceUtil:DeviceUtil, private formBuilder: FormBuilder, private router: Router) {
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }

  ngOnInit(): void {
    if (!this.stateData)
    {
      this.router.navigate(['/login']);
    }

    $('.passwordDiv').slideUp();

    this.form = this.formBuilder.group({
      Otp: ['', [Validators.required, Validators.minLength(6)]],
      Password: ['']
    });
  }

  get f(){ return this.form.controls; }

  onSubmit()
  {
  }

  changePassword()
  {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if(!this.isOtpValid){
      const passCode = this.form.value.Otp ;
      this.deviceUtil.callApi('/whatsapp/validateOTP', 'post', {
        "mobile": this.stateData.countryCode+this.stateData.userNum,
        "otpcode": passCode
        }).subscribe((authResult:any)=>{
      //this.otpservice.authenticate(passCode, this.stateData.countryCode, this.stateData.userNum, (authResult:any)=>{
          if (authResult.status === 0 && authResult.results.length > 0 && authResult.results[0].status === 0){
            //this.onSubmit();
            $('.passwordDiv').slideDown();
            this.buttonName = 'Change Password';
            this.isOtpValid = true;
            this.form.controls.Password.setValidators([
                Validators.required,
                Validators.minLength(6),
                CustomValidators.patternValidator(/\d/, { hasNumber: true }),
                CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true })
              ]);
            this.form.controls.Password.updateValueAndValidity();
          }else{
            (document.getElementById('otp') as HTMLInputElement).focus();
            this.deviceUtil.showToast('Invalid OTP', true);
        }
        });
      }
      else
      {
        //api call
        this.deviceUtil.callApi('/whatsapp/validateOTP', 'post', {username: this.stateData.countryCode + this.stateData.userNum, password: this.form.value.Password}).subscribe((result: any) => {
        //this.register.forgotPassword(this.stateData.countryCode + this.stateData.userNum, this.form.value.Password, (result: any) => {
          if (result.status === 0 && result.results.length > 0)
          {
            this.deviceUtil.showToast('Password reset successful');
            this.router.navigate(['/login']);
          }
        });
      }

    this.onSubmit();

  }

  togglePassword()
    {
      this.fieldTextType = !this.fieldTextType;
    }

    toggleOTP()
    {
      this.otpTextType = !this.otpTextType;
    }

}
