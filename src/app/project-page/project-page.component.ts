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
import { SideNavState } from '../common/utility';


@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.css'
})
export class ProjectPageComponent implements OnInit{

  // if you want to add or remove any state from below, also change the inherit from utility.ts
  sideNavState: SideNavState = {
    isShowExplorer: true,
    isShowAttachedFiles: false,
    isShowSearchInExplorer: false,
    isShowSourceControl: false,
  }
  lastNavState: keyof SideNavState = "isShowExplorer";
  isAnySideNavStateActive = true;
  readonly dialog = inject(MatDialog);

  constructor (
    private router: Router,
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
    for (const key of Object.keys(this.sideNavState) as (keyof SideNavState)[]) {
      if (this.sideNavState[key]) {
        this.lastNavState = key;
        this.sideNavState[key] = false;
        this.isAnySideNavStateActive = false;
        isAllCollapsed = false;
        break;
      };
    }

    if (isAllCollapsed) {
      this.isAnySideNavStateActive = true;
      this.sideNavState[this.lastNavState] = true;
    }
  }

  onShowExplorer() {
    this.isAnySideNavStateActive = true;
    this.setActivePanel("isShowExplorer");
  }

  onShowAttachedFiles() {
    this.isAnySideNavStateActive = true;
    this.setActivePanel("isShowAttachedFiles");
  }
  
  onShowSearchInExplorer() {
    this.isAnySideNavStateActive = true;
    this.setActivePanel("isShowSearchInExplorer");
  }

  onShowFileComparison() {
    this.isAnySideNavStateActive = true;
    this.setActivePanel("isShowSourceControl");
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
        this.sidenavWidth = Math.max(vwUnit * 10, Math.min(newWidth, vwUnit * 80));
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

  private setActivePanel(targetKey: keyof SideNavState) {
    for (const key of Object.keys(this.sideNavState) as (keyof SideNavState)[]) {
      this.sideNavState[key] = (key === targetKey);
    }
  }
}
