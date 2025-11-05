import { Masters } from './../masters/masters';
import { CountryService } from './../masters/country.service';
//import { CameraOptionsComponent } from './../camera-options/camera-options.component';
//import { SidenavBarComponent } from './../sidenav-bar/sidenav-bar.component';
import { PatientProfilesComponent } from './../patient-profiles/patient-profiles.component';
import { ToastComponent } from './../toast/toast.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { Router } from '@angular/router';
import { RelationService } from '../masters/relation.service';
import { DeviceUtil } from '../utils/DeviceUtil';
//import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { ProfileService } from './profile.service';
declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  addProfSelected: boolean = true;
  minDate: any;
  maxDate: any;
  url = '../assets/images/avatar.png';
  imageUrl: any;
  submitted = false;
  stateData: any;
  form: FormGroup;
  $Relations: any = [];
  title: string;
  btnSubmit: string = 'Register';

  countries: any = [];

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

  constructor(private country: CountryService,
              private formBuilder: FormBuilder,
              private _router:Router,
              private deviceUtil:DeviceUtil,
              private register:RegistrationService,
              private relation:RelationService,
              //private imgCropper:ImageCropperComponent,
              private http: HttpClient,
              private toast: ToastComponent,
              private serv: ProfileService,
              private pprofile: PatientProfilesComponent,
              //private camera: CameraOptionsComponent
              ) {
    let navigation = this._router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngAfterViewInit(): void {
    //$('.scrollableDiv').height($(window).outerHeight() - $('.jumbotron').outerHeight() - 20);
  }

  ngOnInit(): void {
    if (!this.stateData){
       this._router.navigate(['/']);
       return;
    }
    this.getCountries();
    this.relation.loadRelations((result: any)=>{
      if (result.status === 0 && result.results.length > 0){
        this.$Relations = result.results;
      }
    });
    this.form = this.formBuilder.group({
      PatientTrno: [null],
      FirstName: [null, Validators.required],
      LastName: [null, Validators.required],
      bloodGroup: ['', Validators.required],
      city: [''],
      country: [''],
      Email: [null, [Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      Dob: [null, Validators.required],
      Age: [null],
      Mobile: [null],
      Gender: ['', Validators.required],
      Relation: ['', Validators.required]
    });
    this.loadProfileData(this.stateData.isFromProfile);
    this.setMaxDate();
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

  isFromProfile(){
    return !this.stateData.isFromProfile;
  }
  loadProfileData(isFromProfile: boolean){
    if (isFromProfile){
      this.btnSubmit = 'Modify';
      this.title = this.stateData.lblHeader;
      let userid = this.deviceUtil.getUserId();
      this.register.getFullProfile(userid, (result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          let user = result.results.find((x: any) => x.Relation === '000');

          this.form.controls['PatientTrno'].setValue(user.PatientTrno);
          this.form.controls['FirstName'].setValue(user.FirstName);
          this.form.controls['LastName'].setValue(user.LastName);
          this.form.controls['Mobile'].setValue(user.Mobile);
          this.form.controls['bloodGroup'].setValue(user.bloodGroup);
          this.form.controls['city'].setValue(user.city);
          this.form.controls['country'].setValue(user.country);
          this.form.controls['Dob'].setValue(user.Dob);
          this.form.controls['Age'].setValue(user.Age);
          this.form.controls['Gender'].setValue(user.Gender);
          this.form.controls['Email'].setValue(user.Email);
          this.form.controls['Relation'].setValue(user.Relation);
          if(user.Image !== "" && user.Image != null)
            this.url = 'data:image/png;base64,' + user.Image;
          else
            this.url = '../assets/images/avatar.png';
        }
      });
    }
    else{
      this.title = this.stateData.lblHeader;
      this.pprofile.hidePrimaryProfile(true);
    }
  }
  findUserById(id:any){
    let profiles = this.deviceUtil.getGlobalData("UserProfileData");
    return profiles.find((item:any)=>{

    });
  }
  get f() { return this.form.controls; }

  onSubmit()
  {

        this.submitted = true;
        // stop here if form is invalid
        if (this.form.invalid) {

            return;
        }

        if (this.form.controls['PatientTrno'].value === null)
        {
          this.createProfile();
        }
        else
        {
          this.updateProfile();
        }

    /*let register = this.form.value;
    let userid = this.deviceUtil.getUserId();
    register.mobile = userid;
    register.PatientName = register.FirstName+' '+register.LastName;
    this.register.addAditionalRegister(register, (result:any)=>{
      if(result.status === 0 && result.results.length > 0){
        this._router.navigate(['/']);
      }
    });*/
  }

  createProfile()
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    var data = this.form.value;
    data.Mobile = this.deviceUtil.getUserId();
    data.Image = this.url;
    data.city = '';
    data.country = '';

    this.serv.addPatientProfile(data, (result:any) => {
      if(result.status === 0){
        this.toast.showSuccess('Profile added');
        this._router.navigate(['/']);
        //this.pprofile.getPatientProfiles();
      }
    });


    // this.http.post('http://183.82.146.20:8802/api/registration/registerPatient', JSON.stringify(data), httpOptions)
    // .subscribe((data:any) => {
    //   console.log(data);
    //   this.toast.showSuccess('Profile added.');
    // });
  }

  updateProfile()
  {
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };*/

    var data = this.form.value;
    data.Mobile = this.deviceUtil.getUserId();
    data.Image = this.url;

    this.serv.updatePatientProfile(data, (result:any) => {
      if(result.status === 0){
        this.toast.showSuccess('Profile updated');
        this._router.navigate(['/']);
      }
    });

    // this.http.post('http://183.82.146.20:8802/api/registration/updatePatientProfile', JSON.stringify(data), httpOptions)
    // .subscribe((data:any) => {
    //   console.log(data);
    //   this.toast.showSuccess('Profile updated.');
    // });
  }

  calculateAge()
    {
      let today = new Date();
      let tempDob = this.form.value.Dob;
            //tempDob = tempDob.includes('-') ? tempDob.split('-') : tempDob.split('/');
            //tempDob = tempDob[1] + '/' + tempDob[0] + '/' + tempDob[2];
            let dob = new Date(tempDob);

            if (today.getTime() >= dob.getTime()) {
                let timeDiff = Math.abs(today.getTime() - dob.getTime());
                let totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                let totalYears = Math.floor(totalDays / 365.2425);
                let totalMonths = Math.floor((totalDays % 365.2425) / 30);
                let remainingDays = Math.ceil((totalDays % 365.2425) % 30);
                this.form.controls["Age"].setValue(totalYears + '.' + totalMonths + '.' + remainingDays);
            }
    }

    onSelectFile(event: any) {
     /*if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event: any) => { // called once readAsDataURL is completed
          this.url = event.target.result;
          this.imageUrl = this.url;
        }
      }*/
    }

    triggerFileEvent()
    {
      //$('.scrollableDiv').hide();
      //this.imgCropper.show();

      //this.camera.show();

      //$('input[type="file"]').trigger('click');
    }
    doImageOptionAction(event:any){
      //this.imgCropper.show(event);
    }
    doImageAction(event:any){
      if(event!="" && event!=null && event!=undefined)
        this.url = event;
      $('.scrollableDiv').show();
    }

    makeprofileSelected($event: any)
    {
      if ($event.selected === true)
      {
        this.addProfSelected = false;
        this.form.controls['PatientTrno'].setValue($event.PatientTrno);
        this.form.controls['FirstName'].setValue($event.FirstName);
        this.form.controls['LastName'].setValue($event.LastName);
        this.form.controls['Mobile'].setValue($event.Mobile);
        this.form.controls['bloodGroup'].setValue($event.bloodGroup);
        this.form.controls['Dob'].setValue($event.Dob);
        this.form.controls['Age'].setValue($event.Age);
        this.form.controls['Gender'].setValue($event.Gender);
        this.form.controls['Email'].setValue($event.Email);
        this.form.controls['Relation'].setValue($event.Relation);
        if ($event.Image !== "" && $event.Image != null)
          this.url = 'data:image/png;base64,' + $event.Image;
        else
          this.url = '../assets/images/avatar.png';

          this.btnSubmit = 'Modify';
      }
      else
      {
        this.clearForm();
      }
    }

  getCountries()
  {
    this.country.loadCountryMobile((result: Masters) => {
      if (result.status === 0 && result.results.length > 0){
        this.countries = result.results;
      }
    });
  }

    addNewProfile(event: Event)
    {
      event.preventDefault();
      this.pprofile.deselectProfile(this.form.value.PatientTrno, false);
      this.clearForm();
      $('.scrollableDiv').animate({
        scrollTop: 0
      }, 200);
    }

    clearForm()
    {
      this.addProfSelected = true;
      this.form.reset();
        this.form.controls['Relation'].setValue('');
        this.form.controls['Gender'].setValue('');
        this.url = '../assets/images/avatar.png';
        this.submitted = false;
        this.btnSubmit = 'Register';
    }

    deleteProfile()
    {
      this.serv.deletePatientProfile(this.form.controls['PatientTrno'].value, (result:any) => {
        if(result.status === 0){
          this.toast.showSuccess('Profile deleted');
          this._router.navigate(['/']);
        }
      });
    }
}
