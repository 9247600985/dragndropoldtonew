import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { control } from '../utils/control';

declare var $: any;
@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.css']
})
export class RichTextEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() actionEvent = new EventEmitter<any>();
  @Input() item:any;
  @Input() widgetIndex:any;
  @Input() controlType:any;
  @Input() tools:any;
  constructor() { }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }

  ngOnInit() {
    
  }
  ngAfterViewInit()
  {
    let questionElem:any = document.getElementById('question' + this.widgetIndex) as HTMLElement;
    if(questionElem)
      questionElem.innerHTML = this.item.label;
  }
  getEditorText(event: Event, question:  control)
  {
    this.actionEvent.emit({action: 'getEditorText', params: [event]});
  }
  openEditorJq(event: Event, question:  control, iframeId: string)
  {
    $('#question'+iframeId).addClass('d-none');
    $('#iframe'+iframeId).removeClass('d-none');
    $('#editorBtn'+iframeId).removeClass('d-none');
    let ejsValue = $('#question'+iframeId).html();
    question.ejsValue = ejsValue;
    question.ejsText = $('#question'+iframeId).text();
    setTimeout(() => {
      $('#iframe'+iframeId+'_toolbar_Preview').parent().removeClass('e-overlay');
    }, 200);
  }
  hideEditorJq(event: Event, question: control, questionId: string)
  {
    $('#iframe'+questionId).addClass('d-none');
    $('#question'+questionId).removeClass('d-none');
    $('#editorBtn'+questionId).addClass('d-none');
    $('#question'+questionId).replaceWith(question.ejsValue?question.ejsValue:'');
    //$('#question'+questionId)
    let item:any = this.controlType.controls.find((x: any) => x.id === question.id);
    if(item !== undefined)
    {
      question.ejsText = $(question.ejsValue).find('b').text();
      item.text = question.ejsText;
      item.label = question.ejsValue;  
      //element.classList
      if(item.defaultType === 'accordion'){
        item.data[0].name = item.text;
      }   
    }
  }
  openEditor(event: Event, question:  control, iframeId: string)
  {
    (document.getElementById('question' + iframeId) as HTMLElement).classList.add('d-none');
    (document.getElementById('iframe' + iframeId) as HTMLElement).classList.remove('d-none');
    (document.getElementById('editorBtn' + iframeId) as HTMLElement).classList.remove('d-none');    
    question.ejsValue = (document.getElementById('question' + iframeId) as HTMLElement).innerHTML;    
    question.ejsText = (document.getElementById('question' + iframeId) as HTMLElement).innerText;
    setTimeout(() => {
      $('#iframe'+iframeId+'_toolbar_Preview').parent().removeClass('e-overlay');
    }, 200);
  }
  hideEditor(event: Event, question: control, questionId: string)
  {
    let questionElem:any = document.getElementById('question' + questionId) as HTMLElement;
    (document.getElementById('iframe' + questionId) as HTMLElement).classList.add('d-none');
    questionElem.classList.remove('d-none');
    (document.getElementById('editorBtn' + questionId) as HTMLElement).classList.add('d-none');
    let innerHTML = questionElem.innerHTML;
    innerHTML = innerHTML.replace(innerHTML, question.ejsValue?question.ejsValue:'')
    questionElem.innerHTML = innerHTML;//questionElem.innerHTML.replace(questionElem.innerHTML, question.ejsValue?question.ejsValue:'');*/
    //questionElem.innerHTML = question.ejsValue?question.ejsValue:'';
    let item:any = this.controlType.controls.find((x: any) => x.id === question.id);
    if(item !== undefined)
    {
      question.ejsText = $(question.ejsValue).find('b').text();
      item.text = question.ejsText;
      item.label = question.ejsValue;
    }
  }
  openRchEditor(widgetIndex:any){
    (document.getElementById('question' + widgetIndex) as HTMLElement).click();
  }
}
