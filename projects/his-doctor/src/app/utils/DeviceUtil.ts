import { Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { Globals } from '../utils/globals';
import { environment } from '../../environments/environment';
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from '../alert/alert.service';
import { Expr } from './expr';
import { Filter } from './filter';
import { forkJoin, Observable, Subject } from 'rxjs';
import { Inserter } from './inserter';
import { Updater } from './updater';
import { parse } from 'tharak-html-parser';
import { ToastComponent } from '../toast/toast.component';
import { EvaluatorUtil } from '../evaluator/evaluator-util';
import { catchError, switchMap, tap } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
  })
export class DeviceUtil {
    
    private roterStack:any = [];  
    private serviceData:any [] = [];
    constructor(private router:Router, private httpClient:HttpClient, private alert:AlertService, private toast:ToastComponent, private evaluators:EvaluatorUtil){       
    }
    getContextUrl(path:string){
        if(location.pathname === '/' || location.href !== '/')
           return './'+path;
        return location.pathname+path;
    }
    /*getTranslateHttpLoader(http:HttpClient, path:string){
        if(location.pathname === '/' || location.href !== '/')
            return new TranslateHttpLoader(http);
        return new TranslateHttpLoader(http, this.getContextUrl(path));
    }*/
    isNetWorkAvailable(){
        return navigator.onLine;
    }
    isMobile(){
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
    getActiveMenu(){
        return this.getGlobalData('activeMenu');
    }
    addActiveMenu(id:string){
        this.setGlobalData('activeMenu', id);
    }
    setDeepLinkData(params:any){        
        this.setGlobalData('deeplinkparams', params);
    }
    setGlobalData(key:string, data:any){
        Globals.data[key] = data;
    }
    getGlobalData(key:string){
        return Globals.data[key];
    }
    removeGlobalData(key:string){
        delete Globals.data[key];
    }
    getUserId(){
        
        let userid = this.getGlobalData('userid');
        if(!userid){
            let tokenInfo = this.getSessionData('TokenInfo');
            this.setGlobalData('userid', tokenInfo.userid);
        }
        return this.getGlobalData('userid');
    }
    removeSessionData(key:string){        
        localStorage.removeItem(key+'.'+environment.appId);            
    }
    private clearSessionData(){
        localStorage.clear();
    }
    getSessionData(key:string){
        let rawData;
        rawData = localStorage.getItem(key+'.'+environment.appId);
       if(rawData){
            let data = JSON.parse(rawData);
            this.setGlobalData('userid', data.userid);
            return data;
       }
        return null;
    }
    addSessionData(key:string, data:any){
        if(data.userid)
            this.setGlobalData('userid', data.userid);
        localStorage.setItem(key+'.'+environment.appId, JSON.stringify(data));
    }
    backRoute(router:Router){
        this.roterStack.pop();
        let route = this.roterStack.pop();
        if(route)
            return router.navigate([route.path], {state: route.state});
        return router.navigate(['\main']);

    }  
    addRouteStack(route:Location){
        this.roterStack.push({path:route.path(), state: route.getState()});
    }
    resetRoute(){
        this.roterStack.splice(0,this.roterStack.length);
    }
    getPreviousRoute(){
        this.roterStack.pop();
        return this.roterStack.pop();
    }
    getPeekRoute(){
        return this.roterStack.peek();
    }


    getCurrentTimeZone(){
        const today = new Date();
        const short = today.toLocaleDateString(undefined);
        const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });
    
