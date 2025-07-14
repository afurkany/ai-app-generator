import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { SetupService } from '../../services/setup.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-edit-message-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './edit-message-dialog.component.html',
  styleUrl: './edit-message-dialog.component.css'
})
export class EditMessageDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditMessageDialogComponent>);

  constructor (public setupService: SetupService) {}

  onClickCancel() {
    this.dialogRef.close(false);
  }

  onClickSend() {
    this.dialogRef.close(true);
  }
}
