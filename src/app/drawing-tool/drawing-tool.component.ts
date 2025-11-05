import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
var ImageEditor = require('tui-image-editor');
var whiteTheme = require('../../assets/js/white-theme');
declare var require: any;
declare var $: any;
export class Files
{
  name: string;
  base64?: string;
  childs?:any [];
}
@Component({
  selector: 'app-drawing-tool',
  templateUrl: './drawing-tool.component.html',
  styleUrls: ['./drawing-tool.component.css']
})
export class DrawingToolComponent implements OnInit, AfterViewInit  {
  @Input() image: string;
  @Input() id: string;
  //src: string;
  imageEditor: any;
  imageType: any = [
    {id: 'Cataract', name: 'Cataract', 'img': 'assets/images/cornea.jpg'},
    {id: 'Cornea', name: 'Cornea', 'img': 'assets/images/cornea.jpg'},
    {id: 'Retina', name: 'Retina', 'img': 'assets/images/retina.jpg'},
  ];
  patProfile: any;
  @Output() downloadEvent = new EventEmitter<any>();
  stateData: any;
  fileToUpload: Files[] = [];
  fileChildUploads: Files[] = [];
  
  constructor(private router: Router, private deviceUtil:DeviceUtil, private gateway:HttpClient) { 
    let navigation = this.router.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }
  
