import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject, from } from 'rxjs';
//declare var $: any;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements AfterViewInit, OnDestroy, OnInit {

  title = 'DATATABLE';
  message = '';
  //ArrayResponse=[];

  @ViewChild(DataTableDirective, { static: false }) 
  dtElement: DataTableDirective;
  @ViewChild(DataTableDirective, { static: false }) 
  dtableElement: DataTableDirective;


  dtOptions: DataTables.Settings = {};
  dtableOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject();
  dtableTrigger: Subject<any> = new Subject();

  @Input() dtBody: any =[];  
  @Input() dtHeader: any =[];
  @Input() dtCaption: string;

  @Output() actionEvent = new EventEmitter<any>();
  @Output() hoverActionEvent = new EventEmitter<any>();
  @Output() hoverOutActionEvent = new EventEmitter<any>();
  @Output() onLoadActionEvent = new EventEmitter<any>();
  
  @Input()
  tableData:any;
  ngOnInit(): void {
    if(this.tableData){
      this.dtCaption = this.tableData.dtCaption;
      this.dtHeader = this.tableData.dtHeader;
      this.dtBody = this.tableData.dtBody;
    }
    this.loadTableData();
  }
  loadTableData(): void {
    let count=0;
    let header: any=[];
    if(this.dtBody !== null && this.dtBody !== undefined && this.dtBody.length > 0){
      if(!this.dtHeader || this.dtHeader.length === 0){
        this.dtBody.forEach((element: any) => {
          if(count==0){
            this.dtHeader = Object.keys(element);
          }
          count++;
        });
    
    if(this.dtHeader)
      this.dtHeader.forEach((element: any) => {
        header.push({title: element.toUpperCase(), data: element});
      });
    }else{
      header = this.dtHeader;
    }    
    this.dtOptions = {
      data:this.dtBody,
      // columns: [{title: 'User ID', data: 'id' },
      //           {title: 'First Name', data: 'firstName'},
      //           {title: 'Last Name', data: 'lastName' }
      //         ],
      columns:header,      
      scrollY:'50vh',
      /*columnDefs : [
                      //hide the second & fourth column
                      //{ 'visible': false, 'targets': [0,1,2,3] }
                      { 
                        "targets": [ 3 ],
                        "visible": false,
                        "searchable": false
                        }
                  ],*/
                  rowCallback: (row: any, data: any[] | Object, index: number) => {
                    const self = this;
                    // Unbind first in order to avoid any duplicate handler
                    // (see https://github.com/l-lin/angular-datatables/issues/87)
                    
                    // row.onmouseover = (event: any)=>{
                    //   self.hoverHandler(event, row, data);
                    // };

                    if(row.children[3]!=undefined)
                      row.children[3].onmouseover = (event: any)=>{
                        self.hoverHandler(event, row, data);
                      };
                    
                    row.onmouseout = (event: any)=>{
                      //console.log(event);
                      self.hoverOutHandler(event, row, data);
                    };
                    row.onclick = undefined;
                    row.ondblclick = ()=>{
                      self.dblClickHandler(data);
                    };

                    //on load
                    row.onloadeddata = (event: any)=>{
                      //console.log(event);
                      self.onLoadHandler(event, row, data);
                    };

                   // $('td', row).unbind('click');
                   /* $('td', row).bind('dblclick', () => {
                      self.dblClickHandler(data);
                    });*/
                    return row;
                  }                    
    };
  }
  }

  hoverHandler(event: any, rowData: any, info: any): void
  {
    this.hoverActionEvent.emit({event: event, row: rowData, info: info})
  }

  hoverOutHandler(event: any, rowData: any, info: any): void
  {
    this.hoverOutActionEvent.emit({event: event, row: rowData, info: info})
  }

  onLoadHandler(event: any, rowData: any, info: any): void
  {
    this.onLoadActionEvent.emit({event: event, row: rowData, info: info})
  }
  
  dblClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.name;
    this.actionEvent.emit(info);
  }

  ngAfterViewInit(): void {
   // this.loadTableData();
    if(this.dtBody !== null && this.dtBody !== undefined && this.dtBody.length > 0){
    this.dtTrigger.next();
    }
  }
  renderTable(dataTable:any){
    this.dtBody = dataTable;
    this.ngAfterViewInit();
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();

    // Do not forget to unsubscribe the event
    this.dtableTrigger.unsubscribe();

   /*if ($.fn.DataTable.isDataTable( '#_zonetable' )) {
    //   // call the loader
      $('#_zonetable').dataTable().api().destroy();
    }*/
  }

  rerender(dataTable:any): void {
    this.dtableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      this.renderTable(dataTable);
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
    });
  }

  /*ServiceFunction() {
    //this.ArrayResponse=[];
    if ($.fn.DataTable.isDataTable( '#_zonetable' )) {
      //   // call the loader
        $('#_zonetable').dataTable().api().destroy();
      }


    //this.ArrayResponse = MENU_ITEM; //here you will get JSON response
     // Calling the DT trigger to manually render the table
    // debugger;

    if ($.fn.DataTable.isDataTable( '#_zonetable')) {
    // call the loader
      $('#_zonetable').dataTable().api().destroy();
        }
        this.dtTrigger.next();
        //console.log(this.ArrayResponse);
        setTimeout(() => {
          $('.overlaysv').hide();              
        }, 2000);

  }*/

  // updateTable()
  // {
  
  // this.dtBody=[
  //   {"id": 701, "firstName": "NARESH", "lastName": "KUMAR"},
  //   {"id": 702, "firstName": "TARAKA", "lastName": "VENKATA"},
  //   {"id": 703, "firstName": "MALLESWARA", "lastName": "KUMAR"},
  // ];
  // this.dtElement.dtOptions.data=this.dtBody;
      
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     this.dtBody=[
  //       {"id": 701, "firstName": "NARESH", "lastName": "KUMAR"},
  //       {"id": 702, "firstName": "TARAKA", "lastName": "VENKATA"},
  //       {"id": 703, "firstName": "MALLESWARA", "lastName": "KUMAR"},
  //     ];
  //     this.dtElement.dtOptions.data=this.dtBody;
      
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }


  updateTable()
  {

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        this.dtBody=[
          {id: '0001', appointmentNo: 'AP-20-000232', appointmentDate: '2020-09-29', name: 'Naresh Kumar', patType: 'OP'},
      {id: '0002', appointmentNo: 'AP-20-000233', appointmentDate: '2020-10-06T00:00:00.000Z', name: 'Naresh k', patType: 'IP'}
        ];
        this.dtElement.dtOptions.data=this.dtBody;
        
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });

  }

}
