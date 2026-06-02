import { FormControl } from '@angular/forms';
import { IDocFile, IDocType, IDocument } from '../constants/Interface';

export class Document implements IDocument {

  id: number;
  expiry_date: string | null = null;
  doc_option_id?: number;
  original_doc_option_id?: number;
  booking_id?: number;
  approved?: boolean;
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
    this.doc_type = data.doc_type;
    this.doc_option_id = data.doc_option_id ?? ((data.doc_type?.options?.length ?? 0) === 1 ? data.doc_type!.options[0].id : undefined);
    this.original_doc_option_id = this.doc_option_id;
    this.booking_id = data.booking_id;
    this.approved = data.approved;
    this.formDateControl = new FormControl({ value: data.expiry_date ?? null, disabled: !!data.approved });
  }

};
