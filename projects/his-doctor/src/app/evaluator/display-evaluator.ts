import { DialogPopupService } from "../dialog-popup/dialog-popup.service";

export class DisplayEvaluator {
    constructor(private dialogService: DialogPopupService){}
    execute(input:any, output:any, context:any){
        if(!context)
        return;                
        let status = true;
        if(input && input.length > 0){
            let control = context.control;
            let controlName = '';
            let controlValue = '';            
            controlName = control.name;
            controlValue = control.value; 
            if(control.type === "checkbox"){
                let optn = control.options.find((opt:any)=>opt.defaultSelect === true);
                if(optn){
                    controlValue = ''+true;
                }
            }                    
            input.forEach((item:any)=>{
                status = status && (item.scope.paramName === controlName && item.element === controlValue);
            });
            
        }
        let frmContext = context;
        if(context.source)
            frmContext = context.source;        
        let target = frmContext.controls.find((item:any)=>item.id === output[0].element.id);
        if(target){
            target.canShow = status;
            if(target.type === 'popup'){
                this.dialogService.open('custom-modal-2');
            }
        }        
    }
}
