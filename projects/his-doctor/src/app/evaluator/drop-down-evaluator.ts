export class DropDownEvaluator{

    execute(input:any, output:any, context:any){
        let result:any;
        let param = output[0];
        let index = 0;
        if(param.scope === 'context'){
            if(Array.isArray(context)){
                context.forEach((item:any)=>{
                    if(index === 0)
                    result = [];
                    result.push({defaultSelect: false,
                        id: "id"+index,
                        value: item[param.element]});
                        index++;
                });
            }            
        }
        return result;
    }
    execute2(cntrl:any, result:any){
        let target:any = [];
        let index = 0;
        result.forEach((item:any)=>{
            let keys:any = Object.keys(item);
            target.push({defaultSelect: false,
                id: "id"+index,
                value: item[keys[0]].value});
                index++;
        });
        return target;

    }
    add2Control(cntrl:any, result:any){
        let data = this.execute2(cntrl, result);
        cntrl.options = data;
    }
}
