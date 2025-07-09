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
export class FileAttachmentComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mainContainer') mainContainerRef!: ElementRef;
  
  isAnyFileUploaded: boolean = false;
  selectedfiles: File[] = [];
  truncateLength = 50;

  constructor (
    public translateService: TranslateService,
    private setupService: SetupService
  ) {}

  ngOnInit(): void {
    this.selectedfiles = [... this.setupService.project[0].files];
    if (this.selectedfiles.length > 0) {
      this.isAnyFileUploaded = true;
    }
  }

  ngAfterViewInit() {
    const el = this.mainContainerRef.nativeElement;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        console.log("width: ", width);
        this.truncateLength = this.setTruncateLength(width);
      }
    });

    resizeObserver.observe(el);
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

  private setTruncateLength(width: number) {
    if (width < 400) {
      return 20;

    } else if (width < 500) {
      return 35;

    } else if (width < 600) {
      return 45;

    } else if (width < 700) {
      return 55;

    } else if (width < 800) {
      return 65;

    } else if (width < 900) {
      return 80;

    } else if (width < 1000) {
      return 90;

    } else {
      return 110;
    }
  }

  ngOnDestroy(): void {
    this.setupService.project[0].files = [... this.selectedfiles];
  }
}
