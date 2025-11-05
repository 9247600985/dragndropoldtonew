export class PhoneFormatter{
    execute(input:any, output:any, context:any){
        let result;
        let param = output[0];
        if(param.scope === 'context'){
            if(Array.isArray(context))
            context = context[0];
            result = '+'+context[param.element];
        }
        return result;
    }
}
