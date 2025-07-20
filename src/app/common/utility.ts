export interface ProjectInfoResponse {
  project_id: string;
	project_name: string;
	main_folder_path: string;
	test_folder_path: string;
  creation_date: string;
  last_modification_date: string;
  model_name: string;
}

export interface ProjectInfo {
  projectId: string;
	projectName: string;
	mainFolderPath: string;
	testFolderPath: string;
  creationDate: string;
  lastModificationDate: string;
  modelName: string;
}

export interface ProjectResponse {
  project_id: string;
	project_name: string;
	main_folder_path: string;
	test_folder_path: string;
  creation_date: string;
  last_modification_date: string;
  model_name: string;
  files: File[];
  chat_history: ChatMessage[];
}

export interface Project {
  projectId: string;
	projectName: string;
	mainFolderPath: string;
	testFolderPath: string;
  creationDate: string;
  lastModificationDate: string;
  modelName: string;
  files: File[];
  chatHistory: ChatMessage[];
}

export interface File {
  name: string;
  path: string;
}

export interface SideNavState {
  isShowExplorer: boolean;
  isShowAttachedFiles: boolean;
  isShowSearchInExplorer: boolean;
  isShowSourceControl: boolean;
}

export type SideNavPanel = 'explorer' | 'attachedFiles' | 'search' | 'sourceControl' | null;

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
  id: number,
  role: 'user' | 'assistant';
  message: string;
}
