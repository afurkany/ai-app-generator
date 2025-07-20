import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EndEllipsisPipe } from '../../common/endEllipsisPipe';
import { open } from '@tauri-apps/plugin-dialog';

import { TranslateService } from '../../services/translate.service';
import { File, Project, ProjectResponse } from '../../common/utility';
import { SetupService } from '../../services/setup.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-file-attachment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    EndEllipsisPipe,
  ],
  templateUrl: './file-attachment.component.html',
  styleUrl: './file-attachment.component.css'
})
export class FileAttachmentComponent implements OnInit, OnDestroy {

  @ViewChild('mainContainer') mainContainerRef!: ElementRef;
  
  isAnyFileUploaded: boolean = false;
  project: Project | null = null; 
  selectedfiles: File[] = [];

  constructor (
    public translateService: TranslateService,
    public setupService: SetupService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.setupService.activeProject$.subscribe((project) => {
      if (project) {
        this.project = project;
        this.selectedfiles = project.files;
        if (this.selectedfiles.length > 0) {
          this.isAnyFileUploaded = true;
        }
      }
    });
  }

  onClickUploadButton() {
    this.selectFolder();
  }

  onClickRemove(selectedFile: File) {
    this.selectedfiles.forEach((file, index) => {
      if (file.path === selectedFile.path) {
        this.selectedfiles.splice(index, 1);
        
        if (this.project !== null) {
          this.apiService.updateProject(
            this.project.projectId, { files: this.selectedfiles }
          ).subscribe((updatedProject: ProjectResponse) => {
            this.project = this.setupService.convertProjectResponse(updatedProject);
            this.selectedfiles = [... this.project.files];
          });
        }
      }
    })

    if (this.selectedfiles.length === 0) {
      this.isAnyFileUploaded = false;
    }
  }

  onClickRemoveAll() {
    this.selectedfiles = [];

    if (this.project !== null) {
      this.apiService.updateProject(
        this.project.projectId, { files: this.selectedfiles }
      ).subscribe((updatedProject: ProjectResponse) => {
        this.project = this.setupService.convertProjectResponse(updatedProject);
        this.selectedfiles = [... this.project.files];
        this.isAnyFileUploaded = false;
      });
    }
  }

  async selectFolder(): Promise<void> {
    const files = await open({
      directory: false,
      multiple: true,
      title: 'Add one or more files for testing'
    });

    if (files) {
      files.forEach((file: string) => {
        const fName = file.split("\\").at(-1) ?? "";
        const fPath = file ?? ""

        for (let idx=0; idx < this.selectedfiles.length; idx++) {
          if (this.selectedfiles[idx].name === fName && this.selectedfiles[idx].path === fPath) {
            this.selectedfiles.splice(idx, 1);
            break;
          }
        }

        this.selectedfiles.push(
          {
            name: fName,
            path: fPath,
          }
        )
      })

      // update database
      if (this.project) {
        this.apiService.updateProject(
          this.project.projectId, { files: this.selectedfiles }
        ).subscribe((updatedProject: ProjectResponse) => {
            this.project = this.setupService.convertProjectResponse(updatedProject);
            this.selectedfiles = [... this.project.files];
          } 
        );
      }
      
      if (this.selectedfiles.length > 0) {
        this.isAnyFileUploaded = true;
      }
    }
  }

  ngOnDestroy(): void {}
}
