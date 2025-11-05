import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DialogPopupService } from "../dialog-popup/dialog-popup.service";
import { ConditionEvaluator } from "./condition-evaluator";
import { DisplayEvaluator } from "./display-evaluator";
import { DropDownEvaluator } from "./drop-down-evaluator";
import { MatTableEvaluator } from "./mat-table-evaluator";
import { NavEvaluator } from "./nav-evaluator";
import { PageEvaluator } from "./page-evaluator";
import { PassThrough } from "./pass-through";
import { PhoneFormatter } from "./phone-formatter";
import { ReportEvaluator } from "./report-evaluator";
import { SessionEvaluator } from "./session-evaluator";
import { TextEvaluator } from "./text-evaluator";
@Injectable({
    providedIn: 'root'
  })
export class EvaluatorUtil {
    constructor(private router:Router, private dialogService: DialogPopupService){}
    private static scopes:any = [{
        id: {source: 'page',
        target: 'page'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new PageEvaluator()
    },{
        id: {source: 'session',
        target: 'session'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new SessionEvaluator()
    }];
    private utils:any = [{
        id: {source: 'Passthrough',
        target: 'pass-through'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new PassThrough()
    },{
        id: {source: 'MobileFormatter',
        target: 'phone-formatter'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new PhoneFormatter()
    },{
        id: {source: 'dropdown',
        target: 'dropdown'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new DropDownEvaluator()
    },{
        id: {source: 'text',
        target: 'text'},
        component: new TextEvaluator()
    },{
        id: {source: 'page',
        target: 'page'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new PageEvaluator()
    },{
        id: {source: 'session',
        target: 'session'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new SessionEvaluator()
    },{
        id: {source: 'matTable',
        target: 'matTable'},
        component: new MatTableEvaluator()
    },{
        id: {source: 'textarea',
        target: 'textarea'},
        component: new TextEvaluator()
    },{
        id: {source: 'condition',
        target: 'condition'},
        component: new ConditionEvaluator()
    },{
        id: {source: 'display',
        target: 'display'},
        noOpr: true,
        operations:[{id: {source: "GET", target: "get"}}],
        component: new DisplayEvaluator(this.dialogService)
    },{
        id: {source: 'navigation',
        target: 'navigation'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new NavEvaluator(this.router)
    },{
        id: {source: 'report',
        target: 'report'},
        operations:[{id: {source: "GET", target: "get"}}],
        component: new ReportEvaluator()
    }];
    /*static findUtility(id:any){
        let found:any = this.utils.find((item:any)=>item.id.target === id);
        if(found)
        return found.component;
    }
    static getAll(){
        return this.utils;
    }*/
    static getAllScopes(){
        return this.scopes;
    }
    findAll(){
        return this.utils;
    }
    find(id:any){
        let found:any = this.utils.find((item:any)=>item.id.target === id);
        if(found)
        return found.component;
    }
}
