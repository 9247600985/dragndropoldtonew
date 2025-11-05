import { Component, Input, OnInit } from '@angular/core';
import { Tab } from './tab';

@Component({
  selector: 'app-tabs-widget',
  templateUrl: './tabs-widget.component.html',
  styleUrls: ['./tabs-widget.component.css']
})
export class TabsWidgetComponent implements OnInit {
  @Input() 
  tabs: Tab[] = [
    {
      title: 'HTML',
      active: true,
      iconClass: 'fab fa-html5',
      content: [`<strong>HTML(HyperText Markup Language)</strong> is the most basic building block of the Web.
        It describes and defines the content of a webpage along with the basic layout of the webpage.
        Other technologies besides HTML are generally used to describe a web page's
        appearance/presentation(CSS) or functionality/ behavior(JavaScript).`]
    },
    {
      title: 'CSS',
      active: false,
      iconClass: 'fab fa-css3',
      content: [`<strong>Cascading Style Sheets(CSS)</strong> is a stylesheet language used to describe
        the presentation of a document written in HTML or XML (including XML dialects
        such as SVG, MathML or XHTML). CSS describes how elements should be rendered on screen,
        on paper, in speech, or on other media.`]
    },
    {
      title: 'JavaScript',
      active: false,
      iconClass: 'fab fa-js-square',
      content: [`<strong>JavaScript(JS)</strong> is a lightweight interpreted or JIT-compiled programming
        language with first-class functions. While it is most well-known as the scripting
        language for Web pages, many non-browser environments also use it, such as Node.js,
        Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm,
        dynamic language, supporting object-oriented, imperative, and declarative
        (e.g. functional programming) styles.`]
    }
  ];
  JSON:JSON;
  @Input()
  data: Tab[];
  @Input()
  control:any;
  constructor() { }

  ngOnInit() {
    this.data.forEach((tab:Tab)=>{
      tab.title = this.control.label.replace(this.control.ejsText?this.control.ejsText:this.control.label, tab.title);
      tab.content.forEach((content:any)=>{
        for(let[key, value] of Object.entries(content)){
          let found = this.control.controls.find((item:any)=>item.id === key);
          if(found){
            content[key] = found.label.replace(found.ejsText?found.ejsText:found.label, value);
          }
        }
      });
    });
  } 

  changeTab(index: number) {
    //this.tabs = this.tabs.map((tab, i) => i === index ? { ...tab, active: true } : { ...tab, active: false });
    this.data = this.data.map((tab, i) => i === index ? { ...tab, active: true } : { ...tab, active: false });
  }
  
  
}
