import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../customer/modal/modal.component';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  constructor(public matDialog: MatDialog) {}

  openModal(body: { title: string, message: string }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "300px";
    dialogConfig.width = "500px";
    dialogConfig.data = body;
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);

    modalDialog.afterClosed().subscribe((resp) => {
      modalDialog.close();
    })
  }
};
