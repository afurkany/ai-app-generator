export interface ProjectInfo {
	name: string;
	path: string;
}

export interface Project {
  name: string;
  path: string;
  files: File[];
}

export interface SideNavState {
  isShowExplorer: boolean;
  isShowAttachedFiles: boolean;
  isShowSearchInExplorer: boolean;
  isShowSourceControl: boolean;
}

export type SideNavPanel = 'explorer' | 'attachedFiles' | 'search' | 'sourceControl' | null;

export interface File {
  name: string;
  path: string;
}

export interface TreeNode {
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  level?: number;
}

export interface ModelTypeSelection {
  key: string;
  value: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
}
