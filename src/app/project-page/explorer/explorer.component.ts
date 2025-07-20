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

  rootFolderName = '';
  mainFolderPath: string = '';
  testFolderPath: string = '';
  mainTree: TreeNode | null = null;
  testTree: TreeNode | null = null;
  

  ngOnInit() {
    this.apiService.getProjectTree().subscribe((response) => {
      this.mainFolderPath = response.mainPath;
      let folderName = response.mainPath.split("\\").at(-1) ?? ""
      this.mainTree = this.buildTree(response.mainData, folderName, 0);

      this.testFolderPath = response.testPath;
      folderName = response.testPath.split("\\").at(-1) ?? ""
      this.testTree = this.buildTree(response.testData, folderName, 0);
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
      await openPath(this.mainFolderPath);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }

  async onGoToTestProjectFolder(): Promise<void> {
    try {
      await openPath(this.testFolderPath);
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  }
}
