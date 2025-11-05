import { OnInit, Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  @Input() headerMessage: string='';
  fileToUpload: File[] = [];
  @ViewChild('myInput') myInputVariable: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  returnFileData={
    file: File,
    base64: ''
  };
  message: File;

  @Output() messageEvent = new EventEmitter<any>();

  sendMessage() {
    //this.messageEvent.emit(this.message);
  }

  callUpload()
  {
    this.myInputVariable.nativeElement.click();
  }

  removeItem(item: any)
  {
    let index = this.fileToUpload.findIndex((x: any) => x.name === item.name);
    this.fileToUpload.splice(index, 1);
  }

  handleFileInput(files: FileList) {
    console.log(files.length);
    this.fileToUpload.push(<File>files.item(0));
    this.messageEvent.emit(<File>files.item(0));
    this.myInputVariable.nativeElement.value = '';
  }

  // handleFileInputs(event: Event) {
  //   let me = this;
  //   let fileData = {};
  //  let file = event.target.files[0];
  //  let reader = new FileReader();
  //  reader.readAsDataURL(file);
  //  reader.onload = function () {
  //    //me.modelvalue = reader.result;
  //    fileData = {
  //      base64: reader.result,
  //      //file: file
  //    };
  //    this.messageEvent.emit(fileData);
  //    console.log(reader.result);
  //  };
  //  reader.onerror = function (error) {
  //    console.log('Error: ', error);
  //  };
  //  this.messageEvent.emit(fileData);
  // }

  handleFileInputs(evt: any)
  {
    const file = evt.target.files[0];
    this.returnFileData.file=file;
    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.returnFileData.base64 = btoa(e.target.result);
    this.myInputVariable.nativeElement.value = '';
    this.messageEvent.emit(this.returnFileData);
  }

}
