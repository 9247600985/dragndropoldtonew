import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ContainerWidget } from '../utils/container-widget';

@Component({
  selector: 'app-tab-widget',
  templateUrl: './tab-widget.component.html',
  styleUrls: ['./tab-widget.component.css']
})
export class TabWidgetComponent extends ContainerWidget implements OnInit, AfterViewInit {
  @Input()
  control:any;
  @Input()
  data:any;
  testCount:number = 4;
  tabIndex:number = 0;
  constructor(){
    super();

  }
  ngOnInit() {
    super.ngOnInit(this.data, this.control);
    super.translate();
    
  }
  ngAfterViewInit() {
    
  }
  getTab(){
    return this.data[this.tabIndex++];
  }
}
