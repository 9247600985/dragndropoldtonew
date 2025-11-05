import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { DeviceUtil } from '../utils/DeviceUtil';
import { Expr } from '../utils/expr';
import { Filter } from '../utils/filter';
import { Inserter } from '../utils/inserter';
import { ReportUtil } from '../utils/report-util';
import { Updater } from '../utils/updater';
//import fluentReports from 'fluentreports';
declare var window:any;
var FluentReportsGenerator = require('../../assets/reports/fluentReportsGenerator');
@Component({
  selector: 'app-report-engine',
  templateUrl: './report-engine.component.html',
  styleUrls: ['./report-engine.component.css']
})
export class ReportEngineComponent implements OnInit,AfterViewInit {
    stateData:any;
    mappedSectionCode:any = '';
    formType:any={};
    rowId:any;
    @ViewChild('.fluentReports') fluentReports:ElementRef;
    defTemplate:any = {
        "type": "report",
        "dataUUID": 10002,
        "version": 2,
        "fontSize": 8,
        "autoPrint": false,
        "name": "",
        "paperSize": "letter",
        "paperOrientation": "portrait",
        "fonts": [],
        "variables": {
            "counter": 0
        },
        "subReports": [
            {
                "dataUUID": 10003,
                "dataType": "parent",
                "data": "emphours",
                "groupBy": [
                    {
                        "type": "group",
                        "groupOn": "week",
                        "header": {
                            "children": [
                                {
                                    "skip": true,
                                    "type": "function",
                                    "function": "vars.counter=0;",
                                    "async": false,
                                    "name": "counter reset"
                                }
                            ]
                        },
                        "detail": {
                            "children": []
                        },
                        "footer": {
                            "children": []
                        }
                    }
                ],
                "type": "report",
                "detail": {
                    "children": [
                        {
                            "type": "function",
                            "function": "vars.counter++;",
                            "name": "increase counter"
                        }
                    ]
                },
                "calcs": {
                    "sum": [
                        "hours"
                    ]
                }
            }
        ],
        "pageHeader": {
            "children": []
        },
        "groupBy": [
            {
                "type": "group",
                "groupOn": "name",
                "header": {
                    "children": []
                },
                "detail": {
                    "children": []
                },
                "footer": {
                    "children": [
                        {
                            "type": "calculation",
                            "op": "concat",
                            "name": "totals",
                            "fields": [
                                {
                                    "text": "Totals for "
                                },
                                {
                                    "field": "name"
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        "finalSummary": {
            "children": []
        },
        "formatterFunctions": {
            "NameDisplay": "callback('Name: ' + row.name)",
            "HoursDisplay": "callback('Hours: ' + input)"
        }
    };
  constructor(private route: Router, private deviceUtil:DeviceUtil, private gateway:HttpClient, private reportUtil:ReportUtil) { 
    let navigation = this.route.getCurrentNavigation();
    if(navigation)
      this.stateData = navigation.extras.state;
  }
  ngAfterViewInit(){
    let height:any = $('.fluentReports').height();
    $('.fluentReports').height(height+200);
    
  }
  ngOnInit() {
    if (!this.stateData){
        this.route.navigate(['/login']);
        return;
      }      
    this.formType = this.stateData.template;
    if(!this.formType){
        this.stateData.isNewTemplate = true;  
        this.formType = this.defTemplate;  
        this.stateData.template = this.formType;    
    }
    this.rowId = this.stateData.rowId;
    const data1 = [
      {id: 1, name: "Tharak Doe", emphours: [
              {week: 20, day: "Monday", hours: 4},
              {week: 20, day: "Tuesday", hours: 8},
              {week: 20, day: "Wednesday", hours: 8},
              {week: 21, day: "Thursday", hours: -2},
              {week: 21, day: "Friday", hours: 8},

              {week: 22, day: "Monday", hours: 4},
              {week: 22, day: "Tuesday", hours: 8},
              {week: 22, day: "Wednesday", hours: 8},
              {week: 23, day: "Thursday", hours: 2},
              {week: 23, day: "Friday", hours: 8},

              {week: 25, day: "Monday", hours: 4},
              {week: 25, day: "Tuesday", hours: 8},
              {week: 25, day: "Wednesday", hours: 8},
              {week: 26, day: "Thursday", hours: 2},
              {week: 26, day: "Friday", hours: 8}
          ]},
      {id: 3, name: "Sarah Williams", emphours: [
              {week:20, day: "Monday", hours: 8}
          ]},
      {id: 5, name: "Jane Doe", emphours: [
              {week: 20, day: "Monday", hours: 5},
              {week: 20, day: "Tuesday", hours: 8},
              {week: 21, day: "Wednesday", hours: 7},
              {week: 21, day: "Thursday", hours: 8},
              {week: 21, day: "Friday", hours: 8},

              {week: 22, day: "Monday", hours: 5},
              {week: 22, day: "Tuesday", hours: 8},
              {week: 23, day: "Wednesday", hours: 7},
              {week: 23, day: "Thursday", hours: 8},
              {week: 23, day: "Friday", hours: 8},

              {week: 25, day: "Monday", hours: 5},
              {week: 25, day: "Tuesday", hours: 8},
              {week: 26, day: "Wednesday", hours: 7},
              {week: 26, day: "Thursday", hours: 8},
              {week: 26, day: "Friday", hours: 8}
          ]}
  ];

  let reportData = {
      "type": "report",
      "dataSet": 0,
      "fontSize": 8,
      "autoPrint": false,
      "name": "demo19.pdf",
      "paperSize": "letter",
      "paperOrientation": "portrait",
      "fonts": [],
      "variables": {
          "counter": 0
      },
      "pageHeader": [
          {
              "type": "raw",
              "values": [
                  "Customer Hours"
              ]
          }
      ],
      "groupBy": [
          {
              "type": "group",
              "groupOn": "name",
              "header": [
                  {
                      "field": "name",
                      "settings": {
                          "formatFunction": "NameDisplay",
                          "fontBold": true,
                          "fill": "#6f6f6f",
                          "textColor": "#ffffff",
                          "link": "http://www.fluentReports.com/"
                      },
                      "type": "print"
                  }
              ],
              "detail": [],
              "footer": [
                  {
                      "type": "calculation",
                      "op": "concat",
                      "name": "totals",
                      "fields": [
                          {
                              "text": "Totals for "
                          },
                          {
                              "field": "name"
                          }
                      ]
                  },
                  {
                      "settings": {
                          "fillOpacity": 1,
                          "align": 0
                      },
                      "type": "band",
                      "fields": [
                          {
                              "function": {
                                  "type": "function",
                                  "name": "Totals for data.name",
                                  "function": "return `Totals for ${data.name}`",
                                  "async": false
                              },
                              "width": 180
                          },
                          {
                              "total": "hours",
                              "width": 100,
                              "align": 3
                          }
                      ]
                  },
                  {
                      "type": "newLine"
                  }
              ]
          }
      ],
      "subReport": {
          "dataSet": 1,
          "groupBy": [
              {
                  "type": "group",
                  "groupOn": "week",
                  "header": [
                      {
                          "skip": true,
                          "type": "function",
                          "function": "vars.counter=0;",
                          "async": false,
                          "name": "counter reset"
                      },
                      {
                          "async": true,
                          "name": "Print Function",
                          "settings": {
                              "x": 100
                          },
                          "function": {
                              "function": "done(`Week Number: ${data.week}`);",
                              "type": "function",
                              "async": true,
                              "name": "Print Function"
                          },
                          "type": "print"
                      }
                  ],
                  "detail": [],
                  "footer": [
                      {
                          "type": "newLine"
                      }
                  ]
              }
          ],
          "type": "report",
          "detail": [
              {
                  "type": "function",
                  "function": "vars.counter++;",
                  "name": "increase counter"
              },
              {
                  "settings": {
                      "fillOpacity": 1,
                      "fill": {
                          "type": "function",
                          "function": "return (vars.counter % 2 === 0 ? '#f0f0f0' : '#e0e0e0');",
                          "name": "fill"
                      },
                      "textColor": "#0000ff",
                      "align": 0,
                      "wrap": true
                  },
                  "type": "band",
                  "fields": [
                      {
                          "text": "",
                          "width": 80
                      },
                      {
                          "field": "day",
                          "width": 100
                      },
                      {
                          "field": "hours",
                          "width": 100,
                          "align": 3,
                          "textColor": {
                              "type": "function",
                              "function": "return data.hours < 0 ? '#FF0000' : '#000000';",
                              "name": "textColor"
                          },
                          "formatFunction": "NumberFunction"
                      }
                  ]
              }
          ],
          "dataType": "parent",
          "data": "emphours",
          "calcs": {
              "sum": [
                  "hours"
              ]
          }
      },
      "finalSummary": [
          {
              "type": "raw",
              "values": [
                  "Total Hours:",
                  "hours",
                  3
              ]
          }
      ],
      "formatterFunctions": {
          "NameDisplay": "callback('Name: ' + row.name)",
          "HoursDisplay": "callback('Hours: ' + input)",
      }

  };
  this.reportUtil.load();
  /*const data:any = [{sno:1, name:'Test', dept:'Software'}];
      const frg = new FluentReportsGenerator({
          id: "fluentReportsEditor",
          data: data,
          report: this.formType,
          debug: true,
          //css:false,
          //js:false,
          preview: true,  
          formatterFunctions: {
              'NumberFunction': (input:any, data:any, callback:any)=>{
                  if(input !== Math.round(input)){
                      callback(input);
                      return;
                  }
                  callback (input + '.0');
              }
          },
          save: (value:any, done:any) => {
              console.log("Saving");
                this.createTemplate(value);
              //const results:any = document.getElementById("results");
              //results.innerText = JSON.stringify(value, null, 4);
              done();
          }
      });*/
      /*const frg = new FluentReportsGenerator({
        id: "fluentReportsEditor",
        //data: data,
        //report: this.formType,
        debug: true,
        //css:false,
        //js:false,
        preview: false,  
        formatterFunctions: {
            'NumberFunction': (input:any, data:any, callback:any)=>{
                if(input !== Math.round(input)){
                    callback(input);
                    return;
                }
                callback (input + '.0');
            }
        },
        save: (value:any, done:any) => {
            console.log("Saving");
              this.createTemplate(value);
            //const results:any = document.getElementById("results");
            //results.innerText = JSON.stringify(value, null, 4);
            done();
        }
    }); */   
  }
  dayNumber(data:any){
    return "Day Number: "+data.day;
    }
    createTemplate(reportData:any){
        if(reportData.name === ''){
            this.deviceUtil.showToast('Please provide the Report name.', true);
            return;
        }
        if(reportData.name && !reportData.name.endsWith('.pdf')){
            reportData.name +='.pdf';
        }
        let data:any = {
          TEMPTYPE: reportData.type,
          TEMPNAME: reportData.name,
          CONTENT: reportData,
          STATUS: 0
        };    
        if(this.stateData.isNewTemplate){
          let inserter = new Inserter(data);
          this.gateway.post<any>('/api/v1/rpttemplate', inserter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
            if (result.status === 0 && result.results.length > 0) {
              if(this.mappedSectionCode === ''){
                this.deviceUtil.showToast('Template created Successfully.', false);
                this.route.navigate(['/report-details'], {state: {}});
              }else{
                //this.updateTemplateMapping(result.results[0].id);
              }
            }
          });
        }else{
          let updater = new Updater(data);
          let filter = new Filter(Expr.eq("rowId", this.rowId));
          updater.addFilter(filter);
          this.gateway.put<any>('/api/v1/rpttemplate', updater.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
            if (result.status === 0 && result.results.length > 0) {
                this.deviceUtil.showToast('Template updated Successfully.', false);
                this.route.navigate(['/report-details'], {state: {}});
              //this.updateTemplateMapping(this.formType.tempId);
            }
          });
        }
      }
      deleteTemplate(reportData:any){    
        let filter = new Filter(Expr.eq("rowId", reportData.rowId));    
        this.gateway.delete<any>('/api/v1/rpttemplate'+filter.get(), this.deviceUtil.getJsonHeaders()).subscribe((result:any)=>{
          if (result.status === 0 && result.results.length > 0) {
            //this.updateTemplateMapping(this.formType.tempId);
          }
        });
      }
      loadReportsList(){
        this.route.navigate(['/report-details'], {state: this.stateData});
      }
      printReport(){
        /*let pipeStream = new window.fluentReports.BlobStream();
        // Create the Report
        let rpt = new window.fluentReports.ReportBuilder(this.formType, [{sno:1, name:'Test', dept:'Software'}]);

        // Send it to a pipe stream...
        rpt.outputType(1, pipeStream);

        
            // Console log the structure in debug mode
            rpt.printStructure();
            console.time("Rendered");
        rpt.render().then((pipe:any) => {            
                console.timeEnd("Rendered");
                //var fileURL = window.URL.createObjectURL(data);
                let tab = window.open();
                tab.location.href = pipe.toBlobURL('application/pdf');           
            //iFrame.src = pipe.toBlobURL('application/pdf');
        }).catch((err:any) => {
            console.error("Your report had errors while running", err);            
        });*/
        // Our Simple Data in Object format:
       /* var fluentReports = require('fluentreports');
  const data = [{name: 'Elijah', age: 18}, {name: 'Abraham', age: 22}, {name: 'Gavin', age: 28}];
  
  // Create a Report  
  const rpt = new fluentReports.Report("Report.pdf")        
        .pageHeader( ["Employee Ages"] )      // Add a simple (optional) page Header...        
        .data( data )	 			 	      // Add some Data (This is required)
		.detail( [['name', 200],['age', 50]]) // Layout the report in a Grid of 200px & 50px
        .render(); */
      }    
}
