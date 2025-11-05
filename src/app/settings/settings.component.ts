import { ToastComponent } from './../toast/toast.component';
import { DeviceUtil } from './../utils/DeviceUtil';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { PreferenceService } from './preference.service';
import { RegistrationService } from '../registration/registration.service';
import { LanguageService } from './language.service';
declare var $:any;
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
   
  langSelected: boolean;
  speechRecognition: boolean;
  whatsappSelected: boolean;
  emailSelected: boolean;
  $preferredLang: any = [];
  langCodeSelected: string;
  isSecurityShow:boolean = false;
  isPersonalShow:boolean = false;
  password: any = {
    oldPassword: null,
    password: null,
    confirmPassword: null
  };

  fieldTextType: boolean;
  stateData:any;
  constructor(private toast: ToastComponent, private register: RegistrationService, private languages: LanguageService, private prefService:PreferenceService ,private router: Router, private location: Location, private deviceUtil: DeviceUtil) {
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }

  ngOnInit(): void {
    if(!this.stateData){
      this.router.navigate(['/main']);
      return;
    }
   if(this.stateData.routeId.title === "personal_settings"){
      this.isSecurityShow = false;
      this.isPersonalShow = true;
    }    
    if(this.stateData.routeId.title === "security"){
      this.isSecurityShow = true;
      this.isPersonalShow = false;
    } 
   // this.deviceUtil.showHeaderNavbar();
    if(this.isPersonalShow){
      let userid = this.deviceUtil.getUserId();
      this.prefService.getPreferences(userid, (result:any)=>{
        let preference:any;
        if(result.status === 0 && result.results.length > 0){
          preference = result.results[0];
        }        
        if(preference){
          this.loadLanguages(preference.defaultLang);
          let commPreference = preference.commPreference;
          if(commPreference){
            let coms = commPreference.split(',');
            this.whatsappSelected = coms.find((item:any)=>item === 'whatsapp');
            this.emailSelected = coms.find((item:any)=>item === 'email');
          }
        }else{   
          //let defLang = this.translate.getDefaultLang();     
          //this.loadLanguages(defLang);
        }
      });   
    }
    this.password = {
      oldPassword: null,
      password: null,
      confirmPassword: null
    };
  }

  loadLanguages(defaultCode: string){
    this.langCodeSelected = defaultCode;
    this.languages.loadLanguages((result: any) => {
      if (result.status === 0 && result.results.length > 0){
        //let avails = this.translate.getLangs();
        /*this.$preferredLang = result.results.filter((item:any)=>{
          return avails.find(lang=>lang===item.langcode);
        });*/
        //this.$preferredLang = result.results;
      }
    });
  }

  chooseSpeechRecognition(event: Event)
  {
    event.preventDefault();
    this.speechRecognition = !this.speechRecognition;
  }

  selectDefNotification(event: Event, lang: string)
  {
    event.preventDefault();
    if (lang === 'W')
    {
      this.whatsappSelected = !this.whatsappSelected;
    }
    else
    {
      this.emailSelected = !this.emailSelected;
    }
  }

  selectLanguage(event: Event, item: any)
  {
    this.langSelected = !this.langSelected;
    this.langCodeSelected = item.langcode;
  }

  onNavigateBack(event:any){
    this.location.back();
  }

  togglePassword()
  {
    this.fieldTextType = !this.fieldTextType;
  }
  isSecurity(){
    return this.isSecurityShow;
  }
  isPersonal(){
    return this.isPersonalShow;
  }
  addPreference(){    
    let commPref = '';
    if(this.whatsappSelected)
      commPref += "whatsapp";
    if(commPref !== '')
      commPref += ',';
    if(this.emailSelected)
    commPref += "email";
    let userid = this.deviceUtil.getUserId();
    let request = {
      "commPreference":commPref,
      "defaultLang":this.langCodeSelected,
      "userId":userid};
    
    this.prefService.addPreferences(request, (result:any)=>{
      if(result.status === 0 && result.results.length > 0){

      }
    });
  }
  changePassword(){
    let userId = this.deviceUtil.getUserId();
    this.register.changePassword(userId, (document.getElementById('password') as HTMLInputElement).value, (result: any) => {
      if(result.status === 0 && result.results.length>0)
      {
        this.toast.showSuccess('Password has changed');
        this.router.navigate(['/']);
      }
    });
  }
  toggle(index: number) {
    $('.accordion')[index].classList.toggle("active");
    var panel = $('.accordion')[index].nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  }
}
