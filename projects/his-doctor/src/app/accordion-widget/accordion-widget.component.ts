import { Component, Input, OnInit } from '@angular/core';
import { ContainerWidget } from '../utils/container-widget';

@Component({
  selector: 'app-accordion-widget',
  templateUrl: './accordion-widget.component.html',
  styleUrls: ['./accordion-widget.component.scss']
})
export class AccordionWidgetComponent extends ContainerWidget implements OnInit {
  //regExpr:any = new RegExp('(?<=>)[^<>]+(?=<)');
  JSON:JSON;
  @Input()
  data: any;
  @Input()
  control:any;
  
   ngOnInit() {
    super.ngOnInit(this.data, this.control);
    super.translate();
   }
  //ngOnInit2() {
    /*if(!this.data)
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
      });*/
/*    this.data.forEach((tab:any)=>{
      var res = this.regExpr.exec(this.control.label);
      if(res){
        tab.title = this.control.label.replace(/(?<=>)[^<>]+(?=<)/g, tab.title);      
      }      
      //tab.title = this.control.label.replace('(?<=>)[^<>]+(?=<)', tab.title);
      tab.data.forEach((content:any)=>{
        for(let[key, value] of Object.entries(content)){
          let found = this.control.controls.find((item:any)=>item.id === key);
          if(found){
            var res = this.regExpr.exec(found.label);
            if(res){              
              content[key] = found.label.replace(/(?<=>)[^<>]+(?=<)/g, value);    
            }
            //content[key] = found.label.replace(found.ejsText?found.ejsText:found.label, value);
          }
        }
      });
    });*/
  //}
  /*toggleAccordian(event:any, index:any) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.data[index].isActive) {
      this.data[index].isActive = false;
    } else {
      this.data[index].isActive = true;
    }
    const panel = element.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }*/
  toggleAccordion(event:any, index:any, item:any) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.data[index].isActive) {
      this.data[index].isActive = false;
    } else {
      this.data[index].isActive = true;
    }
    const panel = element.nextElementSibling;
    if(panel.style){
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight+20 + "px";
      }
    }
  }
  /*tabClick(event:any){
    event.currentTarget.classList.toggle("active");
    event.currentTarget.nextElementSibling.classList.toggle("show");
  }*/
  /*getControlData(tabData:any, key:any){
    let found = this.control.controls.find((item:any)=>item.id === key);
    if(found){
      return tabData[found.id];
    }        
  }*/
}
