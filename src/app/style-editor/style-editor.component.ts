import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-style-editor',
  templateUrl: './style-editor.component.html',
  styleUrls: ['./style-editor.component.scss']
})
export class StyleEditorComponent implements OnInit {
  styleProperties:any;
  conditionAttrs:any;
  constructor() { }

  ngOnInit() {
  }
  closeEditor(){}
  addActionMapping(){}
}
