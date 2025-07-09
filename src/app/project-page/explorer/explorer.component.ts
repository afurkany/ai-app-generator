import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreeNode } from '../../common/utility';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ExplorerNodeComponent } from './explorer-node/explorer-node.component';


@Component({
  selector: 'app-explorer',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ExplorerNodeComponent,
  ],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css'
})
export class ExplorerComponent implements OnInit {

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
    this.tree = this.buildTree(this.rawData, this.rootFolderName, 0);
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

    console.log("node: ", node);
    return node;
  }
}
