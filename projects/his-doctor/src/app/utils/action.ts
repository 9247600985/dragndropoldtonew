import { Filter } from "../filter/filter.component";
export class Action {
    id:string;
    controlId:string;
    controlType?:string;
    type?:string;    
    serviceId:string;
    name:string;
    input:Filter;
    output:Filter;
    operation:any;
    persist?:boolean;
    controlParentId:string;
    controlParentType:string;
   // mappers?:any = [];
    //elements?:any = [];
}
