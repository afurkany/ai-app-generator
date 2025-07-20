import { Injectable, signal } from '@angular/core';
import { Project, ProjectResponse } from '../common/utility';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetupService {
  screenWidth: number = 400;
  
  /* Active user message */
  /* ------------------- */
  public _activeUserMessage = signal('');

  public get activeUserMessage(): string {
    return this._activeUserMessage();
  }

  public set activeUserMessage(value: string) {
    this._activeUserMessage.set(value);
  }

  /* Active project */
  private activeProjectSubject = new BehaviorSubject<Project | null>(null);
  public activeProject$ = this.activeProjectSubject.asObservable();

  setActiveProject(project: Project) {
    this.activeProjectSubject.next(project);
  }

  getActiveProject(): Project | null {
    return this.activeProjectSubject.value;
  }

  constructor() { }

  setTruncateLength(width: number) {
    if (width <= 400) {
      return 30;

    } else if (width <= 500) {
      return 40;

    } else if (width <= 600) {
      return 50;

    } else if (width <= 700) {
      return 60;

    } else if (width <= 800) {
      return 70;

    } else if (width <= 900) {
      return 80;

    } else if (width <= 1000) {
      return 90;

    } else {
      return 100;
    }
  }

  truncateLength = this.setTruncateLength(this.screenWidth);

  public convertProjectResponse(res: ProjectResponse) {
    let activeProject: Project = {
      projectId: '',
      projectName: '',
      mainFolderPath: '',
      testFolderPath: '',
      creationDate: '',
      lastModificationDate: '',
      modelName: '',
      files: [],
      chatHistory: [],
    }

    activeProject.projectId = res.project_id;
    activeProject.projectName = res.project_name;
    activeProject.mainFolderPath = res.main_folder_path;
    activeProject.testFolderPath = res.test_folder_path;
    activeProject.creationDate = res.creation_date;
    activeProject.lastModificationDate = res.last_modification_date;
    activeProject.modelName = res.model_name;
    
    res.files.forEach((file: any) => {
      activeProject.files.push(
        {
          name: file.file_name,
          path: file.file_path
        }
      )
    })
    
    activeProject.chatHistory = [... res.chat_history];

    return activeProject;
  }
}
