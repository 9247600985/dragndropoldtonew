export class TextEvaluator {
    add2Control(cntrl:any, result:any){
        let item = result.find((elem:any)=>elem[cntrl.name] !== undefined);
        if(item)
            cntrl.value = item[cntrl.name].value;
        /*let data = this.execute(cntrl, result);
        cntrl.value = data;*/
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
    addDataControl(cntrl:any, result:any []){
        cntrl.value = result[0];
    }
}
