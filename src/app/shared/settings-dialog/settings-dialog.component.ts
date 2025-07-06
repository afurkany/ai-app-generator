import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';


@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.css'
})
export class SettingsDialogComponent {
  readonly dialogRef = inject(MatDialogRef<SettingsDialogComponent>);

  onClickNo() {
    this.dialogRef.close(false);
  }

  onClickYes() {
    this.dialogRef.close(true);
  }
}
