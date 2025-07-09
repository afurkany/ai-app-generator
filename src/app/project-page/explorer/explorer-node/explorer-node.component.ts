import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { TreeNode } from '../../../common/utility';
import { TranslateService } from '../../../services/translate.service';


@Component({
  selector: 'app-explorer-node',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: './explorer-node.component.html',
  styleUrl: './explorer-node.component.css'
})
export class ExplorerNodeComponent {
  @Input() node!: TreeNode;
  @Input() rootFolderName!: string;
  expanded = false;

  constructor (public translateService: TranslateService) {} 

  toggle() {
    this.expanded = !this.expanded;
  }

  onExpandTree() {
    
  }
}
