export class StyleClass {
    width:string = 'col-sm-12';
    classList:any[] = [];  
    addWidth(value:number){
        this.width = 'col-sm-'+value;        
    }
    getTarget(){
        return this.width+' '+this.classList.toString();
    }
    addClass(value:string){
        this.classList.push(value);
    }    
}
