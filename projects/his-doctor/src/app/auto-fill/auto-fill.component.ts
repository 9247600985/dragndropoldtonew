import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DeviceUtil } from '../utils/DeviceUtil';
@Component({
  selector: 'app-auto-fill',
  templateUrl: './auto-fill.component.html',
  styleUrls: ['./auto-fill.component.css']
})
export class AutoFillComponent implements OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  //@Input() defSymptoms:any = [];
  @Input() data : any[] = [];
  @Output() actionEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();
  @Output() notFoundEvent = new EventEmitter<any>();
  @Output() selectedValueChange = new EventEmitter<any>();
  @Input() selectedValue: any;
  @Input() selectedId: any;
  @Output() removeActionEvent = new EventEmitter<any>();
  selectedSymptoms: any = [];
  changedValue:string;
  // search term property name
  keyword = 'name';
  notFoundTemplate2:string = '<p>Not Found. Need to add this?</p>';
  constructor(private deviceUtil:DeviceUtil) {}

  ngOnInit(): void {
    /*this.defSymptoms.forEach((item:any)=>{
      this.selectedSymptoms.push(item);
    });*/
    if(!this.selectedValue)
      this.selectedValue = this.placeholder;
    if(this.data)
    this.data.forEach((item:any)=>{
      if(!item.data && item.paramName){
        item.id = item.paramName;
        item.name = item.paramName;
        item.data = {};
      }
    });
  }
  clickNotFound(event: any){
    this.notFoundEvent.emit({data: this.changedValue});
    this.selectedValueChange.emit(this.changedValue);
    this.deviceUtil.showToast(this.changedValue+' Added', false);    
  }
  selectEvent(event: any) {
    if(typeof event !== 'string'){
      this.selectedValueChange.emit(event.name);    
      this.actionEvent.emit(event);
    }
  }

  onChangeSearch(event: any) {
    if(typeof event === 'string'){
      this.changedValue = event;  
      this.changeEvent.emit({data: event});
    }   
    //this.changeEvent.emit(event);
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: Event) {
    console.log()
    // do something
  }

  removeItemfromSymptoms(event: Event, item: any)
  {
    event.preventDefault();
    let index = this.selectedSymptoms.findIndex((x: any) => x.symptomCode === item.symptomCode);
    this.selectedSymptoms.splice(index, 1);
    this.removeActionEvent.emit(item);
  }
  keyPressItem(event:any){
    let itemValue = event.target.value;
    let found = this.data.find((item:any)=>item.name === itemValue);
    if(!found){
      this.notFoundEvent.emit({data: itemValue});
      this.selectedValueChange.emit(itemValue);    
      this.actionEvent.emit({id: itemValue, name:itemValue, data:{}});      
    }
  }
}
