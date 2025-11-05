import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input() data = [];
  @Input() tableCaption: any;
  @Input() tableHeaders: any = [];
  nodata:string = '';
  stateData:any;
  constructor(private router:Router) { 
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit(): void {
    if(!this.stateData){
      this.router.navigate(['/main']);
    }
    let count = 0;
   /* try{
      this.data.forEach((element: any) => {
        if(count === 0)
          this.tableHeaders = Object.keys(element);
        count++;
      });
    }catch(error){
      console.log(error);
    }*/
    if(this.data && this.data.length === 0)
      this.nodata = 'No records';
    else
    this.nodata = '';
  }
  ngAfterViewInit()
  {
    console.log('Hi');
  }
  RowSelected(item:any){
    const navigationExtras: NavigationExtras = {
      state: item
    };    
    this.router.navigate(['video-player'], navigationExtras);
  }
}
