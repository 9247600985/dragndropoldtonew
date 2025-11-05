import { Component, OnInit, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dragndrop',
  templateUrl: './dragndrop.component.html',
  styleUrls: ['./dragndrop.component.css']
})
export class DragndropComponent implements OnInit {

  @Input() draggableItems: any;

  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.draggableItems, event.previousIndex, event.currentIndex);
  }

  deleteItem(event: Event, item: any)
  {
    let index = this.draggableItems.findIndex((x: any) => x.id === item.id);
    this.draggableItems.splice(index, 1);
  }

}
