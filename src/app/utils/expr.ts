export class Expr {    
    static eq(key:string, value:any, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" eq "+value;
    }
    static ne(key:string, value:string, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" ne "+value;
    }
    static gt(key:string, value:string, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" gt "+value;
    }
    static ge(key:string, value:string, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" ge "+value;
    }
    static lt(key:string, value:string, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" lt "+value;
    }
    static le(key:string, value:string, type?:string):string{
        value = this.getStringValue(value, type);
        return key+" le "+value;
    }
    static in(key:string, value:any[], type?:string):string{
        value = this.getStringValue(value, type);
        return key+" eq "+value;
    }
    private static getStringValue(value:any, type?:string){
        if(typeof value === 'string' || type === 'string')
            value = "'"+value+"'";
        else if(Array.isArray(value) || typeof value === 'object'){
            value = "'"+JSON.stringify(value)+"'";
        }
        return value;
    }
}