  initializeImageEditor(imagePath: string)
  {
    // var FileSaver = require('file-saver'); //to download edited image to local. Use after npm install file-saver
    let imageEditorRef = $('#tui-image-editor-container')[0];
    //let imageEditorRef = document.querySelector('#tui-image-editor-container');
    //this.imageEditor = new ImageEditor(document.querySelector('#tui-image-editor-container'), {
      this.imageEditor = new ImageEditor(imageEditorRef, {
      includeUI: {
          loadImage: {
              path: imagePath,
              name: 'SampleImage'
          },
          // locale: locale_ru_RU,
          theme: whiteTheme, // or whiteTheme
          menu: ['shape', 'icon', 'crop', 'draw', 'text'],
          //initMenu: 'draw',
          menuBarPosition: 'right'
      },
      cssMaxWidth: 1200,
      //cssMaxHeight: 900,
      selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70
      },
      usageStatistics: false
    });
    /*let icons = [{'name':'cold', path:'./assets/images/drawingtools/cold.jpg'},
    {'name':'cough', path:'./assets/images/drawingtools/cough.jpg'},
    {'name':'headache', path:'./assets/images/drawingtools/headache.jpg'},
    {'name':'throat', path:'./assets/images/drawingtools/throat.jpg'},
    {'name':'muscle', path:'./assets/images/drawingtools/muscle.jpg'}
  ];
  icons.forEach((item:any)=>{
    this.createImgIcon(item);
  });*/
  $('.tui-image-editor-menu-icon .tie-icon-add-button .tie-icon-image-file').parent().parent().addClass('d-none');
    $('.tui-image-editor-header').css('display', 'none');
    $('.tui-image-editor-submenu').css('background-color','beige');
    //$('.tui-image-editor-header-logo>img').css('display', 'none');
    $('#tui-image-editor-container').height(500);    

  }
  /*createImgIcon(item:any){
    //let html = $('<div class="tui-image-editor-button" data-icontype="icon-"'+item.name+'><div><svg class="svg_ic-submenu"><use xlink:href="#ic-icon-arrow" class="normal use-default"></use><use xlink:href="#ic-icon-arrow" class="active use-default"></use></svg></div><label>'+item.name+'</label></div>');
    let html = $('<div class="tui-image-editor-button" data-icontype="icon-"'+item.name+'><div><img height="40" width="40" src="'+item.path+'"></img></div><label>'+item.name+'</label></div>');
    html.on('click', (event:any)=>{
      event.preventDefault();  
      this.imageEditor.ui._actions.icon.registCustomIcon(item.path, {name: item.name});   
    });
    $($('.tui-image-editor-menu-icon ul li')[0]).append(html);
  }*/
  createImgIcons(rootElem:any, item:any){
    //let html = $('<div class="tui-image-editor-button" data-icontype="icon-"'+item.name+'><div><svg class="svg_ic-submenu"><use xlink:href="#ic-icon-arrow" class="normal use-default"></use><use xlink:href="#ic-icon-arrow" class="active use-default"></use></svg></div><label>'+item.name+'</label></div>');
    let html = $('<div class="tui-image-editor-button custom-icon" data-icontype="icon-'+item.NAME+'"><div><img height="40" width="40" src="data:image/png;base64,'+item.CONTENT+'"></img></div><label>'+item.NAME+'</label></div>');
    html.on('click', (event:any)=>{
      event.preventDefault();  
      let file = this.dataURLtoFile('data:image/png;base64,'+item.CONTENT, item.NAME);
      this.imageEditor.ui._actions.icon.registCustomIcon('data:image/png;base64,'+item.CONTENT, file);   
    });
    rootElem.append(html);
    //$($('.tui-image-editor-menu-icon ul li')[0]).append(html);
  }
  ngOnInit(): void {
     if(!this.stateData){
       this.router.navigate(['/']);
       return;
     }
    let selectedAppt = this.deviceUtil.getGlobalData('appt-selected');
    if(selectedAppt){
      this.patProfile = selectedAppt;
        this.patProfile.name = this.patProfile.PatientName;
        this.patProfile.appointmentNo = selectedAppt.APPOINTMENTNO;
        if(selectedAppt.Image){
          this.patProfile.img = selectedAppt.Image;
        }else{
          this.patProfile.img = '../assets/images/avatar.png'
        }
    }
    this.loadImages();
    //this.initializeImageEditor(this.image);
    this.initializeImageEditor('./assets/images/cornea.jpg');
    //this.deviceUtil.hideHeaderNavbar();
  }

  ngAfterViewInit()
  {

  }

  getCanvas(event: any)
  {
    //this.src = this.imageEditor.toDataURL();
    console.log(this.imageEditor.toDataURL());
    let data = {
      imageData: this.imageEditor.toDataURL(),
      imageType: '',
      imageId: this.id
    }

    // const typeValue = (document.getElementById('type') as HTMLInputElement).value;
    // let item = this.imageType.find((x: any) => x.id === typeValue);
    // if (item !== undefined)
    // {
    //   data.imageType = item.id
    // }

    this.downloadEvent.emit(data);
  }

  reInitialize(event: any)
  {
    const typeValue = (document.getElementById('type') as HTMLInputElement).value;
    let item = this.imageType.find((x: any) => x.id === typeValue);
    let imagePath;
    if(item != undefined)
    {
      imagePath = item.img;
    }
    
    this.initializeImageEditor(imagePath);
  }
  isDisplayPatient(){
    if(this.stateData)
      return this.patProfile !== null;
    return false;
  }

  // initializeImageInEditor(event: any, imagePath: string)
  // {
  //   this.imageType[0].img = imagePath;
  //   setTimeout(() => {
  //     const typeValue = document.getElementById('type') as HTMLInputElement; 
  //     typeValue.value = 'Cataract';
  //     this.reInitialize(event);
  //   }, 200);
  // }

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
  loadChildImages(images:any) {
    if(images.length === 0){
      let observable = new Observable<any>(observer => {
        observer.next([]);
        observer.complete();
      });
      observable.subscribe(()=>{        
      });
    }else{
      let filter = new Filter(Expr.eq('STATUS', 0));
      filter.and(Expr.in('NAME', images));    
      this.gateway.get("/api/v1/drawchildimage"+filter.get()).subscribe((result:any)=>{
        if (result.status === 0 && result.results.length > 0) {
          $('.custom-icon').empty();
          let rootElement = $($('.tui-image-editor-menu-icon ul li')[0]);
          let rootEl = $('<div></div>');
          result.results.forEach((item:any)=>{                    
            this.createImgIcons(rootEl, item);
          });
          rootElement.append(rootEl);
        }
      });
    }
  }
  changeImage(event:any){
    
    let imageName = event.target.value;
    let found:any = this.fileToUpload.find((item:any)=>item.name === imageName);
    if(found){
      let file = this.dataURLtoFile('data:image/png;base64,'+found.base64, found.name);
      this.imageEditor.loadImageFromFile(file).then((result:any) => {
        //console.log('old : ' + result.oldWidth + ', ' + result.oldHeight);
        //console.log('new : ' + result.newWidth + ', ' + result.newHeight);
      });
      if(this.imageEditor.ui._buttonElements['icon'].classList.contains('active'))
        this.imageEditor.ui.changeMenu('icon');
      this.loadChildImages(found.childs);
    }    
  }
  dataURLtoFile(dataurl:any, filename:any) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}
}
