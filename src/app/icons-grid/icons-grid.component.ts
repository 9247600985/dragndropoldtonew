import { Component, OnInit, Input } from '@angular/core';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  // { path: '/consult', title: 'Coronavirus\nAssessment',  icon: 'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'User Profile',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Table List',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Typography',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Icons',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Maps',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Notifications',  icon:'fas fa-virus', class: '' },
  //   { path: '/consult', title: 'Upgrade to PRO',  icon:'fas fa-virus', class: 'active-pro' },
];
@Component({
  selector: 'app-icons-grid',
  templateUrl: './icons-grid.component.html',
  styleUrls: ['./icons-grid.component.css']
})
export class IconsGridComponent implements OnInit {
  @Input() iconItems: any[];
  constructor() { }

  ngOnInit() {
    //this.iconItems = ROUTES.filter(iconItem => iconItem);
  }

}
