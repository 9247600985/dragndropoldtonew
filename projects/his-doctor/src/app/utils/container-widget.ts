export class ContainerWidget {
    regExpr:any = new RegExp('(?<=>)[^<>]+(?=<)');
    data: any;
    control:any;
    ngOnInit(data:any, control:any){
        this.data = data;
        this.control = control;
    }
    translate(){
        if(!this.data)
        this.data = JSON.parse(JSON.stringify(this.control.data)); 
        this.data.forEach((tab:any)=>{
          var res = this.regExpr.exec(this.control.label);
          if(res){
            tab.title = this.control.label.replace(/(?<=>)[^<>]+(?=<)/g, tab.title);      
          }        
          for(let[key, value] of Object.entries(tab.data)){
            let found = this.control.controls.find((item:any)=>item.id === key);
            if(found){
              var res = this.regExpr.exec(found.label);
              if(res){              
                tab.data[key] = found.label.replace(/(?<=>)[^<>]+(?=<)/g, value);    
              }
            }
          }        
        });
    }
    getControlData(tabData:any, key:any){
        let found = this.control.controls.find((item:any)=>item.id === key);
        if(found){
          return tabData[found.id];
        }        
      }
}
