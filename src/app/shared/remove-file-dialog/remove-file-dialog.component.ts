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
  selector: 'app-remove-file-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './remove-file-dialog.component.html',
  styleUrl: './remove-file-dialog.component.css'
})
export class RemoveFileDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RemoveFileDialogComponent>);

  onClickNo() {
    this.dialogRef.close(false);
  }

  onClickYes() {
    this.dialogRef.close(true);
  }
}
