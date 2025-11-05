import { Injectable, Injector } from '@angular/core';
//import fluentReports from 'fluentreports';
declare var window:any;
//var fluentReports = require('fluentreports');
//var FluentReportsGenerator = require('../../assets/reports/fluentReportsGenerator');
@Injectable({
    providedIn: 'root'
  })
export class ReportUtil {
    load(){
        // Our Simple Data in Object format:
  /*const data = [{name: 'Elijah', age: 18}, {name: 'Abraham', age: 22}, {name: 'Gavin', age: 28}];
  
  // Create a Report  
  const rpt = new fluentReports.Report("Report.pdf")        
        .pageHeader( ["Employee Ages"] )      // Add a simple (optional) page Header...        
        .data( data )	 			 	      // Add some Data (This is required)
		.detail( [['name', 200],['age', 50]]) // Layout the report in a Grid of 200px & 50px
        .render(); */

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
        });*/
    }
}
