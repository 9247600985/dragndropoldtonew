import { ToastComponent } from './../toast/toast.component';
import { AutoFillComponent } from './../auto-fill/auto-fill.component';
import { Jumbotron } from './../jumbotron/jumbotron.component';
import { Router } from '@angular/router';
import { SymptomsService } from './../symptoms/symptoms.service';
import { DeviceUtil } from '../utils/DeviceUtil';
import { PatientProfilesComponent } from './../patient-profiles/patient-profiles.component';
import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css']
})
export class ConsultComponent implements OnInit, AfterViewInit {

  systems: any = [];
  symptoms: any = [];
  defSymptoms: any = [];
  trnumber: string;

  jumbotron: Jumbotron = {
    name: 'Consult Doctor',
    specialiation: '',
    img: '',
    icon: 'stethoscope',
    stateData: ''
  };

  constructor(private router: Router,
              private symptom: SymptomsService,
              private pProfile: PatientProfilesComponent,
              private deviceUtil: DeviceUtil,
              private auto: AutoFillComponent,
              private toast: ToastComponent
              ) { }

  ngOnInit(): void {
    this.getAllSymptoms();
    this.pProfile.deselectAllProfile();
    const profile = this.deviceUtil.getGlobalData('UserProfileData');
    const item = profile.find((x: any) => x.Relation === '000');
    this.trnumber = item.PatientTrno;
    this.pProfile.deselectProfile(item.PatientTrno, true);
  }

  ngAfterViewInit()
  {
    $('.symptom .selectedSymptoms').hide();
    if (this.deviceUtil.isMobile()){
      $('app-hdrnav-bar').hide();
      $('.fa-arrow-left').show();
      $('app-footer-bar').show();
    }
    else{
      $('app-hdrnav-bar').show();
      $('.fa-arrow-left').hide();
      $('app-footer-bar').hide();
    }
    //this.deviceUtil.showFooterBar();
  }

  getAllSymptoms()
  {
    this.symptom.getAllSymptoms((result: any) => {
      if (result.status === 0 && result.results.length > 0){
        this.systems = result.results;
        this.systems.forEach((element: any) => {
          element.symptoms.forEach((imageItem: any) => {
            this.symptoms.push(imageItem);
            imageItem.id = imageItem.symptomCode;
            imageItem.title = imageItem.symptomName;
            imageItem.path = '/doctors';
          });
        });

        // result.results.filter((imageItem: any) => {
        //     imageItem.id = imageItem.symptomCode;
        //     imageItem.title = imageItem.symptomName;
        //     imageItem.path = '/doctors';
        //     return true;
        // });
      }
    });
  }

  getSymptoms(event: any)
  {
    //this.defSymptoms.push(event);
    this.systems.forEach((element: any) => {
      element.symptoms.forEach((symptom: any) => {
        if (symptom.symptomCode === event.symptomCode)
        {
          if (symptom.selected === true){
            symptom.selected = false;
            const index = this.defSymptoms.findIndex((x: any) => x.symptomCode === event.symptomCode);
            this.defSymptoms.splice(index, 1);
          }
          else
          {
            this.defSymptoms.push(event);
            symptom.selected = true;
          }
        }
      });
    });

    // const system = this.systems.find((x: any) => x.system === event.system);
    // const symptom = system.filter((x: any) => x.symptomCode === event.symptomCode);
    // symptom.filter((element: any) => {
    //   element.selected = true;
    // });
  }

  makeprofileSelected($event: any)
  {
    this.trnumber = $event.PatientTrno;
    //console.log($event.PatientTrno);
  }

  removeItemfromSymptoms(event: Event, item: any)
  {
    event.preventDefault();
    let index = this.defSymptoms.findIndex((x: any) => x.symptomCode === item.symptomCode);
    this.defSymptoms.splice(index, 1);

    const system = this.systems.filter((x: any) => x.system === item.system);
    const symptom = system[0].symptoms.filter((x: any) => x.symptomCode === item.symptomCode);
    symptom.filter((element: any) => {
      element.selected = false;
    });
    index = this.auto.selectedSymptoms.findIndex((x: any) => x.symptomCode === item.symptomCode);
    this.auto.selectedSymptoms.splice(index, 1);
  }

  removeSymptom(event: any)
  {
    const index = this.defSymptoms.findIndex((x: any) => x.symptomCode === event.symptomCode);
    this.defSymptoms.splice(index, 1);
    const system = this.systems.filter((x: any) => x.system === event.system);
    const symptom = system[0].symptoms.filter((x: any) => x.symptomCode === event.symptomCode);
    symptom.filter((element: any) => {
      element.selected = false;
    });
  }

  selectSymptom(event: any, item: any)
  {
    event.preventDefault();
    this.systems.forEach((element: any) => {
      element.symptoms.forEach((symptom: any) => {
        if (symptom.symptomCode === item.symptomCode)
        {
          if (symptom.selected === true){
            symptom.selected = false;
            let index = this.defSymptoms.findIndex((x: any) => x.symptomCode === item.symptomCode);
            this.defSymptoms.splice(index, 1);

            this.auto.removeItemfromSymptoms(event, item);
            index = this.auto.selectedSymptoms.findIndex((x: any) => x.symptomCode === item.symptomCode);
            this.auto.selectedSymptoms.splice(index, 1);
          }
          else
          {
            this.defSymptoms.push(item);
            symptom.selected = true;
          }
        }
      });
    });
  }

  onNavigateBack(event: any){
    this.router.navigate(['/']);
  }

  gotoDoctors()
  {
    if(this.defSymptoms.length === 0)
    {
      this.toast.showError('Choose atleast one symptom to proceed');
      return;
    }
    this.router.navigate(['/doctors'], {state: { SpecializationId : this.defSymptoms[0].specializationId, Specialization: this.defSymptoms[0].specialization, icon:this.defSymptoms[0].icon, symptoms: this.defSymptoms, trnumber: this.trnumber }});
  }

}
