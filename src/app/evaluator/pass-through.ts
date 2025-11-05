export class PassThrough{
    execute(input:any, output:any, context:any){
        let result;
        let param = output[0];
        if(param.scope === 'context'){
            result = context[param.element];
        }
        return result;
    }
}
