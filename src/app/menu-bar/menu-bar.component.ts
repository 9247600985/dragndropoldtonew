import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  @Output() menuAction = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onNavigation(event: any, type: string)
  {
    event.preventDefault();
    event.menuAction = type;
    this.menuAction.emit(event);
  }

}
