import { Filter } from "./filter";

export class Updater{
    private filter:Filter;
    private result:any;
    constructor(data:any){
        this.result = data;       
    }
    get():any{
        let $filter = this.filter.get(true);        
        return {update: this.result, filter: $filter};
    }
    addFilter(filter:Filter){
        this.filter = filter;
    }
}