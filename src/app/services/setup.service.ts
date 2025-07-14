import { Injectable, signal } from '@angular/core';
import { ChatMessage, Project } from '../common/utility';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  activeProjectPath: string = '';
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

  project: Project[] = [
    {
      name: "trial project",
      path: "sample_path",
      files: [],
    }
  ];

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
}
