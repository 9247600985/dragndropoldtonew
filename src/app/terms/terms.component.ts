import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Jumbotron } from './../jumbotron/jumbotron.component';
declare var $: any;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit, AfterViewInit {

  jumbotron: Jumbotron = {
    name: 'Privacy Policy',
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

  gotoPrivacy(event: Event)
  {
    event.preventDefault();
    this.router.navigate(['/privacy']);
  }

}
