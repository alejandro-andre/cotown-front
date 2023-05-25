import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-error-view',
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

  ngOnInit() {
  }

  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    alert("You have logged out.");
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }

}
