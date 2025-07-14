import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeNode } from '../../common/utility';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExplorerNodeComponent } from './explorer-node/explorer-node.component';
import { TranslateService } from '../../services/translate.service';

import { openPath } from '@tauri-apps/plugin-opener';
import { SetupService } from '../../services/setup.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    ExplorerNodeComponent,
  ],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent implements OnInit {

  constructor (
    private setupService: SetupService,
    private apiService: ApiService,
    public translateService: TranslateService
  ) {}

  rootFolderName = 'beverages';
  rawData: any = {
    'beverages': {
      child_folder: ['tea', 'coffee'],
      child_file: ['water'],
      level: 1,
    },
    'tea': {
      child_folder: ['chinese tea'],
      child_file: ['black tea', 'white tea'],
      level: 2,
    },
    'coffee': {
      child_folder: [],
      child_file: ['americano', 'latte'],
      level: 2,
    },
    'chinese tea': {
      child_folder: [],
      child_file: [],
      level: 3,
    }
  };

  tree: TreeNode | null = null;

  ngOnInit() {
    this.apiService.getProjectTree(this.setupService.activeProjectPath).subscribe((response) => {
      const folderName = this.setupService.activeProjectPath.split("\\").at(-1) ?? ""
      this.tree = this.buildTree(response, folderName, 0);
    })
  }

  buildTree(data: any, folderName: string, level: number): TreeNode {
    const node: TreeNode = {
      name: folderName,
      type: 'folder',
      children: [],
      level: level,
    };

    const info = data[folderName];
    if (!info) return node;

    info.child_folder.forEach((folder: string) => {
      node.children!.push(this.buildTree(data, folder, level+1));
    });

    info.child_file.forEach((file: string) => {
      node.children!.push({ name: file, type: 'file', level: level+1 });
    });
    return node;
  }

  syncProjectFolder() {
    throw new Error('Method not implemented.');
  }

  async onGoToMainProjectFolder(): Promise<void> {
    try {
      await openPath(this.setupService.activeProjectPath);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }

  async onGoToTestProjectFolder(): Promise<void> {
    try {
      await openPath(this.setupService.activeProjectPath);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }
}
