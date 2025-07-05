import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';


@Component({
  selector: 'app-remove-multiple-file-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './remove-multiple-file-dialog.component.html',
  styleUrl: './remove-multiple-file-dialog.component.css'
})
export class RemoveMultipleFileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RemoveMultipleFileDialogComponent>);

  onClickNo() {
    this.dialogRef.close(false);
  }

  onClickYes() {
    this.dialogRef.close(true);
  }
}
