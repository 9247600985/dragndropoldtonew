import { control } from "./control";

export class form
{
  id:string;
  deptCode?: string;
  sectionId?: string;
  tempId: string;
  tempType: string;
  tempName: string;
  checked: boolean;
  ISLOADFORM: string;
  controls: control[];
}