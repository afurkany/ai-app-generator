import { Component, inject } from '@angular/core';
import {
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-copy-message-snackbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
  ],
  templateUrl: './copy-message-snackbar.component.html',
  styleUrl: './copy-message-snackbar.component.css'
})
export class CopyMessageSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
}
