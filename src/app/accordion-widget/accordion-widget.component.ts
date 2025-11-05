import { Component, Input, OnInit } from '@angular/core';
import { ContainerWidget } from '../utils/container-widget';

@Component({
  selector: 'app-accordion-widget',
  templateUrl: './accordion-widget.component.html',
  styleUrls: ['./accordion-widget.component.scss']
})
export class AccordionWidgetComponent extends ContainerWidget implements OnInit {
  
  JSON:JSON;
  @Input()
  data: any;
  @Input()
  control:any;
  
   ngOnInit() {
    super.ngOnInit(this.data, this.control);
    super.translate();
   }
  
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
  
}
