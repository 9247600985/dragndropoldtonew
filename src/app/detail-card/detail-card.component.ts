import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.css']
})
export class DetailCardComponent implements OnInit {
  @Input() isShown: boolean = false;
  @Input() data: any;
  @Input() item: any;
  @ViewChild('btnMoreAction') actionBtnMore: ElementRef;
  @Output() actionMoreEvent = new EventEmitter<any>();
  @ViewChild('btnNavigateAction') actionBtnNav: ElementRef;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() favouriteEvent = new EventEmitter<any>();
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  navigateTo(item: any)
  {
    item.navPath = item.rightPath;
    this.actionEvent.emit(item);
  }

  viewMore(item: any)
  {
    item.navPath = item.leftPath;
    this.actionEvent.emit(item);
    //this.router.navigate(['/doctorprofile'], {state:{doctorId: item.id}});
  }

  checkFavourite(event: Event, item: any)
  {
    event.preventDefault();
    //item.selected = item.selected === true ? false : true;
    item.event = event;
    this.favouriteEvent.emit(item);
  }
  isShow(){
    return this.isShown;
  }
}
