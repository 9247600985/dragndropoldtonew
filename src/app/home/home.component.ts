import { BannerService } from '../masters/banner.service';
import { ClinicsService } from './../masters/clinics.service';
import { Symptoms } from './../doctor-appointment/vitals';
import { SymptomsService } from './../symptoms/symptoms.service';
import { SpecialityService } from './../masters/speciality.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Router } from '@angular/router';
import { ConsultationService } from '../my-consultations/consultation.service';
import { DoctorService } from '../masters/doctor.service';
import { ToastComponent } from '../toast/toast.component';
import { AlertComponent } from '../alert/alert.component';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  userId: string;

  secondOpBanner: any = [];
  appointmentBanner: any = [
    // {banner: '../../assets/images/banners/bannerAppointment.jpeg', path: '/specialty', state: {id: ''}},
    // {banner: '../../assets/images/banners/bannerSecondOpenion.jpeg', path: '/second-openion', state: {isFromSecondOpenion: true}},
    // {banner: '../../assets/images/banners/bannerAppointment3.jpeg', path: '/specialty', state: {id: ''}},
    // {banner: '../../assets/images/banners/bannerSecondOpenion1.jpeg', path: '/second-openion', state: {isFromSecondOpenion: true}},
  ];
  diagBanner: any = [
    //{banner: '../../assets/images/banners/bannerLabTest.jpeg', path: '/diagnostics', state: {id: ''}},
  ];

  favdocs:any[];
  card:any=[];
  message:string;
  stateData:any;
  title: string;
  specialization: any = [];
  symptoms: any = [];
  clinics: any = [];
  diagnosis: any = [];

  constructor(private _router: Router,
    private deviceUtil:DeviceUtil,
    private toast:ToastComponent,
    private _doctor:DoctorService,
    private alert:AlertComponent,
    private consultation:ConsultationService,
    private speciality: SpecialityService,
    private symptom: SymptomsService,
    private clinic: ClinicsService,
    private banner: BannerService,
    ) {
      let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
     }

  ngOnInit() {
    const userId = this.deviceUtil.getUserId();
    this.getConsultations();
    this.getFavDoctors();
    this.getClinics();
    this.getDiagnostics();
    /*this.deviceUtil.showHeaderNavbar();
    this.deviceUtil.showFooterBar();*/
    this.deviceUtil.addActiveMenu('home');

    this.getSpecialities();
    this.getSymptoms();

    this.clearLocalStorage();
    this.getBannerImages();
  }

  getBannerImages()
  {
    this.banner.getBanners((result: any) => {
      if(result.status === 0 && result.results.length > 0)
      {
        this.diagBanner = result.results.filter((x: any) => x.type === 'diagnostic' || x.type === 'prescription');
        this.appointmentBanner = result.results.filter((x: any) => x.type === 'appointment');
        this.secondOpBanner = result.results.filter((x: any) => x.type === 'secondOpenion');
      }
    });
  }

  clearLocalStorage()
  {
    localStorage.removeItem('isFromSecondOpenion');
    localStorage.removeItem('speciality');
  }

  ngAfterViewInit()
  {
    $('.scrollableDiv').height($(window).height() - $('nav').height() - 100);
  }

  getClinics()
  {
    this.clinic.getClinics((result: any) => {
      if (result.status === 0 && result.results.length > 0){
        this.clinics = result.results.filter((imageItem: any) => {
          imageItem.id = imageItem.clinicId;
          imageItem.title = imageItem.clinicName;
          imageItem.path = '/specialty';
          imageItem.icon = imageItem.img;
          return true;
        });
      }
    });
    //this.title = 'doct_specialty';
  }

  getDiagnostics()
  {
    let data: any = [];
    this.clinic.getDiagnostics((result: any) => {
      if (result.status === 0 && result.results.length > 0){
        data = result.results.filter((imageItem: any) => {
          imageItem.path = '/diagnostic-request';
          imageItem.icon = imageItem.img;
          return true;
        });

        this.diagnosis = data.splice(0, 9);
      }
    });
    //this.title = 'doct_specialty';
  }

  getSpecialities()
  {
    this.speciality.loadSpecialities((result:any)=>{
      if (result.status === 0 && result.results.length > 0){
        this.specialization = result.results.filter((imageItem:any)=>{
          imageItem.path = '/doctors';
          return true;
        });
      }
    });
    this.title = 'doct_specialty';
  }

  getSymptoms()
  {
    let data: any = [];
    this.symptom.loadSymptoms((result: any) => {
      if (result.status === 0 && result.results.length > 0){
        data = result.results.filter((imageItem: any) => {
            imageItem.id = imageItem.symptomCode;
            imageItem.title = imageItem.symptomName;
            imageItem.path = '/doctors';
            return true;
        });
        this.symptoms = data.splice(0, 20);
      }
    });
    this.title = 'symptoms';
  }

  getConsultations()
  {
    let mobile = this.deviceUtil.getUserId();
    this.consultation.getConsultations(mobile,'pending', (result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this.card.push(result.results[0]);
      }
    });
  }
  getFavDoctors(){
    let userid = this.deviceUtil.getUserId();
    this._doctor.getWishList(userid, (result: any) => {
      if(result.status === 0 && result.results.length > 0){
        this.favdocs = result.results.filter((imageItem:any) => {
          imageItem.leftAction = 'viewmore';
          imageItem.leftPath = 'doctorprofile';
          imageItem.rightAction = 'bookappt';
          imageItem.rightPath = 'appointment';
          return imageItem;
        });
        this.deviceUtil.setGlobalData('wishlistDocs', this.favdocs);
      }
    });
  }
  navigateRoute(event:any){
    if(event.index === 0){
      event.appointmentBooked = true;
      this._router.navigate(['/appointment'], {state: event});
    }
    else if(event.index === 1){
      if(event.visitStatus.toLowerCase() === 'paid'){
        this._router.navigate(['/video-player'], {state:{meetingId: event.appointmentNo}});
      }else{
        this.toast.showError("Payment pending.");
      }
    }
    else if(event.index === 2){
      this.message = 'Do you want to Cancel?';
      this.alert.show();
    }
    else{
      this.message = 'Do you want to reschedule appointment?';
      this.alert.show();
    }
  }
  doAlertAction(event:any){

  }
  navigateDoctor(event:any){
    this._router.navigate(['/'+event.navPath+''], {state: { doctFee : event.fee, Specialization: event.speciality, doctorName: event.name, doctorId: event.id, icon: event.img}});
  }

  gotoLabTest(event: Event)
  {
    event.preventDefault();
    //this._router.navigate(['/diagnostic-request']);
    //const userId = this.deviceUtil.getUserId();
    this._router.navigate(['diagnostics'], {state: {id: this.userId}});
  }

  gotoConsult(event: Event)
  {
    event.preventDefault();
    this._router.navigate(['/consult-now'], {state: {id: ''}});
  }

  gotoSpecialities(event: Event)
  {
    event.preventDefault();
    this._router.navigate(['/specialty'], {state: {id: ''}});
  }

  gotoSecondOpenion(event: Event)
  {
    event.preventDefault();
    this._router.navigate(['/second-openion'], {state: {isFromSecondOpenion: true}});
  }
}
