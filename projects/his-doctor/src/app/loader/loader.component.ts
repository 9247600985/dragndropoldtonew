import { Component, Input, OnInit } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
import { LoaderService } from './loader.service';
declare var $: any;
@Component({
  selector: 'loading-component',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  loaderSet:Number[] = [];
  loaderImg:any;
  @Input()
  isDisplayLoader:boolean = false;
  constructor(private deviceUtil:DeviceUtil, private loaderService: LoaderService) {
    loaderService.changeEmitted$.subscribe(
      result => {
        if(result === true && this.loaderSet.length === 0)
          this.isDisplayLoader = result;
        else{
          if(this.loaderSet.length > 0){
            this.loaderSet.pop();
          }
          if(this.loaderSet.length === 0)
            this.isDisplayLoader = result;
        }
      });
  }

  ngOnInit(): void {
    this.loaderImg = this.deviceUtil.getContextUrl('/assets/images/prosoft.png');
    //this.deviceUtil.getContextUrl('/assets/images/medezaLogo.png');
  }

  isLoader(){
    return this.isDisplayLoader;
  }
}
