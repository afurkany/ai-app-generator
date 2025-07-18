import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { TranslateService } from '../services/translate.service';
import { SettingsDialogComponent } from '../shared/settings-dialog/settings-dialog.component';
import { SideNavPanel, SideNavState } from '../common/utility';

import { ExplorerComponent } from './explorer/explorer.component';
import { FileAttachmentComponent } from './file-attachment/file-attachment.component';
import { ChatComponent } from './chat/chat.component';

import { SetupService } from '../services/setup.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    ExplorerComponent,
    FileAttachmentComponent,
    ChatComponent,
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})
export class ProjectPageComponent implements OnInit{

  // if you want to add or remove any state to SideNavPanel, change SideNavPanel from utility.ts
  sideNavState: SideNavPanel = 'explorer';
  lastNavState: SideNavPanel = "explorer";
  isAnySideNavStateActive = true;
  readonly dialog = inject(MatDialog);

  constructor (
    private router: Router,
    private apiService: ApiService,
    private setupService: SetupService,
    public translateService: TranslateService,
  ) {}
  
  ngOnInit(): void {
    this.translateService.use('en');
  }

  directToProject() {
    this.router.navigate(['/']);
  }

  onMinimizeSideNav() {
    let isAllCollapsed = true;
    if (this.sideNavState) {
      this.lastNavState = this.sideNavState;
      this.sideNavState = null;
      this.isAnySideNavStateActive = false;
      isAllCollapsed = false;
    };

    if (isAllCollapsed) {
      this.isAnySideNavStateActive = true;
      this.sideNavState = this.lastNavState;
    }
  }

  onShowExplorer() {
    this.isAnySideNavStateActive = true;
    this.sideNavState = "explorer";
  }

  onShowAttachedFiles() {
    this.isAnySideNavStateActive = true;
    this.sideNavState = "attachedFiles";
  }
  
  onShowSearchInExplorer() {
    this.isAnySideNavStateActive = true;
    this.sideNavState = "search";
  }

  onShowFileComparison() {
    this.isAnySideNavStateActive = true;
    this.sideNavState = "sourceControl";
  }

  onShowSettings(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        
      }
    });
  }

  // resizing sidenav
  sidenavWidth = 300; // default width
  private xOffset = 50;
  private isResizing = false;
  
  startResize() {
    this.isResizing = true;

    const onMouseMove = (e: MouseEvent) => {
      if (this.isResizing) {
        const newWidth = e.clientX - this.xOffset;
        
        // clamp min/max values
        const vwUnit = window.innerWidth / 100;
        console.log("vwUnit: ", vwUnit);
        this.sidenavWidth = Math.max(400, Math.min(newWidth, vwUnit * 80));
        
        // set width in setupService
        this.setupService.screenWidth = this.sidenavWidth;
        this.setupService.truncateLength = this.setupService.setTruncateLength(
          this.setupService.screenWidth
        );
      }
    };

    const onMouseUp = () => {
      this.isResizing = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
