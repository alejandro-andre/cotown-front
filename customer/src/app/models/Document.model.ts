import { FormControl } from '@angular/forms';
import { IDocFile, IDocType, IDocument } from '../constants/Interface';

export class Document implements IDocument {

  id: number;
  expiry_date: string | null = null;
  front?: IDocFile;
  back?: IDocFile;
  frontFile?: File;
  backFile?: File;
  doc_type?: IDocType;
  formDateControl: FormControl = new FormControl();

  constructor(data: IDocument = {} as IDocument ) {
    this.id = data.id;
    this.expiry_date = data.expiry_date;
    this.front = data.front;
    this.back = data.back;
    this.doc_type = data.doc_type
    this.formDateControl = new FormControl();
  }

};
