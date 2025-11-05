export class Filter {       
    private crits:any[] = [];
    private type?:string = 'filter';

    constructor(expr:string){
        this.crits.push({opr:'', operand: expr});
    }
    and(expr:string){
        this.crits.push({opr:'and', operand: expr});
        return this;
    } 
    or(expr:string){
        this.crits.push({opr:'or', operand: expr});
        return this;
    }
    get(flag?:boolean):any{
        let result = '';
        if(!flag)
            result = '?filter=';
        this.crits.forEach((crt:any)=>{
            switch(crt.opr){
                case 'and':
                    result += crt.opr +' ('+ crt.operand+') ';
                break;
                case 'or':
                    result += crt.opr +' ('+ crt.operand+') ';
                break;
                default:
                    result +=  crt.operand+' ';
            }
        });
        return result.trim();
    }    

}
