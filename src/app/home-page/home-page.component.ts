import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { RemoveFileDialogComponent } from '../shared/remove-file-dialog/remove-file-dialog.component';
import { RemoveMultipleFileDialogComponent } from '../shared/remove-multiple-file-dialog/remove-multiple-file-dialog.component';

import { open } from '@tauri-apps/plugin-dialog';
import { openPath } from '@tauri-apps/plugin-opener';

import { EndEllipsisPipe } from '../common/endEllipsisPipe';
import { ProjectInfo } from '../common/utility';
import { TranslateService } from '../services/translate.service';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    EndEllipsisPipe,
    
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit{
  
  projectList: ProjectInfo[] = [];
  searchValue: string = '';
  selectedPath: string | null = null;
  
  readonly dialog = inject(MatDialog);
  
  constructor(
    private router: Router,
    private apiService: ApiService,
    public translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this.translateService.use('en');

    this.apiService.getProjects().subscribe((res) => {
      console.log("res: ", res);
      this.projectList = [... res];
    });
  }

  resetSearchValue() {
    this.searchValue = ''
  }

  filteredProjects() {
    if (!this.searchValue) return this.projectList;

    const term = this.searchValue.toLowerCase();
    return this.projectList.filter(project =>
      project.path.toLowerCase().includes(term)
    );
  }

  openRemoveSingleFileDialog(enterAnimationDuration: string, exitAnimationDuration: string, projectPath: string): void {
    const dialogRef = this.dialog.open(RemoveFileDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeProject(projectPath);
      }
    });
  }

  removeProject(projectPath: string) {
    this.apiService.removeProject(projectPath).subscribe((res) => {
      this.projectList = [... res];
    });
  }

  openRemoveMultipleFileDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(RemoveMultipleFileDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeAllProjects();
      }
    });
  }

  removeAllProjects() {
    this.apiService.removeAllProjects().subscribe((res) => {
      this.projectList = [... res];
    });
  }

  directToProject(projectName: string) {
    console.log("projectName: ", projectName);
    this.router.navigate(['/project']);
  }

  async selectFolder(): Promise<void> {
    const folder = await open({
      directory: true,
      multiple: false,
      title: 'Select a project folder'
    });

    if (folder && typeof folder === 'string') {
      this.selectedPath = folder;
      this.apiService.addProject(this.selectedPath).subscribe((res) => {
        this.projectList = [... res];
      })
    }
  }

  async openFolder(projectPath: string): Promise<void> {
    try {
      await openPath(projectPath);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }
}
