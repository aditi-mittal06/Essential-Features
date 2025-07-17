import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-confirm-dialog',
  imports: [SharedModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  message: string = '';
  recordName: string = '';

  @Output() submitClicked = new EventEmitter<boolean>();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { message: string; recordName: string },
    private readonly dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
    this.message = data.message;
    this.recordName = data.recordName;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
