declare var window:any;
export class ReportEvaluator {
    execute(input:any, output:any, context:any){
        let pipeStream = new window.fluentReports.BlobStream();
        // Create the Report
        let rpt = new window.fluentReports.ReportBuilder(context.template, context.data);

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
        });
    }
}
