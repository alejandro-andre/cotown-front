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
  constructor(public dialogRef: MatDialogRef<ModalComponent>,  @Inject(MAT_DIALOG_DATA) data: {
    title: string,
    message: string
  }) {
    this.message = data.message;
    this.title = data.title;

  }

  closeModal() {
    this.dialogRef.close();
  }
}
