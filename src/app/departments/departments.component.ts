import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Inserter } from '../utils/inserter';
import { HttpClient } from '@angular/common/http';
import { DeviceUtil } from '../utils/DeviceUtil';
import { ToastComponent } from '../toast/toast.component';
import { Updater } from '../utils/updater';
import { Filter } from '../utils/filter';
import { Expr } from '../utils/expr';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  department: any = {
    DEPTCODE: null,
    DEPTNAME: null,
    STATUS: null
  };
  submitted = false;
  departments: any = [];
  btnName='Save';

  @ViewChild('clear') clear: ElementRef;

  constructor(private toast: ToastComponent, private gateway:HttpClient, private deviceUtil:DeviceUtil) { }

  ngOnInit(): void {
    this.getDepartments();
  }

  submitForm()
  {
    if(this.btnName === 'Save'){
      this.department.CLNORGCODE = '001001001000';
      let inserter = new Inserter(this.department);
      this.gateway.post("/api/v1/department", inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          this.toast.showSuccess('Department has been added.');
          this.btnName = 'Save';
          this.getDepartments();
          this.clear.nativeElement.click();
        }
      });
    }
    else
    {
      let updater = new Updater(this.department);
      let filter = new Filter(Expr.eq("DEPTCODE", this.department.DEPTCODE));
      updater.addFilter(filter);
      this.gateway.put("/api/v1/department", updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          this.toast.showSuccess('Department has been updated.');
          this.btnName = 'Save';
          this.getDepartments();
          this.clear.nativeElement.click();
        }
      });
    }
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

  getRowData(event: Event, item: any)
  {
    this.department.DEPTCODE = item.DEPTCODE;
    this.department.DEPTNAME = item.DEPTNAME;
    this.department.STATUS = item.STATUS;
    this.btnName = 'Update';
  }

}
