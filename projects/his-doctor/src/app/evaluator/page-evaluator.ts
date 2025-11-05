export class PageEvaluator {
    add2Control(cntrl:any, result:any){
        let data = this.execute(cntrl, result);
        cntrl.value = data;
    }
    private execute(cntrl:any, result:any){
        let target:any = [];
        result.forEach((item:any)=>{
            let keys:any = Object.keys(item);
            target = item[keys[0]];
            return false;
        });
        return target;
    }
}
