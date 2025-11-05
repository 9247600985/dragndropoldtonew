export class ConditionEvaluator {
    add2Control(cntrl:any, result:any){
        let item = result.find((elem:any)=>elem[cntrl.name] !== undefined);
        if(item)
        this.addData(cntrl, item[cntrl.name].value);
    }
    addData(cntrl:any, data:any){
        switch(cntrl.type){
            case 'number':
            case 'text':
            case 'textarea':
                cntrl.value = data;
                break;
            case 'dropdown':
            case 'radio':
            case 'condition':
                let options = cntrl.options.filter((opt:any)=>{
                    opt.defaultSelect = false;
                    return opt;
                });
                let found = options.find((opt:any)=>opt.value === data);
                if(found){
                    found.defaultSelect = true;
                    if(cntrl.type === 'condition' || cntrl.type === 'dropdown')
                    cntrl.value = found.value;
                }
                break;                                
        }
    }
}
