import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { TemplatePreviewComponent } from '../template-preview/template-preview.component';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';
import { HttpClient } from '@angular/common/http';
import { ToastComponent } from '../toast/toast.component';


@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  searchText: string;
  globalPatients: any;
  patients: any = [];
  patHeaders: any = [];
  routeSet: any[] = [];
  isDisplayTable: boolean = false;
  visitStatus: any = [
    { name: 'Pending', value: 'Pending' },
    { name: 'InProgress', value: 'InProgress' },
    { name: 'Paid', value: 'Paid' },
    { name: 'Completed', value: 'Completed' },
    { name: 'Rejected', value: 'Rejected' },
    { name: 'Cancelled', value: 'Cancelled' },
  ];

  stateData: any;
  departments: any = [];

  currentUser: any = {};

  fromDate: any;
  toDate: any;

  constructor(private route: Router, private deviceUtil: DeviceUtil, private gateway: HttpClient, private toast: ToastComponent) {
    let navigation = this.route.getCurrentNavigation();
    if (navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    if (!this.stateData) {
      this.route.navigate(['/login']);
      return;
    }
    this.fromDate = this.setDate();
    this.toDate = this.setDate();
    this.loadMenus();
    this.loadAppts();
    this.getAllDepartments();
  }
  loadMenus() {
    this.deviceUtil.fetchTopMenuSet(this.routeSet, true);
    this.deviceUtil.fetchBuilderMenu(this.routeSet);
    this.deviceUtil.fetchBottomMenuSet(this.routeSet);
  }
  setDate() {
    let toDay = new Date();
    toDay.setMonth(toDay.getMonth());
    return toDay.toISOString().slice(0, 10);
  }
  loadAppts() {
    this.isDisplayTable = false;
    let doctor = this.deviceUtil.findPrimaryUser();
    if (doctor) {
      // let fromDate = '2021-06-29';
      // let toDate = '2021-07-30';

      //let filter = new Filter(Expr.eq('doctorCode', doctor.id));
      let filter = new Filter(Expr.eq('doctorCode', doctor.CODE));
      filter.and(Expr.ge('APPOINTMENTDATE', this.fromDate));
      filter.and(Expr.le('APPOINTMENTDATE', this.toDate));
      this.gateway.get<any>("/api/v1/doctorappts" + filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
        if (result.status === 0 && result.results.length > 0) {
          this.patHeaders = [
            { title: 'PATSTATUS', data: 'PATSTATUS' },
            { title: 'VISITDATE', data: 'VISITDATE' },
            { title: 'TRNUMBER', data: 'TRNUMBER' },
            { title: 'PATIENT_NAME', data: 'PATIENT_NAME' },
            { title: 'AGE', data: 'AGE' },
            { title: 'GENDER', data: 'GENDER' },
            { title: 'VISITSTATUS', data: 'VISITSTATUS' },
            { title: 'APPOINTMENTNO', data: 'APPOINTMENTNO' }
          ];
          this.patients = result.results.filter((item: any) => {
            //item['VISITDATE'] = item['APPOINTMENTDATE'].split('T')[0] +' '+ item['APPOINTMENTTIME'].split('T')[1]?.substr(0,5);
            item['VISITDATE'] = item['VISITDATE'];
            return item;
          });
          this.isDisplayTable = true;
        }
      });
    }
  }
  findIndexOfKey(item: any, key: string) {
    return Object.keys(item).findIndex(iKey => iKey === key)
  }
  calculateAge(patDob: any) {

    let returnVal;
    const today = new Date();
    const tempDob = patDob;
    const dob = new Date(tempDob);

    if (today.getTime() >= dob.getTime()) {
      const timeDiff = Math.abs(today.getTime() - dob.getTime());
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const totalYears = Math.floor(totalDays / 365.2425);
      const totalMonths = Math.floor((totalDays % 365.2425) / 30);
      const remainingDays = Math.ceil((totalDays % 365.2425) % 30);
      console.log(totalYears + '.' + totalMonths + '.' + remainingDays);
      if (totalYears > 0) {
        returnVal = totalYears + ' years';
      }
      else if (totalMonths > 0) {
        returnVal = totalMonths + ' month ' + remainingDays + ' days';
      }
      else {
        returnVal = remainingDays + ' days';
      }
    }
    return returnVal;
  }

  onFilterSubmit($event: any) {
    const httpOptions = $event;
    if ($event.isAppointmentDate === true || $event.isAppointment === true || $event.isVisitStatus === true) {
      this.patients = [];
      if ($event.isAppointmentDate === true) {
        this.patients = this.globalPatients.filter((con: any) => {
          return con.appointmentDate >= $event.fromDate &&
            con.appointmentDate <= $event.toDate;
        });
      }
      else {
        this.patients = this.globalPatients;
      }

      if ($event.isAppointment === true) {
        this.patients = this.patients.filter((con: any) => {
          return con.appointmentNo.toLowerCase().includes($event.appointmentNo.toLowerCase());
        });
      }

      if ($event.isVisitStatus === true) {
        this.patients = this.patients.filter((con: any) => {
          return con.visitStatus === $event.visitStatus;
        });
      }
    }
    else {
      this.patients = this.globalPatients;
    }
  }

  navigateRoute(event: any, item: any) {
    this.route.navigate(['form'], { state: { profile: item } });
  }

  checkFavourite(event: any) {

  }
  onRowClick(event: any) {
    this.loadTemplateMapping(event);
  }
  getPatientDetails(event: any) {
    let filter = new Filter(Expr.eq('TRNUMBER', event.TRNUMBER));
    //this.gateway.get<any>("/api/v1/patient?" + filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
    //  if (result.status === 0 && result.results.length > 0) {
        //let patient = result.results[0];
        let patient = event;
        patient.APPOINTMENTNO = event.APPOINTMENTNO;
        patient.age = patient.Age;
        this.deviceUtil.setGlobalData('appt-selected', patient);
        this.deviceUtil.addSessionData('APPOINTMENTNO', event.APPOINTMENTNO);
        this.deviceUtil.addSessionData("TRNUMBER", event.TRNUMBER);
        this.deviceUtil.addSessionData("MRNUMBER", event.TRNUMBER);
        this.deviceUtil.addSessionData('TEMPLATE', 'Eye Assessment Form');
        this.route.navigate(['/'], { state: { routeId: { title: 'Pmh', type: 'history', profile: { img: '' } } } });
    //  }
    //});
  }
  loadTemplateMapping(event: any) {
    let filter = new Filter(Expr.eq("STATUS", 0));
    this.gateway.get<any>("/api/v1/tempdepartment" + filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result) => {
      if (result.status === 0 && result.results.length > 0) {
        let sectionIds: any = [];
        let menuSet: any = [];
        result.results.forEach((item: any) => {
          let deptFound = this.departments.find((dept: any) => dept.DEPTCODE === item.DEPTCODE);
          if (deptFound) {
            menuSet.push({ tempId: item.TEMPID, DEPTNAME: deptFound.DEPTNAME, DEPTCODE: item.DEPTCODE, SECTIONID: item.SECTIONID });
          }
          let secFound = sectionIds.findIndex((sec: any) => sec === item.SECTIONID);
          if (secFound === -1)
            sectionIds.push(item.SECTIONID);
        });
        this.loadSections(event, sectionIds, menuSet);
      } else {
        this.toast.showError('No Template mapping exists.')
      }
    });
  }
  loadSections(event: any, sectionIds: any, menuSet: any) {
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.in('SECTIONID', sectionIds));
    this.gateway.get("/api/v1/deptsection" + filter.get()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        //result.results = this.sortByKey(result.results, 'DISP_PRIORITY');
        menuSet = menuSet.filter((item: any) => {
          let found = result.results.find((sec: any) => sec.SECTIONID === item.SECTIONID);
          if (found) {
            item.SECTIONNAME = found.SECTIONNAME;
            item.DISP_PRIORITY = found.DISP_PRIORITY
            return item;
          }
        });
        menuSet = this.sortByKey(menuSet, 'DISP_PRIORITY');
        this.updateSpecialMenuSet(event, menuSet);
      }
    });
  }

  sortByKey(array: any, key: string) {
    return array.sort(function (a: any, b: any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  updateSpecialMenuSet(event: any, menuSet: any) {
    let configRoutes: any;
    let configRoute: any = this.route.config;
    let component = configRoute.find((item: any) => (item.children && item.children.length > 0));
    if (component) {
      configRoutes = component.children[0]._loadedConfig.routes;
    }
    menuSet.forEach((section: any) => {
      let finder = configRoutes.find((item: any) => item.path === 'examForm/' + section.tempId)
      if (!finder) {
        configRoutes.push({ 'path': 'examForm/' + section.tempId, component: TemplatePreviewComponent });
      }
    });
    let defFinder = configRoutes.find((item: any) => item.path === 'examForm/:id');
    if (defFinder) {
      defFinder.path = 'examForm/locked';
    }
    this.route.resetConfig(configRoute);
    this.deviceUtil.setGlobalData('app-dept-menu', menuSet);
    this.getPatientDetails(event);
  }
  getAllDepartments() {
    this.gateway.get("/api/v1/department").subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        this.departments = result.results;
      }
    });
  }

  onRowHoverOutClick(event: any) {
    //if (this.currentUser.APPOINTMENTNO != event.info.APPOINTMENTNO) {
    var theThing = document.querySelector("#thing") as HTMLElement;
    theThing.style.display = 'none';
    $('td:eq(0)', event.row).css('background-color', 'transparent');
    //}
  }

  onTableLoad(event: any){
    $('td:eq(0)', event.row).css('background-color', 'Red');
  }

  onRowHoverClick(event: any) {

    if (this.currentUser.APPOINTMENTNO != event.info.APPOINTMENTNO)
      this.showPatientCurrentStatus(event);

    this.currentUser = event.info;
    var theThing = document.querySelector("#thing") as HTMLElement;
    //console.log(event);
    var xPosition = event.event.screenX - event.event.currentTarget.getBoundingClientRect().left - (theThing.clientWidth / 2);
    var yPosition = event.event.screenY - event.event.currentTarget.getBoundingClientRect().top - (theThing.clientHeight / 2);
    // in case of a wide border, the boarder-width needs to be considered in the formula above
    // theThing.style.left = (event.event.clientX-50) + "px";
    // theThing.style.top = (event.event.clientY-50) + "px";

    theThing.style.left = (event.event.screenX - 230) + "px";
    theThing.style.top = (event.event.screenY - 150) + "px";

    theThing.style.display = 'block';

    //$('td:eq(0)', event.row).css('background-color', 'Red');
    //if (this.hoverCount == 0)


  }

  showPatientCurrentStatus(event: any) {
    let filter = new Filter(Expr.eq('APPOINTMENTNO', event.info.APPOINTMENTNO));
    filter.and(Expr.ge('MRNUMBER', event.info.TRNUMBER));
    this.gateway.get<any>("/api/v1/patCompletedTemplate" + filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result: any) => {
      if (result.status === 0 && result.results.length > 0) {
        let colors = ['red', 'blue', 'green', 'orange', 'teal', 'brown', 'pink'];
        result.results.forEach((element: any, index: number) => {
          if(index==0)
            this.currentUser.completedTemps = [];
          
          this.currentUser.completedTemps.push({
            template: element.TEMPLATE,
            date: element.CREATED_ON,
            color: colors[index]
          });
        });
        this.currentUser.completedTemps.reverse();
        // if (result.results[0].EYEASSESSMENT) {
        //   $('td:eq(0)', event.row).css('background-color', 'red');
        //   this.currentUser.currentStatus = {
        //     text: 'Patient has completed the eye assessment.',
        //     color: 'red'
        //   };
        // }
        // else if (result.results[0].EXAMINATION) {
        //   $('td:eq(0)', event.row).css('background-color', 'blue');
        //   this.currentUser.currentStatus = {
        //     text: 'Patient has completed the examination.',
        //     color: 'blue'
        //   };
        // }
        // else if (result.results[0].REFRACTION) {
        //   $('td:eq(0)', event.row).css('background-color', 'green');
        //   this.currentUser.currentStatus = {
        //     text: 'Patient has completed the refraction.',
        //     color: 'green'
        //   };
        // }
        // else if (result.results[0].REFRACTION) {
        //   $('td:eq(0)', event.row).css('background-color', 'black');
        //   this.currentUser.currentStatus = {
        //     text: 'Patient has completed consultation.',
        //     color: 'black'
        //   };
        // }
      }
    });
  }
}