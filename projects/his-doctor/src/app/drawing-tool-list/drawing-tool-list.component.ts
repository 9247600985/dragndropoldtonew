import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastComponent } from '../toast/toast.component';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Inserter } from '../utils/inserter';
export class Files
{
  name: string;
  base64?: string;
  childs?:any [];
}
@Component({
  selector: 'app-drawing-tool-list',
  templateUrl: './drawing-tool-list.component.html',
  styleUrls: ['./drawing-tool-list.component.scss']
})
export class DrawingToolListComponent implements OnInit {
  fileToUpload: Files[] = [];
  fileChildUploads: Files[] = [];
  imageList:any = [];
  stateData:any;
  parentImg:any = {
    name: ''
  };
  imageSelect:string = '';
  requireDel:boolean = false;
  
  @ViewChild('rootImg') myInputVariable: ElementRef;  
  constructor(private router:Router, private gateway:HttpClient, private toast:ToastComponent) { 
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }

  ngOnInit() {
    if (!this.stateData){
      this.router.navigate(['/']);
      return;
    }
    this.loadImages();
  }

  receiveMessage(event:any){
    this.fileChildUploads.push({
      name: event.file.name,
      base64: event.base64,
    });
  }
  addActionMapping(){}
  closeEditor(){}
  changeImage(event:any){
    if(this.parentImg.name === event.target.value)
      return;
    let imageName = event.target.value;
    if(imageName === 'create'){
      this.parentImg  = {
        name: ''
      };
      this.callUpload();      
    }else{
      let found:any = this.fileToUpload.find((item:any)=>item.name === imageName);
      if(found){
        this.parentImg.base64 = found.base64;
        this.parentImg.name = found.name;
        this.parentImg.childs = found.childs;
        this.requireDel = true;
        this.loadChildImages();
      }
    }
  }
  callUpload(){
    var elem = this.myInputVariable.nativeElement;
   if(elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
   }
  }
  handleFileInputs(evt: any){
    const file = evt.target.files[0];    
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this, file.name);
      reader.readAsBinaryString(file);
      
    }
  }
  handleReaderLoaded(fileName:string, e: any) {
    this.myInputVariable.nativeElement.value = '';
    let base64 = btoa(e.target.result);
    this.parentImg.base64 = base64;
    this.parentImg.name = fileName;
    this.requireDel = true;
  }
  removeImage(){
    let foundIdx = this.fileToUpload.findIndex((item:any)=>item.name === this.parentImg.name);
    if(foundIdx > -1){
      this.fileToUpload.splice(foundIdx, 1);
      this.delChildImage(this.parentImg.childs).subscribe((result:any)=>{
        if (result.status === 0) {
          this.fileChildUploads = [];        
          this.deleteImage().subscribe((result:any)=>{
            if (result.status === 0) {
              this.toast.showSuccess('Image Deleted');
            }
          });
          this.parentImg  = {
            name: ''
          };
          this.imageSelect = '';
        }
      });
    }
  }
  removeChildImage(elem:any){
    let foundIdx = this.fileChildUploads.findIndex((item:any)=>item.name === elem.name);
    if(foundIdx > -1){
      this.fileChildUploads.splice(foundIdx, 1);
      this.delChildImage([elem.name]).subscribe((result:any)=>{
        if (result.status === 0) {
          this.toast.showSuccess("Child Image Removed.");
        }
      });
    }
  }
  addImages(){
    if(this.parentImg.childs)
      this.delChildImage(this.parentImg.childs).subscribe((result:any)=>{
        if (result.status === 0) {
          this.toast.showSuccess("Child Image Removed.");
        }
      });
    this.deleteImage().subscribe((result:any)=>{
      if (result.status === 0) {
        this.addImage();   
      }
    });
  }

  delChildImage(images:any) {
    if(images.length > 0){
      let filter = new Filter(Expr.eq('STATUS', 0));
      filter.and(Expr.in('NAME', images));
      return this.gateway.delete("/api/v1/drawchildimage"+filter.get());
    }else{
      return new Observable<any>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
  }
  addChildImage(data:any) {
    let inserter = new Inserter(data);
    this.gateway.post("/api/v1/drawchildimage", inserter.get()).subscribe((result:any)=>{
      if (result.status === 0) {
        this.toast.showSuccess("Child Image Added.");
      }
    });
  }
  addImage() {
    let childs:any = [];
    this.fileChildUploads.forEach((image:any)=>{
      childs.push(image.name);
    });
    let inserter = new Inserter({NAME: this.parentImg.name, CONTENT: this.parentImg.base64, STATUS:0, CHILD: childs});    
    this.gateway.post("/api/v1/drawimage", inserter.get()).subscribe((result:any)=>{
      if (result.status === 0) {
        this.fileToUpload.push({name: this.parentImg.name, base64: this.parentImg.base64, childs: childs});
        this.toast.showSuccess("Image Added.");
        this.fileChildUploads.forEach((item:any)=>{
          this.addChildImage({NAME: item.name, CONTENT: item.base64, STATUS:0});
        });
      }
    });
  }
  deleteImage(){
    let filter = new Filter(Expr.eq('STATUS', 0));
    filter.and(Expr.eq('NAME', this.parentImg.name));
    return this.gateway.delete("/api/v1/drawimage"+ filter.get());
  }
  loadImages() {
    let filter = new Filter(Expr.eq('STATUS', 0));    
    this.gateway.get("/api/v1/drawimage"+filter.get()).subscribe((result:any)=>{
      if (result.status === 0 && result.results.length > 0) {
        result.results.forEach((item:any)=>{
          let file:Files = new Files();
          file.name = item.NAME;
          file.base64 = item.CONTENT;
          file.childs = item.CHILD;
          this.fileToUpload.push(file);
        });
      }
    });
  }
  loadChildImages() {
    this.fileChildUploads = [];
    if(this.parentImg.childs.length > 0){
      let filter = new Filter(Expr.eq('STATUS', 0));
      filter.and(Expr.in('NAME', this.parentImg.childs));    
      this.gateway.get("/api/v1/drawchildimage"+filter.get()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          result.results.forEach((item:any)=>{
            let file:Files = new Files();
            file.name = item.NAME;
            file.base64 = item.CONTENT;          
            this.fileChildUploads.push(file);
          });
        }
      });
    }
  }
}
