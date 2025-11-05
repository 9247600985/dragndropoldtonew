import { Component, OnInit, Input, ViewChild, EventEmitter, ElementRef, Output } from '@angular/core';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.css']
})
export class InlineEditComponent implements OnInit {

  @Input() name: string;
  @Output() actionEvent = new EventEmitter<any>();
  @ViewChild('editField') editField: ElementRef;

  isEditing = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  onClick(event: any) {
    this.isEditing = !this.isEditing;
    
    // if (event) {
    //   const style = getComputedStyle(event.target);
    //   if (this.editField) {
    //     this.editField.nativeElement.style.font = style.font;
    //     // this.editField.nativeElement.style.fontSize = style.fontSize;
    //     // this.editField.nativeElement.style.fontWeight = style.fontWeight;
    //   }

    //   console.log(style.fontSize);
    // }

    this.actionEvent.emit({
      value: this.name,
      isEditing: this.isEditing
    });
    setTimeout(() => this.editField.nativeElement.focus(), 0);
    this.editField.nativeElement.select();
  }

}
