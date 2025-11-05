import { EvaluatorUtil } from "./evaluator-util";

export class MatTableEvaluator {
    add2Control(cntrl: any, result: any) {
        let data = this.execute(cntrl, result);
        //cntrl.value = data;
    }
    private execute2(cntrl: any, result: any) {
        let target: any = [];
        let controls = cntrl.controls ? cntrl.controls : cntrl.matTable;
        result.forEach((item: any) => {
            let keys: any = Object.keys(item);
            controls.forEach((elem: any) => {
                Object.keys(elem).forEach((elemKey: any) => {
                    if (elem[elemKey].control.name === keys[0]) {
                        let tempCntrl = elem[elemKey].control;
                        switch (tempCntrl.type) {
                            case 'number':
                            case 'text':
                            case 'textarea':
                                tempCntrl.value = item[keys[0]].value;
                                break;
                            case 'dropdown':
                            case 'condition':
                                let options = tempCntrl.options.filter((opt: any) => {
                                    opt.defaultSelect = false;
                                    return opt;
                                });
                                let found = options.find((opt: any) => opt.value === item[keys[0]].value);
                                if (found) {
                                    found.defaultSelect = true
                                }
                                tempCntrl.options = options;
                                if (tempCntrl.type === 'condition')
                                    tempCntrl.value = item[keys[0]].value
                                break;
                        }
                    }
                });
            });
            return false;
        });
        return target;
    }
    private execute(cntrl: any, result: any) {
        let target: any = [];
        let controls = cntrl.controls ? cntrl.controls : cntrl.matTable;
        let rdx = 0;
        result.forEach((item: any) => {
            if (cntrl.autoGrow === true) {
                let newRow = controls[rdx];
                if (!newRow) {
                    newRow = JSON.parse(JSON.stringify(controls[0]));
                    controls.push(newRow);
                }
                Object.keys(newRow).forEach((elemKey: any) => {
                    let key = newRow[elemKey].control.name;
                    let tempCntrl = newRow[elemKey].control;
                    if (item[key])
                        this.addData(tempCntrl, item[key].value);
                });
            } else {
                for (let idx = 0; idx < controls.length; idx++) {
                    let row = controls[idx];
                    Object.keys(row).forEach((elemKey: any) => {
                        if (row[elemKey]?.control?.name) { // added by naresh, name if failing and cuases failing filling data in retrival
                            let key = row[elemKey].control.name;
                            let tempCntrl = row[elemKey].control;
                            if (item[key])
                                this.addData(tempCntrl, item[key].value);
                        }
                    });
                }
            }
            rdx++;
        });
        return target;
    }
    private addData(tempCntrl: any, data: any) {
        switch (tempCntrl.type) {
            case 'time':
            case 'number':
            case 'text':
            case 'textarea':
                tempCntrl.value = data;
                break;
            case 'dropdown':
            case 'radio':
            case 'condition':
                let options = tempCntrl.options.filter((opt: any) => {
                    opt.defaultSelect = false;
                    return opt;
                });
                let found = options.find((opt: any) => opt.value === data);
                if (found) {
                    found.defaultSelect = true;
                    if (tempCntrl.type === 'condition' || tempCntrl.type === 'dropdown')
                        tempCntrl.value = found.value;
                }
                break;
        }
    }
}
