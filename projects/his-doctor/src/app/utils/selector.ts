import { Filter } from "./filter";

export class Selector {    
    private filter:Filter;
    private result:any = [];
    constructor(data:string){
        this.result.push(data);       
    }
    addColumn(data:string){
        this.result.push(data);  
    }
    get():any{
        let $filter = this.filter.get();
        if(this.result.length > 0)
            $filter += '&select='+this.result.toString();
        return $filter;
    }
    addFilter(filter:Filter){
        this.filter = filter;
    }
}
