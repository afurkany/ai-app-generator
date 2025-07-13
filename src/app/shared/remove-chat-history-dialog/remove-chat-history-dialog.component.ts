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
  selector: 'app-remove-chat-history-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './remove-chat-history-dialog.component.html',
  styleUrl: './remove-chat-history-dialog.component.css'
})
export class RemoveChatHistoryDialogComponent {
  readonly dialogRef = inject(MatDialogRef<RemoveChatHistoryDialogComponent>);

  onClickNo() {
    this.dialogRef.close(false);
  }

  onClickYes() {
    this.dialogRef.close(true);
  }
}