        // Trying to remove date from the string in a locale-agnostic way
        const shortIndex = full.indexOf(short);
        if (shortIndex >= 0) {
          const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    
          // by this time `trimmed` should be the timezone's name with some punctuation -
          // trim it from both sides
          return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');
    
        } else {
          // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
          return full;
        }
      }
      private addHeaders(baseHdrs:any, hdrs?:any){
        if(hdrs){
            for(let [key,value] of Object.entries(hdrs)){
              baseHdrs[key] = JSON.stringify(value);
            }
          }
        let options = {      
          headers: new HttpHeaders(baseHdrs)
          }; 
          return options;
      }
      getJsonHeaders(hdrs?:any){
          return this.addHeaders({
            "Accept": "application/json",
            'Content-Type':  'application/json',        
            rejectUnauthorized: 'false',
            }, hdrs);
      }
      getUrlHeaders(hdrs?:any){
        return this.addHeaders({
            'Content-Type':  'application/x-www-form-urlencoded',        
            rejectUnauthorized: 'false',
            }, hdrs);
      }
      getAuthRequest(userid:string, passCode:string){
        let body:string = "username="+userid;
        body += "&password="+ passCode;
        body += "&grant_type=password"
        body += "&client_id="+ environment.clientId;
        body += "&client_secret="+ environment.clientSecret;
        return body;
      }
      getAppAuthRequest(userid:string, passCode:string, clientId:string, clientSecret:string){
        let body:string = "username="+userid;
        body += "&password="+ passCode;
        body += "&grant_type=password"
        body += "&client_id="+ clientId;
        body += "&client_secret="+ clientSecret;
        return body;
      }
      getAppAnonymousRequest(clientId:string, clientSecret:string){
        let body:string = "grant_type=client_credentials";
        body += "&client_id="+ clientId;
        body += "&client_secret="+ clientSecret;
        return body;
      }
      getReAuthRequest(token:string){
        let body:string = "refresh_token="+token;    
        body += "&grant_type=refresh_token"
        body += "&client_id="+ environment.clientId;
        body += "&client_secret="+ environment.clientSecret;
        return body;
      }
      isDoctorApp(){
          return 'doctor' === this.getGlobalData('appType');
      }
      isPatient(){
        return 'patient' === this.getGlobalData('appType');
    }
    findCustomers(){
        return this.getGlobalData('UserProfileData');
    }
      findPrimaryUser(){
        let users = this.getGlobalData('UserProfileData');
        if(users){
          if(this.isDoctorApp()){
              let doctor = users[0];
              doctor.id = doctor.Code;
            return doctor;
          }else if(this.isPatient()){
            return users.find((item: any) => {
                return item.Relation === '000';
                });              
            }else{
                return users[0];
            }
        }
      }
    fetchTopMenuSet(routeSet:any, defSelected:boolean){
        routeSet.push(
            {title : 'CARE SERVICES', routes : [
            { path: '/patient-details', id: 'home', title: 'My Consultations',  icon: 'home', class: '', state: {}, selected: defSelected}
        ]});    
    }
    fetchAppMenuSet(routeSet:any, defSelected:boolean, isTemplates?:boolean, isReports?:boolean){
        routeSet.push(
            {title : 'Dashboard', routes : [
                { path: '/main', id: 'home', title: 'Home',  icon: 'home', class: '', state: {}, selected: false},
            { path: '/app-details', id: 'appdetails', title: 'Application',  icon: 'home', class: '', state: {}, selected: defSelected}
        ]});
        this.fetchBuilderMenu(routeSet, -1, isTemplates, isReports);    
    }
    fetchHomeMenuSet(routeSet:any, defSelected:boolean){
        routeSet.push(
            {title : 'Dashboard', routes : [
            { path: '/main', id: 'home', title: 'Home',  icon: 'home', class: '', state: {}, selected: defSelected}
        ]});    
    }
    fetchBuilderMenu(routeSet:any, index?:number, isTemplates?:boolean, isReports?:boolean){
        let designerRoutes = [];
        if(isTemplates){
            designerRoutes.push({ path: '/template-list', id: 'mnuTmplBuilder', title: 'Templates',  icon: 'fa fa-th-list', class: '',
            state: {title: 'Personal'}, selected: false});
        }
        if(isReports)
            designerRoutes.push({ path: '/report-details', id: 'report', title: 'Reports',  icon: 'fa fa-file', class: '', state: {title: 'report'}, selected: false});
        designerRoutes.push({ path: '/service', id: 'security', title: 'Services',  icon: 'fa fa-database', class: '', state: {title: 'security'}, selected: false});
        let designerSet = {title : 'Designer', routes : designerRoutes};
        if(index && index > -1){
            routeSet[index] = designerSet;
        }else{
            routeSet.push(designerSet);
        }
  }
  fetchHistorySet(routeSet:any, defSelected?:boolean){
    let found:any = routeSet.find((item:any)=>item.title === 'care_svc');
    if(found){
        found.routes[0].selected = false;
    }
    /*routeSet.push({title : 'mnHistory', routes : [
      { path: '/mnMedicalHistory', id: 'mnMedicalHistory', title: 'mnMedicalHistory',  icon: 'capsules', class: '',  state: {title: 'Pmh', type: 'history', profile: {img: ''}}, selected: defSelected},
      { path: '/mnOcularHistory', id: 'mnOcularHistory', title: 'mnOcularHistory',  icon: 'eye', class: '', state: {title: 'occularHistory', type: 'history', profile: {img: ''}}, selected: false},
      { path: '/mnSurgicalHistory', id: 'mnSurgicalHistory', title: 'mnSurgicalHistory',  icon: 'bed', class: '', state: {title: 'SurgH', type: 'history', profile: {img: ''}}, selected: false},
      { path: '/mnFamilyHistory', id: 'mnFamilyHistory', title: 'mnFamilyHistory',  icon: 'house-user', class: '', state: {title: 'Fh', type: 'history', profile: {img: ''}}, selected: false}
    ]});*/
    routeSet.push({title : 'Drawing Board', routes : [
      { path: '/drawing', id: 'drawingBoard', title: 'Drawing Tool',  icon: 'drafting-compass', class: '', state: {title: 'drawing'}, selected: false}
    ]});
  }
  fetchBottomMenuSet(routeSet:any){
    routeSet.push({title : 'SETTINGS', routes : [
        { path: '/settings', id: 'personal_settings', title: 'Personal',  icon: 'cog', class: '',
        state: {title: 'Personal'}, selected: false},
        { path: '/security', id: 'security', title: 'Security',  icon: 'shield-alt', class: '', state: {title: 'Security'}, selected: false},
        { path: '/login', id: 'logout', title: 'Logout',  icon: 'sign-out-alt', class: '', state: {title: 'Logout'}, selected: false}
      ]});
      routeSet.push({title : 'ABOUT', routes : [
        { path: '/about', id: 'about_us', title: 'About Us',  icon: 'plus-square', class: '', state: {}, selected: false},
        { path: '/terms', id: 'tc', title: 'Terms and Conditions',  icon: 'file-alt', class: '', state: {}, selected: false},
        { path: '/privacy', id: 'pp', title: 'Privacy Policy',  icon: 'file-signature', class: '', state: {}, selected: false},
        { path: '/faq', id: 'help', title: 'Help',  icon: 'question-circle', class: '', state: {}, selected: false},
      ]});
  }
  appendMenuSet(routeSet:any, menuSet:any, defSelected?:boolean){
    let selected = defSelected;
    menuSet.forEach((section:any)=>{        
        let mItem = routeSet.find((item:any)=>item.title === section.DEPTNAME);
        if(!mItem){
            mItem = {title : section.DEPTNAME, routes : []};
            routeSet.push(mItem);
        }
        mItem.routes.push({ path: '/examForm/'+section.tempId, id: section.tempId, title: section.SECTIONNAME,  icon: 'home', class: '', state: {tempId: section.tempId}, 'selected': selected});
        if(selected)
        selected = false;
    });
  }
  logout(flag?:boolean){
    let id = this.getGlobalData("appTimeout");
    if(id){
      clearInterval(id);
    }
    this.removeSessionData("TokenInfo");
    //this.clearSessionData();
    //environment.appcontextpath = '/thiragatisoft';
    if(!flag)
        this.router.navigate(['/']);
  }
  showAlert(callerId:string, message:string, action:CallableFunction){
    this.alert.emitChange({type: 'alert', id:callerId, message:message, callback:action});
  }
  dispatch(type:string, callerId:string, message:string, action?:CallableFunction){
    this.alert.emitChange({type: type, id:callerId, message:message, callback:action});
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  showToast(message:string, isError?:boolean){
    if(isError){
      this.toast.showError(message);
    }else
      this.toast.showSuccess(message);
  }
  loadServices(gateway:HttpClient){
      if(this.serviceData.length === 0){
        gateway.get<any>('/api/v1/services?select=', this.getJsonHeaders()).subscribe((result:any)=>{
        if(result.status === 0 && result.results.length > 0){
            this.serviceData = result.results;
        }
        });
    }
  }
  getAllServices(){
      return this.serviceData;
  }
  
  callMethod(action:any, gateway:HttpClient, caller:any, context:any):Observable<any>{
    let reply:Observable<any> = new Observable;
    let mapping = action.operation.mapping.find((mapping:any)=>mapping.type === 'input');
    switch(action.operation.id.source){
        case 'POST':
            //mapping.data.forEach((item:any)=>{
            let matIds:any = [];            
            mapping.data.forEach((item:any)=>{
                if(item.scope.parentType === "matTable"){
                    let found = matIds.find((elem:any)=>elem === item.scope.parent);
                    if(!found)
                        matIds.push(item.scope.parent);
                }
            });
            if(matIds.length === 1 && caller.isAutoGrowMatTable(matIds[0])){
                let serviceSet = [];
                let rows = caller.findMatTableRows(matIds[0]);
                if(rows > 0){
                    for(let rowId=0; rowId<rows; rowId++){
                        let inserter:any = {};
                        mapping.data.forEach((crit:any)=>{  
                            caller.findElementData(crit, context, rowId);            
                            inserter[crit.element] = crit.data;
                        });
                        let childReply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
                        serviceSet.push(childReply);
                    }
                    reply = forkJoin(serviceSet);
                }
            }else{
                let inserter:any = {};
                mapping.data.forEach((crit:any)=>{  
                    caller.findElementData(crit, context);            
                    inserter[crit.element] = crit.data;              
                });
                reply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
            }
            /*for(let kIdx=0; kIdx<mapping.data.length; kIdx++){
                let item = mapping.data[kIdx];
                let serviceSet = [];
                if(item.scope.parentType === "matTable"){
                    if(caller.isAutoGrowMatTable(item.scope.parent)){
                        let rows = caller.findMatTableRows(item.scope.parent);
                        if(rows > 0){                            
                            for(let rowId=0; rowId<rows; rowId++){
                                let inserter:any = {};
                                mapping.data.forEach((crit:any)=>{  
                                    caller.findElementData(crit, context, rowId);            
                                    inserter[crit.element] = crit.data;
                                });
                                let childReply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
                                serviceSet.push(childReply);
                            }
                            reply = forkJoin(serviceSet);
                        } 
                    }
                }
                if(serviceSet.length === 0){
                    let inserter:any = {};
                    mapping.data.forEach((crit:any)=>{  
                        caller.findElementData(crit, context);            
                        inserter[crit.element] = crit.data;              
                    });
                    reply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
                }else{
                    break;
                }
            }*/
            /*let rows = 1;            
            let matElement = mapping.data.find((item:any)=>item.scope.parentType === "matTable");
            if(matElement){
                if(caller.isAutoGrowMatTable(matElement.scope.parent)){
                    rows = caller.findMatTableRows(matElement.scope.parent);
                }
                if(rows > 0){
                    let serviceSet = [];
                    for(let rowId=0; rowId<rows; rowId++){
                        let inserter:any = {};
                        mapping.data.forEach((crit:any)=>{  
                            caller.findElementData(crit, context, rowId);            
                            inserter[crit.element] = crit.data;
                        });
                        let childReply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
                        serviceSet.push(childReply);
                    }
                    reply = forkJoin(serviceSet);
                }                
            }
            if(rows > 1){
                let serviceSet = [];
                for(let rowId=0; rowId<rows; rowId++){
                    let inserter:any = {};
                    mapping.data.forEach((crit:any)=>{  
                        caller.findElementData(crit, context, rowId);            
                        inserter[crit.element] = crit.data;
                    });
                    let childReply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
                    serviceSet.push(childReply);
                }
                reply = forkJoin(serviceSet);
            }else{            
                let inserter:any = {};
                mapping.data.forEach((crit:any)=>{  
                    caller.findElementData(crit, context);            
                    inserter[crit.element] = crit.data;              
                });
                reply = gateway.post('/api/v1/'+action.serviceId, new Inserter(inserter).get(), this.getJsonHeaders());
            }*/
            break;
        case 'PUT':
            let updater:any = {};
            mapping.data.forEach((crit:any)=>{  
                caller.findElementData(crit, context);            
                updater[crit.element] = crit.data;              
            });
            let filters = mapping.data.filter((crit:any)=>crit.critType === 'where');
            let upd = new Updater(updater);
            let filter:any;
            filters.forEach((crit:any)=>{
                if(!filter)
                    filter = new Filter(Expr.eq(crit.element, crit.data));
                else
                    filter.and(Expr.eq(crit.element, crit.data));
            });
            if(filter)
                upd.addFilter(filter);
            reply = gateway.put('/api/v1/'+action.serviceId, upd.get(), this.getJsonHeaders());
            break;
        case 'DELETE':
            let deleter:any;
            if(mapping){
                let filter:any;
                mapping.data.forEach((crit:any)=>{  
                    caller.findElementData(crit, context);              
                    filter = this.evaluate(crit, filter);              
                });
                deleter = filter.get();
            }
            //let deleter = new Filter(this.evaluateExpr(null));
            reply = gateway.delete('/api/v1/'+action.serviceId+deleter, this.getJsonHeaders());    
            break; 
        case 'PATCH':
            let patcher = new Updater({});
            reply = gateway.patch('/api/v1/'+action.serviceId, patcher.get(), this.getJsonHeaders());
            break;                       
        default:
            let filterData:any = '';
            if(mapping){
                let filter:any;
                mapping.data.forEach((crit:any)=>{  
                    caller.findElementData(crit, context);            
                    filter = this.evaluate(crit, filter);              
                });
                if(filter)
                    filterData = filter.get();
            }
            reply = gateway.get('/api/v1/'+action.serviceId+filterData, this.getJsonHeaders());    
    }
    return reply;
  }
  findMethod(methodId:string, gateway:HttpClient):any{
      let method;
    switch(methodId){
        case 'POST':
            method = gateway.post;
            break;
        case 'PUT':
            method = gateway.put;
            break;
        case 'DELETE':
            method = gateway.delete;
            break; 
        case 'PATCH':
            method = gateway.patch;
            break;                       
        default:
            method = gateway.get;
        return method; 
    }
  }
    evaluateExpr(crit:any){
        let expr:any;
        switch(crit.operator){
            case '==':
            case '=':
                expr = Expr.eq(crit.element, crit.data);
                break;
            case '>':
                expr = Expr.gt(crit.element, crit.data);
                break;
            case '<':
                expr = Expr.lt(crit.element, crit.data);
                break;
            case '<=':
                expr = Expr.le(crit.element, crit.data);
                break;
            case '>=':
                expr = Expr.ge(crit.element, crit.data);
                break;
            case '<>':
            case '!=':
                expr = Expr.ne(crit.element, crit.data);
                break;                                                                                              
        }
        return expr;
    }
    /*evaluate(crit:any){
        let filter:any;
        switch(crit.operator){
            case 'and':
                filter = filter.and(filter, crit);
                break;
            case 'or':
                filter = filter.or(filter, crit);
                break;
            default:
                filter = new Filter(this.evaluateExpr(crit));
        }
        return filter;
    }*/
    evaluate(crit:any, filter:any){
        let decisionType = crit.decisionType?.target;
        if(!decisionType && filter)
            decisionType = crit.condition;
        switch(decisionType){
            case 'and':
                filter = filter.and(this.evaluateExpr(crit));
                break;
            case 'or':
                filter = filter.or(this.evaluateExpr(crit));
                break;
            default:
                filter = new Filter(this.evaluateExpr(crit));
        }
        return filter;
    }
    findRoute(route: Router, id:string){
        let configRoutes:any;
        let configRoute:any = route.config;
        let component = configRoute.find((item:any)=>(item.children &&  item.children.length > 0));
        if(component){
          configRoutes = component.children[0]._loadedConfig.routes;
          if(configRoutes){
            let finder = configRoutes.find((item:any)=>item.path === id);
            if(finder)
                return finder;
          }
        }
    }
    prepareCustomTemplate(data:any, content:any){
        let root:any = parse(content);
        this.updateControls(root.querySelectorAll("select"), data);
        return root.toString();
    }
    private updateControls(controls:any, data:any){        
        for(let idx=0; idx<controls.length; idx++){
            let control = controls[idx];
            let current = control.getAttribute('id');
            if(!current)
                current = idx;
            control.setAttribute('id', data.id+'_custom_'+current);
            if(!data.customIndexes)
                data.customIndexes = [];
            data.customIndexes.push(data.id+'_custom_'+current);
        }
    }
    endMeeting(meetingId:any){
        /*let consultation = this.injector.get(ConsultationService);
        let toast = this.injector.get(ToastComponent);
        consultation.updateMeetingStatusByAppointment(meetingId, meetingId, (result: any)=>{
            if (result.status === 0 && result.results.length > 0){
              toast.showSuccess('Meeting Ended');
            }
          });*/
    }
    isRequireCache:boolean;
    beginTransaction(){
        this.isRequireCache = false;
    }
    endTransaction(){
        this.isRequireCache = true;
    }
    findAllEvaluators(){
        return this.evaluators.findAll();
    }
    findEvaluator(id:any){
        return this.evaluators.find(id);
    }
    private getTargetUrl(url:string){
        //url = '/tsoft'+url;
        /*let isAvail = this.isAvailable();
        if(isAvail)
          return environment.appServiceUrl+url;*/
        return url;
    }
    refreshTokenInProgress = false;
    tokenRefreshedSource = new Subject();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
  
    callApi(targetUrl:string, method:string, request?:any, options?:any):Observable<any>{
      let tokenData = this.getSessionData("TokenInfo");
      if (tokenData && tokenData.access_token) {
        return this.callSecureApi2(targetUrl, method, request, options);
      }else{
        return this.refreshToken().pipe(
          switchMap(() => {          
              return this.callSecureApi2(targetUrl, method, request, options);
          }),
          catchError(e => {
            return this.callSecureApi2(targetUrl, method, request, options);
          }));
      }
    }
    private callSecureApi2(targetUrl:string, method:string, request?:any, options?:any):Observable<any>{
      return new Observable(observer => {
        this.callSecureApi(targetUrl, method, request, options).subscribe((result:any)=>{
          if('/oauth/token' === targetUrl){
            observer.next(result);
            observer.complete();
          }else if(result.status === 0){
            observer.next(result);
            observer.complete();
          }else{
            observer.error(new Error('Service execution failed.'));
          }
        }, err=>{
          observer.error(err);
        });
      });
    }
    refreshToken(): Observable<any> {
      if (this.refreshTokenInProgress) {
          return new Observable(observer => {
              this.tokenRefreshed$.subscribe(() => {
                  observer.next();
                  observer.complete();
              });
          });
      } else {
          this.refreshTokenInProgress = true;
          return this.reAuthToken().pipe(
              tap((data) => {
                  this.refreshTokenInProgress = false;
                  this.tokenRefreshedSource.next(data);
              }));
      }
    }
    reAuthToken<T>() {
      let observable = new Observable<T>(observer => {
          let body = "&grant_type=client_credentials"
          body += "&client_id="+ environment.clientId;
          body += "&client_secret="+ environment.clientSecret;
          let url = '/oauth/token';
          let options = { 
              "Accept": "application/json",
              'Content-Type':  'application/x-www-form-urlencoded'
            };          
          this.callSecureApi(url, 'post', body, options).subscribe((result: any) => {                
              this.addSessionData("TokenInfo", result);
              observer.next(result);
              observer.complete();
          }, err => {
              console.log(err.toString());
          });
      });
      return observable;
    }
    private callSecureApi(targetUrl:string, method:string, request?:any, options?:any):Observable<any>{
      let observable:Observable<any> = new Observable;
      targetUrl = this.getTargetUrl(targetUrl);
      if(!options){
        options = { 
          "Accept": "application/json",
          'Content-Type':  'application/json'
          };
        if(method !== 'get'){
          delete options['Content-Type'];
        } 
      }       
      options = this.addHeaders(options, {});    
      switch(method.toUpperCase()){
        case 'GET':
          observable = this.httpClient.get(targetUrl, options);
          break;
        case 'POST':        
          observable = this.httpClient.post(targetUrl, request, options);
          break;
        case 'PUT':
          observable = this.httpClient.put(targetUrl, request, options);
          break;
        case 'PATCH':        
          observable = this.httpClient.patch(targetUrl, request, options);
          break;
        case 'DELETE':
          observable = this.httpClient.delete(targetUrl, options);
          break;
      }
      return observable;
    }
}
