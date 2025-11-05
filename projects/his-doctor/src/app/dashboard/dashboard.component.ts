import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { TemplatePreviewComponent } from '../template-preview/template-preview.component';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  items=[
    {name: 'patient Name 1', doctor:'Dr. Rational'},
    {name: 'patient Name 2', doctor:'Dr. Rational'},
    {name: 'patient Name 3', doctor:'Dr. Rational'},
    {name: 'patient Name 4', doctor:'Dr. Rational'},
    {name: 'patient Name 5', doctor:'Dr. Rational'},
  ];
  customers:any = [];
  isShowImportTemplate:boolean;
  stateData:any;
  selectedApp:any;
  apps:any = [];
  departments:any = [];
  routeSet: any[] = [];
  appActions:any[] = [{id:'edit', desc:'Change', icon:'fa-level-up-alt'}, {id:'start', desc:'Start', icon:'fa-level-up-alt'}, {id:'open', desc:'Open', icon:'fa-level-up-alt'}];
  constructor(private router: Router, private gateway:HttpClient, private deviceUtil:DeviceUtil) {
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
   }
  ngAfterViewInit(): void {
  }
  openApp(item:any){
    //this.isShowImportTemplate = true;
    this.selectedApp = JSON.parse(JSON.stringify(item));
    this.callAuthenticateApp();
  }
  onLoginApp(event:any, appPassCode:any){
    this.isShowImportTemplate = false;
    console.log(this.selectedApp)
    this.callAuthenticateApp();
  }
  closeLogin(){
    this.isShowImportTemplate = false;
  }
  callAuthenticateApp(){
    let loggedInUser = this.deviceUtil.getUserId();
    let body = this.deviceUtil.getAppAnonymousRequest(this.selectedApp.CREDENTIALS.clientId, this.selectedApp.CREDENTIALS.clientSecret);
    this.gateway.post<any>('/oauth/token',body, this.deviceUtil.getUrlHeaders()).subscribe((authResult:any)=>{
      environment.appId = 'apps.'+this.selectedApp.APP_NAME;
      environment.appcontextpath = this.selectedApp.serviceContext;
      if(!authResult.code && authResult.access_token){
        authResult.userid = loggedInUser;      
        this.deviceUtil.addSessionData("TokenInfo", authResult);
        this.deviceUtil.setGlobalData('selectedApp', this.selectedApp);
        this.fetchAllOperations('template').subscribe((result:any)=>{
          if(result.status === 0 && result.results.length > 0){
            let found = result.results.find((item:any)=>item.id.source === 'template');
            if(found){
              this.selectedApp.isTemplates = true;
            }
          }         
          this.navigateApp(null, this.selectedApp);
        });        
      }
    }, (error:any)=>{      
      this.deviceUtil.showToast("App Authentication failed", true);      
    });
  }
  addAppAction(event:any, id:any, item:any){
    if(id === 'edit')
      this.navigateApp(event, item);
    else if(id === 'open'){
      
    }else if(id === 'start'){
        //console.log(environment.sourcePath);
      //exec('ng serve --port 9080 --baseHref /doctor'); 
      //npm.commands.run('ng serve --port 9080 --baseHref /doctor', (err:any) => {console.log(err) });
     // this.addLaunchData(item);      
     // this.router.navigate([], {state: {title: 'asdf'}}).then(result => {  window.open('/#/login', '_self'); });
    }
  }

  ngOnInit(): void {
    if (!this.stateData){
      this.router.navigate(['/']);
      return;
    }
    this.customers = this.deviceUtil.findCustomers();
    //this.loadApps();
    this.loadMenus();    
    
  }
  selectCustomer(event:any){
    if(event.target.value === '')
      this.apps = [];
    this.loadApps(event.target.value);
  }
  loadApps(custId:string){
    /*let user = this.deviceUtil.findPrimaryUser();
    if(user.CUST_ID){
      let filter = new Filter(Expr.eq("CUST_ID", user.CUST_ID));*/
      let filter = new Filter(Expr.eq("CUST_ID", custId));
      this.gateway.get<any>('/api/v1/registerApp'+filter.get(), this.deviceUtil.getUrlHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
          this.apps = result.results;
        }
      });
    //}
  }
  navigateApp(event:any, item?:any){
    let user = this.deviceUtil.findPrimaryUser();
    if(!item){
      item = {
        CUST_ID: user.CUST_ID
      };
    }
    environment.appType = 'app';
    let configRoute:any = this.router.config;
    this.router.resetConfig(configRoute);
    this.router.navigate(['app-details'], {state: { 'item': item, routeId: {}}});  
  }
  fetchAllOperations(serviceId:string){
    return this.gateway.get<any>('/api/v1/services?select=&filter='+serviceId, this.deviceUtil.getJsonHeaders({'isAdminService': 'true'}));
  }
  loadTemplateMapping(event:any){    
    let filter = new Filter(Expr.eq("STATUS", 0));
    this.gateway.get<any>("/api/v1/tempdepartment"+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result)=>{
      if (result.status === 0 && result.results.length > 0) {
        let sectionIds:any = [];   
        let menuSet:any = [];     
        result.results.forEach((item:any)=>{
          let deptFound = this.departments.find((dept:any)=>dept.DEPTCODE === item.DEPTCODE);
          if(deptFound){
            menuSet.push({tempId: item.TEMPID, DEPTNAME: deptFound.DEPTNAME, DEPTCODE: item.DEPTCODE, SECTIONID: item.SECTIONID});
          }          
          sectionIds.push(item.SECTIONID);
        });
        this.loadSections(event, sectionIds, menuSet);
        
      }else{
        this.deviceUtil.showToast('No Template mapping exists.', true)
      }
    });
  }
  getAllDepartments(event:any) {
    this.gateway.get("/api/v1/department").subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        this.departments = result.results;
        this.loadTemplateMapping(event);
      }
    });
  }
  loadSections(event:any, sectionIds:any, menuSet:any) {
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.in('SECTIONID', sectionIds));
    this.gateway.get("/api/v1/deptsection"+filter.get()).subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        menuSet = menuSet.filter((item:any)=>{
          let found = result.results.find((sec:any)=>sec.SECTIONID === item.SECTIONID);
          if(found){
            item.SECTIONNAME = found.SECTIONNAME;
            return item;
          }
        });
        this.updateSpecialMenuSet(event, menuSet);
        this.router.navigate([], {state: this.stateData}).then(result => {  window.open('/#/login?appType=doctor', '_self'); });
      }
    });
  }
  updateSpecialMenuSet(event:any, menuSet: any){
    let configRoutes:any;
    let configRoute:any = this.router.config;
    let component = configRoute.find((item:any)=>(item.children &&  item.children.length > 0));
    if(component){
      configRoutes = component.children[0]._loadedConfig.routes;
    }
    menuSet.forEach((section:any)=>{             
        let finder = configRoutes.find((item:any)=>item.path === 'examForm/'+section.tempId)
        if(!finder){
          configRoutes.push({ 'path': 'examForm/'+section.tempId, component: TemplatePreviewComponent});             
        }            
    });
    let defFinder = configRoutes.find((item:any)=>item.path === 'examForm/:id');
    if(defFinder){
      defFinder.path = 'examForm/locked';
    }
    this.router.resetConfig(configRoute);
    this.deviceUtil.setGlobalData('app-dept-menu', menuSet);
  }
  loadMenus(){
    this.deviceUtil.fetchTopMenuSet(this.routeSet, true);
    this.deviceUtil.fetchBuilderMenu(this.routeSet); 
    this.deviceUtil.fetchBottomMenuSet(this.routeSet);
  }
}
