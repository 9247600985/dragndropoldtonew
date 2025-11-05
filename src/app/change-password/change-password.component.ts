import { ToastComponent } from './../toast/toast.component';
import { DeviceUtil } from './../utils/DeviceUtil';
import { RegistrationService } from './../registration/registration.service';
import { CustomValidators } from './../registration/custom-validators';
import { FormGroup, Validators, FormBuilder, AbstractControl, FormControl, FormGroupDirective } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  jumbotron = {
    name: '',
    // specialiation: '',
    // img: '',
    // stateData: ''
  };
  form: FormGroup;
  fieldTextType: boolean;
  submitted = false;
  stateData:any;

  constructor(private _router:Router,private deviceUtil: DeviceUtil, private formBuilder: FormBuilder, private reg: RegistrationService, private toast: ToastComponent) { 
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      OldPassword: ['', [Validators.required]],
      Password: ['', [Validators.required,
        Validators.minLength(6),
        // 1. check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        // 2. check whether the entered password has a lower-case letter
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
      ]],
      ConfirmPassword: ['', [Validators.required]],
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
    // return g.get('Password').value === g.get('ConfirmPassword').value
    //    ? null : {'mismatch': true};
    return this.form.value.Password === this.form.value.ConfirmPassword
       ? null : {'mismatch': true};
  }

  get f(){ return this.form.controls; }

  togglePassword()
    {
      this.fieldTextType = !this.fieldTextType;
    }

  onNavigateBack(event:any){
    this.jumbotron = {
      name: 'Change Password'
    };
  }

  onSubmit()
  {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let userid = this.deviceUtil.getUserId();
    if(!userid){
      userid = this.stateData.userid;
    }
    this.reg.changePassword(userid, this.form.value.Password, (result:any)=>{
      if(result.status === 0 || (result.results && result.results.length > 0)){
        this.toast.showSuccess('Password Changed');
      }
    });

  }

}
