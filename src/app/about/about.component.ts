import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Jumbotron } from './../jumbotron/jumbotron.component';
declare var $: any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit {

  jumbotron: Jumbotron = {
    name: 'About Us',
    specialiation: '',
    img: '',
    icon: 'info',
    stateData: ''
  };
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $('.scrollableDiv').height($(window).height() - $('.jumbotron').height() - 100);
  }

  onNavigateBack(event: any)
  {
    this.router.navigate(['/']);
  }

}
