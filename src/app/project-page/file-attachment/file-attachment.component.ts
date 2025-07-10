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
import { File } from '../../common/utility';
import { SetupService } from '../../services/setup.service';


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
  selectedfiles: File[] = [];

  constructor (
    public translateService: TranslateService,
    public setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.selectedfiles = [... this.setupService.project[0].files];
    if (this.selectedfiles.length > 0) {
      this.isAnyFileUploaded = true;
    }
  }

  onClickUploadButton() {
    this.selectFolder();
  }

  onClickRemove(selectedFile: File) {
    this.selectedfiles.forEach((file, index) => {
      if (file.path === selectedFile.path) {
        this.selectedfiles.splice(index, 1);
      }
    })

    if (this.selectedfiles.length === 0) {
      this.isAnyFileUploaded = false;
    }
  }

  onClickRemoveAll() {
    this.selectedfiles = [];
    this.isAnyFileUploaded = false;
  }

  async selectFolder(): Promise<void> {
    const files = await open({
      directory: false,
      multiple: true,
      title: 'Select one or more files for testing'
    });

    if (files) {
      files.forEach((file: string) => {
        this.selectedfiles.push(
          {
            name: file.split("\\").at(-1) ?? "",
            path: file ?? "",
          }
        )
      })
      
      if (this.selectedfiles.length > 0) {
        this.isAnyFileUploaded = true;
      }
      console.log(this.selectedfiles);
      // this.apiService.addProject(this.selectedPath).subscribe((res) => {
      //   this.projectList = [... res];
      // })
    }
  }

  ngOnDestroy(): void {
    this.setupService.project[0].files = [... this.selectedfiles];
  }
}
