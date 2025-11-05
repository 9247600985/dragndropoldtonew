import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastComponent } from '../toast/toast.component';
import { Inserter } from '../utils/inserter';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Updater } from '../utils/updater';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';

@Component({
  selector: 'app-department-sections',
  templateUrl: './department-sections.component.html',
  styleUrls: ['./department-sections.component.css']
})
export class DepartmentSectionsComponent implements OnInit {

  btnName: string = 'Save';
  section: any = {
    SECTIONID: null,
    SECTIONNAME: null,
    DEPTCODE: null,
    DEPTNAME: null,
    STATUS: '0'
  };
  departments: any = [];
  deptSections: any = [];

  @ViewChild('clear') clear: ElementRef;

  constructor(private gateway:HttpClient, private toast: ToastComponent, private deviceUtil: DeviceUtil) { }

  ngOnInit(): void {
    this.getDepartments();
    this.getAllSections();
  }

  getDepartments()
  {
    this.gateway.get("/api/v1/department").subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.departments = result.results;
        this.departments.sort(function(a: any, b: any){
          return a.DEPTCODE - b.DEPTCODE;
        });
      }
    });
  }

  getAllSections()
  {
    this.gateway.get("/api/v1/deptsection").subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.deptSections = result.results;
      }else{
        this.toast.showError('No Sections exists');
        this.deptSections = [];
      }
    });
  }

  getRowDetails(event: any, item: any)
  {
    this.section.SECTIONID = item.SECTIONID;
    this.section.SECTIONNAME = item.SECTIONNAME;
    this.section.DEPTCODE = item.DEPTCODE;
    this.section.STATUS = item.STATUS;
    this.btnName = 'Update';
  }

  onSubmit(event: any)
  {
    if(this.btnName === 'Save'){
      this.section.CLNORGCODE = '001001001000';
      let inserter = new Inserter(this.section);
      this.gateway.post("/api/v1/deptsection", inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          this.toast.showSuccess('Department has been added.');
          this.btnName = 'Save';
          this.getAllSections();
          this.clear.nativeElement.click();
        }
      });
    }
    else
    {
      let updater = new Updater(this.section);
      let filter = new Filter(Expr.eq("DEPTCODE", this.section.DEPTCODE));
      updater.addFilter(filter);
      this.gateway.put("/api/v1/deptsection", updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          this.toast.showSuccess('Department has been updated.');
          this.btnName = 'Save';
          this.getAllSections();
          this.clear.nativeElement.click();
        }
      });
    }
  }

}
