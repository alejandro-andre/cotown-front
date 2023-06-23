import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})

export class ModalComponent {

  public message: string = '';
  public title: string = '';
  public type: string = 'ok';

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,  
    @Inject(MAT_DIALOG_DATA) data: {
      title: string,
      message: string,
      type: string
    }
  ) {
    this.message = data.message;
    this.title = data.title;
    this.type = data.type || 'ok';
  }

  onOkClick() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
