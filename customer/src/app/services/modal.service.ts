import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from '../customer/modal/modal.component';

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  constructor(public matDialog: MatDialog) {}

  openModal(body: { title: string, message: string, type: string | null }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal";
    dialogConfig.width = "500px";
    dialogConfig.data = body;
    const modalDialog = this.matDialog.open(ModalComponent, dialogConfig);
    modalDialog.afterClosed().subscribe((res) => {
      modalDialog.close();
    })
  }

  confirmModal(body: { title: string, message: string, type: string | null }) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal";
    dialogConfig.width = "500px";
    dialogConfig.data = body;
    return this.matDialog.open(ModalComponent, dialogConfig);
  }
};
