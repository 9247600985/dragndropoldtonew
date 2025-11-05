import { option } from "./option";
import { logic } from './logic';
import { StyleClass } from "./style-class";

export class control
{
  id: string;
  name: string;
  value?: string;
  label: string;
  //question: string;
  type: string;
  defaultType: string;
  options: option[];
  checked: boolean;
  alignment?: string;
  min?: number;
  max?: number;
  step?: number;
  logic?: logic;
  displayLogic?: logic[];
  matTable?: any;
  canShow: boolean;
  formData?: formsData;
  width?:number = 12;
  ejsValue?:string;
  ejsText?:string;
  ejsClassList?:any;
  parent?:any;
  parentType?:any;
  controls?:any;
  customIndexes?:any[];
  attrs?:any;
  needLabel?:boolean;
  styleClasses?:any;
  styleSource?:any;
  autoGrow?:boolean;
}

export class formsData
{
  type?: string;
  operation?: string;
  action?: string;
  actionSet?: any[];
  service?: string;
  inputParams?: any[];
  outputParams?: any[];
  element?: string;
  actionArray?: any[];
  elementsArray?: any[];
}