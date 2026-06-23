import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-dialog',
  templateUrl: 'document-dialog.component.html',
})
export class DocumentDialogComponent {

  public title: string;
  public urls: SafeResourceUrl[];

  constructor(
    public dialogRef: MatDialogRef<DocumentDialogComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title || 'Documento';
    this.urls = (data.urls || []).map((u: string) => this.sanitizer.bypassSecurityTrustResourceUrl(u));
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
