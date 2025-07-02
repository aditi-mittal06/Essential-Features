import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMON_CONST } from '../constants/common.constant';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    @Inject(MatSnackBar) private _snackBar: MatSnackBar,
    @Inject(NgZone) private _zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}
  showSuccess(message: string): void {
    this.document.body.classList.add('snackbar-open');

    this._zone.run(() => {
      setTimeout(() => {
        this.document.body.classList.remove('snackbar-open');
      }, COMMON_CONST.THREE_SECOND_DELAY);

      this._snackBar.open(message, 'X', {
        duration: 3000,
        panelClass: ['global-success'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }

  showError(message: string): void {
    this.document.body.classList.add('snackbar-open');
    this._zone.run(() => {
      setTimeout(() => {
        this.document.body.classList.remove('snackbar-open');
      }, COMMON_CONST.THREE_SECOND_DELAY);
      // The second parameter is the text in the button.
      // In the third, we send in the css class for the snack bar.
      this._snackBar.open(message, 'X', {
        duration: 3000,
        panelClass: ['global-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    });
  }
}
