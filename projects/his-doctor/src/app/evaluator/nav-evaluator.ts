import { Router } from "@angular/router";

export class NavEvaluator {
    constructor(private router:Router){}
    add2Control(cntrl:any, result:any){
        /*let data = this.execute2(cntrl, result);
        cntrl.options = data;*/
    }
    execute(input:any, output:any, context:any){
        this.router.navigate([output[0].element.id], {state: {}});        
    }
}
