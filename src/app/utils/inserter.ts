import { Filter } from "./filter";

export class Inserter{
    result:any;
    constructor(data:any){
        this.result = data;
    }
    get():any{
        return {insert: this.result};
    }
}