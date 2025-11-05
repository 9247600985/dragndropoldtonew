import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Jumbotron } from './../jumbotron/jumbotron.component';
declare var $: any;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit, AfterViewInit {

  jumbotron: Jumbotron = {
    name: "FAQ's",
    specialiation: '',
    img: '',
    icon: 'question',
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

  toggleDiv(x: any, event: any)
  {
    console.log(event.currentTarget.dataset.target);
    console.log(event);
    if($(event.currentTarget.dataset.target).hasClass('show'))
      $(event.currentTarget.dataset.target).css('visibility', 'hidden');
    else
      $(event.currentTarget.dataset.target).css('visibility', 'visible');
  }

}
